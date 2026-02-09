import React, { useState } from "react";
import "../css/Login.css";
import manImage from "../photos/admin_login.png";
import { FaUserShield, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  // username & password state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    // 🔑 hardcoded admin credentials
    if (username === "admin" && password === "admin123") {
      setError("");

      // save login state
      localStorage.setItem("isAdminLoggedIn", "true");


      // redirect to manage members page
      navigate("/ManageMembers");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      {/* Left Image */}
      <div className="login-left">
        <img src={manImage} alt="Admin Illustration" />
      </div>

      {/* Right Form */}
      <div className="login-right">
        <h2>Admin Login</h2>

        {/* Username */}
        <div className="input-box">
          <input
            type="text"
            placeholder="Admin Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FaUserShield className="input-icon" />
        </div>

        {/* Password */}
        <div className="input-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Error */}
        {error && <p className="error-text">{error}</p>}

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
