import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import DriveVideos from "./components/DriveVideos";
import Login from "./components/Login";
import MoviePosterFetcher from "./components/MoviePosterFetcher";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  
  return (
    <>
      {user ? <DriveVideos /> : <Login />}
      {/* <MoviePosterFetcher /> */}
    </>
  );
};

export default App;
