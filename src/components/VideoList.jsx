// src/components/VideoList.jsx
import React from "react";
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

const VideoList = ({ videos, onSelect }) => {
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
      {/* Bold & Centered Heading */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 3 }}
      >
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
              0: 2,    // 📱 phones → 2 per row
              600: 2,  // tablets
              900: 3,  // medium
              1200: 4, // laptops
              1600: 5, // desktops
            }}
          >
            <Masonry gutter="16px">
              {videos.map((video) => (
                <Card
                  key={video.id}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    "@media (hover: hover) and (pointer: fine)": {
                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: 6,
                      },
                    },
                  }}
                >
                  {/* Poster (click to play) */}
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
                        "@media (hover: hover) and (pointer: fine)": {
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Title + Download Button */}
                  <CardContent
                    sx={{
                      p: 1.5,
                      flexGrow: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ textAlign: "left", overflow: "hidden" }}>
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
                        noWrap
                      >
                        {video.year}
                      </Typography>
                    </Box>

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
                  </CardContent>
                  <Divider />
                </Card>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </Box>
      )}
    </Card>
  );
};

export default VideoList;
