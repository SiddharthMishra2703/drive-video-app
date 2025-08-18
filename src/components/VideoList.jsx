// src/components/VideoList.jsx
import React from 'react';
import { List, ListItem, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';

const VideoList = ({ videos, onSelect }) => {
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Your Drive Videos
      </Typography>
      {videos.length === 0 ? (
        <Typography color="text.secondary">No videos found.</Typography>
      ) : (
        <List dense>
          {videos.map((video) => (
            <ListItem key={video.id} disablePadding>
              <ListItemButton onClick={() => onSelect(video)}>
                <ListItemText
                  primary={video.name}
                  primaryTypographyProps={{ noWrap: true }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default VideoList;
