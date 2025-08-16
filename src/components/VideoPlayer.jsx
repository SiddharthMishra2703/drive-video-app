// src/components/VideoPlayer.jsx
import React from 'react';

const VideoPlayer = ({ video }) => {
  if (!video) return <p>Select a video to play</p>;

  return (
    <div>
      <h3>Now Playing: {video.name}</h3>
      <iframe
        title={video.name}
        src={`https://drive.google.com/file/d/${video.id}/preview`}
        width="100%"
        height="500"
        allow="autoplay"
        allowFullScreen
        style={{ border: 'none' }}
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
