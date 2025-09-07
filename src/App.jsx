import { useEffect, useState, useMemo } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import DriveVideos from "./components/DriveVideos";
import Login from "./components/Login";
import Offline from "./components/Offline";

import {
  ThemeProvider,
  CssBaseline,
  createTheme,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const App = () => {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("dark"); // default theme
  const [online, setOnline] = useState(navigator.onLine);

  // Theme setup
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#1976d2" },
        },
      }),
    [mode]
  );

  // Track online/offline
  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Toggle Theme
  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  // ✅ Show Offline screen if no internet
  if (!online) return <Offline />;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Top AppBar with theme toggle */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            GDrive Video Player
          </Typography>
          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Authenticated content */}
      {user ? <DriveVideos user={user} /> : <Login />}
    </ThemeProvider>
  );
};

export default App;
