// src/components/DriveVideos.jsx
import React, { useState, useEffect } from 'react';
import VideoList from './VideoList';
import VideoPlayer from './VideoPlayer';
import MovieForm from "./MovieForm";
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const DriveVideos = ({user}) => {
  const [videos, setVideos] = useState([]);
  const [linkMovies, setLinkMovies] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // 1️⃣ Fetch movies from Drive (/api/poster)
        const response = await fetch('/api/poster'); // 🔥 call serverless API
        const data = await response.json();
        // console.log(data);
        setVideos(data.movies || []);

        // 2️⃣ Fetch movies from Firestore (linkMovies collection)
        const snap = await getDocs(collection(db, "linkMovies"));
        const firebaseMovies = snap.docs.map((doc) => doc.data());
        setLinkMovies(firebaseMovies);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <Container sx={{ py: 2 }}>
      <Typography variant="h5" gutterBottom align="center">
        Google Drive Video Player
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Video Player on Top */}
          <Box sx={{ mb: 3 }}>
            {/* Swap VideoPlayer with CustomVideoPlayer if you want custom controls */}
            <VideoPlayer video={selectedVideo} />
            {/* <CustomVideoPlayer video={selectedVideo} /> */}
          </Box>

          {/* Video List Below */}
          {videos.length > 0 && <VideoList title={"Drive"} user={user} videos={videos} onSelect={setSelectedVideo} />}

          {linkMovies.length > 0 && <VideoList title={"Added"} user={user} videos={linkMovies} onSelect={setSelectedVideo} />}
        </>
      )}
      <MovieForm />
    </Container>
  );
};

export default DriveVideos;
