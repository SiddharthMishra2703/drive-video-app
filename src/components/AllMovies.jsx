import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Divider,
} from "@mui/material";

export const AllMovies = ({movies, onSelect}) => {
    if(movies.length === 0){
        return (
            <Typography color="text.secondary" align="center">
                No movies found.
            </Typography>
        );
    }
    return (
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
                    {movies.map((video) => {

                        return (
                            <Card
                                //   key={video.id}
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

                                {/* Poster */}
                                <Box
                                    onClick={() => onSelect(video)}
                                    sx={{ cursor: "pointer", overflow: "hidden" }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={
                                            video.Poster && video.Poster !== "N/A"
                                                ? video.Poster
                                                : "/no-image.png"
                                        }
                                        alt={video.Title}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/no-image.png";
                                        }}
                                        sx={{
                                            width: "100%",
                                            aspectRatio: "16/9",
                                            objectFit: "cover",
                                            transition: "transform 0.3s ease",
                                        }}
                                    />
                                </Box>

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
                                            {video.Title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mt: 0.5 }}
                                        >
                                            {video.Year}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <Divider />
                            </Card>
                        );
                    })}
                </Masonry>
            </ResponsiveMasonry>
        </Box>
    );
}