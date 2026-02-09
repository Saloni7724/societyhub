import React, { useState, useEffect } from "react";
import "../components/css/Login.css";
import bgImage from "../assets/building.jpg";
import { useNavigate } from "react-router-dom";

const LoginUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ Clear inputs on page load
  useEffect(() => {
    setUsername("");
    setPassword("");
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const correctUsername = "admin";
    const correctPassword = "admin123";

    if (username === correctUsername && password === correctPassword) {
      setError("");

      // ✅ Store login status
      localStorage.setItem("isAdminLoggedIn", "true");

      // ✅ Redirect to Dashboard Page
      navigate("/dashboard");
    } else {
      setError("Invalid username or password ❌");
    }
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="login-card">
        <h1 className="welcome">Welcome!</h1>
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleLogin} autoComplete="off">
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              autoComplete="off"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>

          {error && <p className="error-text">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginUser;
