// src/components/Offline.jsx
import { Button, Typography, Container, Box } from "@mui/material";
import WifiOffIcon from "@mui/icons-material/WifiOff";

export default function Offline() {
  return (
    <Container
      maxWidth="sm"
      sx={{ textAlign: "center", mt: 10, display: "flex", flexDirection: "column", gap: 3 }}
    >
      <WifiOffIcon sx={{ fontSize: 80, color: "text.secondary" }} />
      <Typography variant="h4" gutterBottom>
        You are Offline
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Please check your internet connection. This page will refresh once you’re back online.
      </Typography>
      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Retry Now
        </Button>
      </Box>
    </Container>
  );
}
