// src/components/CustomVideoPlayer.jsx
import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const CustomVideoPlayer = ({ video }) => {
  const videoRef = useRef(null);
  const [lastTap, setLastTap] = useState(0);

  // Restore last watched time from localStorage
  useEffect(() => {
    if (video && videoRef.current) {
      const savedTime = localStorage.getItem(`video-${video.id}-time`);
      if (savedTime) {
        videoRef.current.currentTime = parseFloat(savedTime);
      }
    }
  }, [video]);

  // Save time periodically
  const handleTimeUpdate = () => {
    if (video && videoRef.current) {
      localStorage.setItem(
        `video-${video.id}-time`,
        videoRef.current.currentTime
      );
    }
  };

  // Double tap skip handler
  const handleTap = (e) => {
    const now = Date.now();
    if (now - lastTap < 300) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const el = videoRef.current;
      if (el) {
        if (x < rect.width / 2) {
          el.currentTime = Math.max(0, el.currentTime - 10); // rewind
        } else {
          el.currentTime = Math.min(el.duration, el.currentTime + 10); // forward
        }
      }
    }
    setLastTap(now);
  };

  if (!video)
    return <Typography align="center">Select a video to play</Typography>;

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Now Playing: {video.name}
        </Typography>
        <Box
          sx={{
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
            background: "black",
          }}
          onClick={handleTap}
        >
          <video
            ref={videoRef}
            controls
            playsInline
            onTimeUpdate={handleTimeUpdate}
            style={{ width: "100%", borderRadius: "8px" }}
            src={`https://drive.google.com/uc?id=${video.id}&export=download`}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomVideoPlayer;
