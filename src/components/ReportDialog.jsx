// src/components/ReportDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

const ReportDialog = ({ open, onClose, video, onReportWrongThumbnail }) => {
  if (!video) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Report Options</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          Selected movie: <b>{video.title}</b>
        </Typography>
        <List>
          <ListItemButton onClick={() => onReportWrongThumbnail(video)}>
            <ListItemText primary="Wrong Thumbnail" />
          </ListItemButton>
          <ListItemButton onClick={() => alert(`Reported ${video.title} to admin`)}>
            <ListItemText primary="Report" />
          </ListItemButton>
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
