// src/components/VideoList.jsx
import React, { useState, useEffect } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Divider,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  increment,
} from "firebase/firestore";
import ReportDialog from "./ReportDialog";

const LS_KEY = "wrongThumbnails";

const VideoList = ({ videos, onSelect, user }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [wrongThumbnails, setWrongThumbnails] = useState(new Map());
  const [localWrongs, setLocalWrongs] = useState(new Set());

  // 🔥 Load wrong thumbnails from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    setLocalWrongs(new Set(stored));
  }, []);

  // 🔥 Listen to user's favorites
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(
      collection(db, "favorites", user.uid, "movies"),
      (snapshot) => {
        const favs = {};
        snapshot.forEach((doc) => (favs[doc.id] = true));
        setFavorites(favs);
      }
    );
    return () => unsub();
  }, [user]);

  // 🔥 Listen to wrong thumbnails globally
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "wrongThumbnails"), (snapshot) => {
      const map = new Map();
      snapshot.forEach((doc) => {
        const data = doc.data();
        map.set(doc.id, data.count || 1);
      });
      setWrongThumbnails(map);
    });
    return () => unsub();
  }, []);

  // Toggle favorite
  const toggleFavorite = async (video) => {
    if (!user) return alert("Please login to add favorites.");
    const ref = doc(db, "favorites", user.uid, "movies", video.id);
    if (favorites[video.id]) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, video);
    }
  };

  // Report wrong thumbnail
  const reportWrongThumbnail = async (video) => {
    const id = video.id;

    if (localWrongs.has(id)) {
    setOpenDialog(false);
    return;
  }

    // Update localStorage immediately
    const updatedLocal = new Set(localWrongs);
    updatedLocal.add(id);
    setLocalWrongs(updatedLocal);
    localStorage.setItem(LS_KEY, JSON.stringify([...updatedLocal]));

    // Update Firestore count
    const ref = doc(db, "wrongThumbnails", id);
    await setDoc(
      ref,
      { id, title: video.title, count: increment(1) },
      { merge: true }
    );

    setOpenDialog(false);
  };

  // Check if video thumbnail should blur
  const shouldBlur = (id) => {
    return localWrongs.has(id) || (wrongThumbnails.get(id) || 0) >= 3;
  };

  // Menu handlers
  const handleMenuClick = (video) => {
    setSelectedVideo(video);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedVideo(null);
  };

  return (
    <Card
      elevation={3}
      sx={{
        mt: 3,
        p: 3,
        borderRadius: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Your Movies
      </Typography>

      {videos.length === 0 ? (
        <Typography color="text.secondary" align="center">
          No movies found.
        </Typography>
      ) : (
        <Box>
          <ResponsiveMasonry
            columnsCountBreakPoints={{
              0: 2,
              600: 2,
              900: 3,
              1200: 4,
              1600: 5,
            }}
          >
            <Masonry gutter="16px">
              {videos.map((video) => {
                const isFavorite = favorites[video.id] || false;

                return (
                  <Card
                    key={video.id}
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      position: "relative",
                      transition:
                        "transform 0.25s ease, box-shadow 0.25s ease",
                      "@media (hover: hover) and (pointer: fine)": {
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: 6,
                        },
                      },
                    }}
                  >
                    {/* 3-dot menu */}
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        bgcolor: "rgba(0,0,0,0.4)",
                        color: "white",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
                        zIndex: 2,
                      }}
                      onClick={() => handleMenuClick(video)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>

                    {/* Poster */}
                    <Box
                      onClick={() => onSelect(video)}
                      sx={{ cursor: "pointer", overflow: "hidden" }}
                    >
                      <CardMedia
                        component="img"
                        image={video.poster}
                        alt={video.title}
                        sx={{
                          width: "100%",
                          aspectRatio: "16/9",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                          filter: shouldBlur(video.id) ? "blur(8px)" : "none",
                          "@media (hover: hover) and (pointer: fine)": {
                            "&:hover": { transform: "scale(1.05)" },
                          },
                        }}
                      />
                    </Box>

                    {/* Title + Year + Buttons */}
                    <CardContent
                      sx={{
                        p: 1.5,
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      {/* Title & Year */}
                      <Box sx={{ textAlign: "left", overflow: "hidden", flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          noWrap
                          sx={{ fontWeight: "bold" }}
                        >
                          {video.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {video.year}
                        </Typography>
                      </Box>

                      {/* Buttons */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        {/* Favorite */}
                        <IconButton
                          size="small"
                          color={isFavorite ? "error" : "default"}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(video);
                          }}
                        >
                          {isFavorite ? (
                            <FavoriteIcon />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>

                        {/* Download */}
                        <IconButton
                          component="a"
                          href={`https://drive.google.com/uc?export=download&id=${video.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          color="primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                    <Divider />
                  </Card>
                );
              })}
            </Masonry>
          </ResponsiveMasonry>
        </Box>
      )}

      {/* Dynamic Dialog */}
      <ReportDialog
        open={openDialog}
        onClose={handleClose}
        video={selectedVideo}
        onReportWrongThumbnail={reportWrongThumbnail}
      />
    </Card>
  );
};

export default VideoList;
