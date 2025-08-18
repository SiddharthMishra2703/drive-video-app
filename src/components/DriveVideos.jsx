import React, { useState, useEffect } from 'react';
import VideoList from './VideoList';
import VideoPlayer from './VideoPlayer';

const API_KEY = import.meta.env.VITE_API_KEY;
const FOLDER_ID = import.meta.env.VITE_FOLDER_ID;

const DriveVideos = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType+contains+'video'&fields=files(id,name,mimeType)&key=${API_KEY}`
        );
        const data = await response.json();
        setVideos(data.files || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Google Drive Video Player</h1>
      <VideoList videos={videos} onSelect={setSelectedVideo} />
      <VideoPlayer video={selectedVideo} />
    </div>
  );
};

export default DriveVideos;
