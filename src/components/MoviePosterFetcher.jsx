import React, { useEffect, useState } from "react";

const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;


const driveData = [
  {
    id: "1sV70bl3hVmbFGB6jNWV62ot-GRAWuDYe",
    name: "MLWBD.com Doraemon Nobita and the Kingdom of Clouds (1992) REMASTERED 1080p HEVC Hindi.mkv",
    mimeType: "video/x-matroska"
  },
  {
    id: "1r5nV_M6WFgNqYtvUeW4vepSNwC3rDj3F",
    name: "Game Changer (2025) Dual ORG 1080p HEVC.mkv",
    mimeType: "video/x-matroska"
  },
  {
    id: "1N90m8hFqwXZhPFrBwwgdXbhghpV2vXHe",
    name: "Chhaava.2025.Hindi.HC.PREHD.1080p.HEVC.mkv",
    mimeType: "video/x-matroska"
  },
  {
    id: "1kTfAkaZtk07w4WZ1GZB1_h7-ARM2FjAr",
    name: "Mflixbd.com|Mlwbd.com-Tumbbad.2018.720p.WEB-DL.x264.AAC-Mkvking.com.mkv",
    mimeType: "video/x-matroska"
  },
  {
    id: "1NRjCQYbhQNF8hF4pBHw-_NglbsKyhxrq",
    name: "Bramayugam 2024 Dual ORG 720p.mkv",
    mimeType: "video/x-matroska"
  }
];

export default function MoviePosterFetcher() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Gemini Prompt ---
  const buildPrompt = (movies) => `
    You are given a list of raw movie file names with their ids in JSON format.  
    For each movie, extract a clean "title" and "year" from the file name, and include the same "id".  

    Return the result strictly as a JSON array with objects having exactly these keys: "id", "title", "year".  

    Movies list:
    ${JSON.stringify(movies, null, 2)}

    Output format example:
    [
      { "id": "1", "title": "Inception", "year": "2010" },
      { "id": "2", "title": "Doraemon: Nobita and the Kingdom of Clouds", "year": "1992" }
    ]
  `;

  // --- Call Gemini API ---
  const askGemini = async (prompt) => {
    const result = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await result.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const cleanedText = text
      .replace(/```json/i, "")
      .replace(/```/g, "")
      .trim();

    try {
      const parsed = JSON.parse(cleanedText);
      return Array.isArray(parsed) ? parsed : [parsed]; // always return array
    } catch {
      console.warn("Gemini response parse failed, raw:", cleanedText);
      return [];
    }
  };

  // --- Get Poster from OMDb ---
  const getPoster = async (title, year) => {
    const res = await fetch(
      `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&y=${year}&apikey=${OMDB_API_KEY}`
    );
    const data = await res.json();
    return data?.Poster && data.Poster !== "N/A" ? data.Poster : null;
  };

  // --- Main Flow ---
  // const handleFetchPoster = async () => {
  //   setLoading(true);
  //   try {
  //     const prompt = buildPrompt(driveData);
  //     const cleaned = await askGemini(prompt);

  //     const withPosters = await Promise.all(
  //       cleaned.map(async (movie) => {
  //         const poster = await getPoster(movie.title, movie.year);
  //         return { ...movie, poster };
  //       })
  //     );

  //     setMovies(withPosters);
  //   } catch (e) {
  //     console.error("Error cleaning or fetching posters:", e);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // Auto run on mount
  // useEffect(() => {
  //   handleFetchPoster();
  // }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await fetch("/api/poster");
      const data = await res.json();
      setMovies(data.movies);
    };
    fetchMovies();
  }, []);


  return (
    <div className="p-6">
      {loading && <p className="text-center text-gray-600">Fetching movies...</p>}

      <div className="grid grid-cols-2 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="shadow-lg rounded-xl p-4 text-center">
            {movie.poster ? (
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-64 object-cover rounded-lg mb-2"
              />
            ) : (
              <div className="w-full h-64 bg-gray-300 flex items-center justify-center rounded-lg mb-2">
                No Poster
              </div>
            )}
            <h2 className="text-lg font-bold">{movie.title}</h2>
            <p className="text-sm text-gray-600">Year: {movie.year}</p>
            <p className="text-xs text-gray-500">ID: {movie.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
