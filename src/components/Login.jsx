// src/Login.jsx
import { useState } from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Email/password login
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("✅ Logged in successfully!");
    } catch (error) {
      setMessage("❌ " + error.message);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setMessage("✅ Logged in with Google!");
    } catch (error) {
      setMessage("❌ " + error.message);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      {/* Email input */}
      <input
        type="email"
        placeholder="Email"
        className="border p-2 mb-2 w-full rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password input */}
      <input
        type="password"
        placeholder="Password"
        className="border p-2 mb-4 w-full rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Login button */}
      <button
        onClick={handleLogin}
        className="w-full bg-blue-500 text-white py-2 rounded mb-3"
      >
        Login
      </button>

      {/* Google login button */}
      <button
        onClick={handleGoogleLogin}
        className="w-full bg-red-500 text-white py-2 rounded"
      >
        Login with Google
      </button>

      {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
    </div>
  );
}

export default Login;
