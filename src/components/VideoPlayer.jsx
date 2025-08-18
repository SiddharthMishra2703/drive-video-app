// src/components/VideoPlayer.jsx
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const VideoPlayer = ({ video }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        // Try locking to landscape when entering fullscreen
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('landscape').catch(() => {
            console.warn('Orientation lock not supported');
          });
        }
      } else {
        // Unlock back to default when exiting fullscreen
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!video) return <Typography align="center">Select a video to play</Typography>;

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Now Playing: {video.name}
        </Typography>
        <Box
          sx={{
            position: 'relative',
            paddingTop: '56.25%', // 16:9
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <iframe
            ref={iframeRef}
            title={video.name}
            src={`https://drive.google.com/file/d/${video.id}/preview`}
            allow="autoplay"
            allowFullScreen
            style={{
              border: 'none',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
