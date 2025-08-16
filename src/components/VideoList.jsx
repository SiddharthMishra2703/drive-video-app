// src/components/VideoList.jsx
import React from 'react';

const VideoList = ({ videos, onSelect }) => {
  return (
    <div>
      <h2>Your Drive Videos</h2>
      {videos.length === 0 && <p>No videos found.</p>}
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {videos.map((video) => (
          <li key={video.id} style={{ marginBottom: '0.5rem' }}>
            <button onClick={() => onSelect(video)} style={{ padding: '0.5rem 1rem' }}>
              {video.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoList;
