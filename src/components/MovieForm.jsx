import React, { useState } from "react";
import { TextField, Button, Card, Typography, Box } from "@mui/material";
import { db } from "../firebase"; // your firebase.js config
import { doc, setDoc } from "firebase/firestore";
import { AllMovies } from "./AllMovies";
import MovieDialog from "./MovieDialog";

export default function MovieForm() {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [results, setResults] = useState([]);
  const [fileDetails, setFileDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleSearch = async () => {
    if (!name || !link) {
      alert("Please enter both movie name and drive link");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `/api/searchMovie?name=${encodeURIComponent(name)}&link=${encodeURIComponent(link)}`
      );
      const data = await res.json();

      if (data.error) {
        alert(data.error);
        setResults([]);
      } else {
        // Store both fileDetails and movies
        setResults(data.movies || []);
        setFileDetails(data.fileDetails || {});
        // You can also keep fileDetails in state if you need it later
        console.log("Drive File Details:", data.fileDetails);
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
      alert("Something went wrong while searching for movies.");
    }

    setLoading(false);
  };

  const handleSelect = (movie) => {
    if (movie) {
      setSelectedMovie({
        id: fileDetails?.id,
        link,
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster,
      });
    } else {
      setSelectedMovie({
        id: fileDetails?.id,
        link,
        title: name,
        year: new Date().getFullYear(),
        poster: "/no-image.png",
      });
    }
    setOpenDialog(true);
  };

  const handleDialogClose = (action) => {
    if (action === "searchAgain") {
      setResults([]);
      setFileDetails({});
    }
    setOpenDialog(false);
  };

  const handleDialogConfirm = async () => {
    try {
      await setDoc(doc(db, "linkMovies", selectedMovie.id), selectedMovie);
      alert("Movie added successfully!");
      setName("");
      setLink("");
      setResults([]);
      setFileDetails({});
      setSelectedMovie(null);
      setOpenDialog(false);
    } catch (err) {
      console.error("Error saving movie:", err);
    }
  };

  return (
    <>

      <Card
        elevation={3}
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
        >
          Add Movies
        </Typography>
        {results.length === 0 && <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            label="Movie Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Drive Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={loading}
            sx={{
              width: { xs: "100%", sm: "auto" },
              minWidth: "150px",
            }}
          >
            {loading ? "Searching..." : "Add Movie"}
          </Button>
        </Box>}
        {fileDetails.name && <>
          <Typography align="center" sx={{ fontWeight: "bold" }}>
            Movie Name : {name}
            <br />
            File Name : {fileDetails.name}
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", m: 2 }}>
            Select movie which you are uploading.
          </Typography>
          <AllMovies movies={results} onSelect={handleSelect} />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSelect(null)}
            // disabled={loading}
            sx={{
              width: { xs: "100%", sm: "auto" },
              minWidth: "150px",
              m: 3
            }}
          >
            Not Found
          </Button>
        </>}
      </Card>
      <MovieDialog
        open={openDialog}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
        movie={selectedMovie}
        fileDetails={fileDetails}
      />
    </>
  );
}
