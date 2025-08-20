// src/components/DriveVideos.jsx
import React, { useState, useEffect } from 'react';
import VideoList from './VideoList';
import VideoPlayer from './VideoPlayer';
import CustomVideoPlayer from './CustomVideoPlayer';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

const API_KEY = import.meta.env.VITE_API_KEY;
const FOLDER_ID = import.meta.env.VITE_FOLDER_ID;

const DriveVideos = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchVideos = async () => {
  //     try {
  //       const response = await fetch(
  //         `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType+contains+'video'&fields=files(id,name,mimeType)&key=${API_KEY}`
  //       );
  //       const data = await response.json();
  //       setVideos(data.files || []);
  //     } catch (error) {
  //       console.error('Error fetching videos:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchVideos();
  // }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/poster'); // 🔥 call serverless API
        const data = await response.json();
        // console.log(data);
        
        setVideos(data || []);
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
          {videos && <VideoList videos={videos.movies} onSelect={setSelectedVideo} />}
        </>
      )}
    </Container>
  );
};

export default DriveVideos;
