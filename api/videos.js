// api/videos.js
export default async function handler(req, res) {
  const API_KEY = process.env.DRIVE_API_KEY;
  const FOLDER_ID = process.env.DRIVE_FOLDER_ID;
  console.log(API_KEY, FOLDER_ID);

  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType+contains+'video'&fields=files(id,name,mimeType)&key=${API_KEY}`
    );
    const data = await response.json();

    res.status(200).json({ files: data.files || [] });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
}
