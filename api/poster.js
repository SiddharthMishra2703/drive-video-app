// api/poster.js
// import fetch from "node-fetch";
// import { initializeApp, applicationDefault } from "firebase-admin/app";
// import { getFirestore } from "firebase-admin/firestore";

// let app;
// if (!global._firebaseInitialized) {
//   app = initializeApp({ credential: applicationDefault() });
//   global._firebaseInitialized = true;
// }
// const db = getFirestore();

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app;

// prevent re-initialization in serverless
if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

  app = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

// API keys from env
const DRIVE_API_KEY = process.env.DRIVE_API_KEY;
const DRIVE_FOLDER_ID = process.env.DRIVE_FOLDER_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL;
const OMDB_API_KEY = process.env.OMDB_API_KEY;

export default async function handler(req, res) {
    try {
        // 1. Fetch Drive files
        const driveRes = await fetch(
            `https://www.googleapis.com/drive/v3/files?q='${DRIVE_FOLDER_ID}'+in+parents+and+mimeType+contains+'video'&fields=files(id,name,mimeType)&key=${DRIVE_API_KEY}`
        );
        const driveData = (await driveRes.json()).files || [];
        console.log("Poster API called");

    // 2. Get cached movies from Firestore
    const cachedSnap = await db.collection("movies").get();
    const cached = {};
    cachedSnap.forEach(doc => {
      cached[doc.id] = doc.data();
    });

    // 3. Filter new movies
    const newMovies = driveData.filter(m => !cached[m.id]);

    let cleaned = [];
    if (newMovies.length > 0) {
      // 4. Clean with Gemini
      const prompt = `
        You are given a list of raw movie file names with their ids in JSON format.  
        For each movie, extract a clean "title" and "year" from the file name, and include the same "id".  
        Return the result strictly as a JSON array with objects having exactly these keys: "id", "title", "year".  

        Movies list:
        ${JSON.stringify(newMovies, null, 2)}
      `;

      const geminiRes = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      });
      const geminiData = await geminiRes.json();
      const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      const cleanedText = text.replace(/```json/i, "").replace(/```/g, "").trim();

      try {
        cleaned = JSON.parse(cleanedText);
      } catch {
        cleaned = [];
      }

      // 5. Add posters via OMDb
      for (const movie of cleaned) {
        const omdbRes = await fetch(
          `https://www.omdbapi.com/?t=${encodeURIComponent(movie.title)}&y=${movie.year}&apikey=${OMDB_API_KEY}`
        );
        const omdbData = await omdbRes.json();
        movie.poster = omdbData?.Poster && omdbData.Poster !== "N/A" ? omdbData.Poster : null;

        // 6. Save in Firestore
        // await db.collection("movies").doc(movie.id).set(movie);
        // 6. Save in Firestore (batch write)
        if (cleaned.length > 0) {
        const batch = db.batch();
        cleaned.forEach(movie => {
            const docRef = db.collection("movies").doc(movie.id);
            batch.set(docRef, movie);
        });
        await batch.commit();
        }
        console.log(`Saved movie`);
      }
    }

    // 7. Return all movies (cached + new)
    const finalSnap = cleaned.length ? await db.collection("movies").get() : cachedSnap;
    const result = [];
    finalSnap.forEach(doc => result.push(doc.data()));

    res.status(200).json({ movies: result });
    // res.status(200).json({cleaned: cleaned});
  } catch (err) {
    console.error("Poster API error:", err);
    res.status(500).json({ error: "Failed to fetch posters" });
  }
}
