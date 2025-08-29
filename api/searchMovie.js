// /pages/api/searchMovie.js
export default async function handler(req, res) {
  const { name, link } = req.query;
  const OMDB_API_KEY = process.env.OMDB_API_KEY;
  const DRIVE_API_KEY = process.env.DRIVE_API_KEY;

  if (!name || !link) {
    return res.status(400).json({ error: "Movie name and Drive link are required" });
  }

  // Extract Drive file ID
  const extractDriveId = (url) => {
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : null;
  };

  const fileId = extractDriveId(link);
  if (!fileId) {
    return res.status(400).json({ error: "Invalid Drive link" });
  }

  try {
    // Step 1: Fetch Drive file details
    const fileRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,size,createdTime&key=${DRIVE_API_KEY}`
    );
    const fileDetails = await fileRes.json();

    if (fileDetails.error) {
      return res.status(404).json({ error: "Unable to fetch Drive file details" });
    }

    // Step 2: Fetch related movies from OMDb
    const movieRes = await fetch(
      `https://www.omdbapi.com/?s=${encodeURIComponent(name)}&apikey=${OMDB_API_KEY}`
    );
    const movieData = await movieRes.json();

    if (movieData.Response === "False") {
      return res.status(404).json({ error: "No movies found", fileDetails });
    }

    // Sort movies by year (latest first)
    const sortedMovies = movieData.Search.sort((a, b) => {
      const yearA = parseInt(a.Year) || 0;
      const yearB = parseInt(b.Year) || 0;
      return yearB - yearA;
    });

    return res.status(200).json({
      fileDetails,
      movies: sortedMovies,
    });

  } catch (error) {
    console.error("Error in searchMovie API:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
