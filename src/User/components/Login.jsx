import React from "react";
import '../components/css/Login.css';
import bgImage from "../assets/building.jpg";
import "react-router-dom";

const Login = () => {
  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="login-card">
        <h1 className="welcome">Welcome !</h1>

        <h2 className="login-title">Login in</h2>

        <div className="input-group">
          <label>Username</label>
          <input type="text" placeholder="Enter username" />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input type="password" placeholder="Enter password" />
        </div>

        <button className="login-btn">Login</button>
      </div>
    </div>
  );
};

export default Login;
