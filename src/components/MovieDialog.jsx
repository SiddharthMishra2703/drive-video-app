import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
} from "@mui/material";

export default function MovieDialog({ open, onClose, onConfirm, movie, fileDetails }) {
    if (!movie) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Confirm Movie</DialogTitle>
            <DialogContent sx={{ textAlign: "center" }}>
                <img
                    src={
                        movie.poster && movie.poster !== "N/A"
                            ? movie.poster
                            : "/no-image.png"
                    }
                    alt={movie.title}
                    style={{ width: "200px", borderRadius: "8px", marginBottom: "16px" }}
                    onError={(e) => {
                        e.target.src = "/no-thumbnail.jpg"; // fallback image from public
                    }}
                />
                <Typography variant="h6">{movie.title}</Typography>
                <Typography variant="body1">Year: {movie.year}</Typography>
                <Typography variant="body2" color="text.secondary">
                    File: {fileDetails?.name}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onConfirm} variant="contained" color="primary">
                    Add
                </Button>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={() => onClose("searchAgain")}>Search Again</Button>
            </DialogActions>
        </Dialog>
    );
}
