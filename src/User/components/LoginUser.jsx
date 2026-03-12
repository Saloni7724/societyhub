import React, { useState, useEffect } from "react";
import "../components/css/Login.css";
import bgImage from "../assets/building.jpg";
import { useNavigate } from "react-router-dom";

/* Firebase */
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Backend/firebase-init";

const LoginUser = () => {

  const [flat, setFlat] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* Prevent autofill */
  useEffect(() => {
    setFlat("");
    setPassword("");
  }, []);

  
  /* ================= LOGIN FUNCTION ================= */

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!flat || !password) {
    setError("Please enter Flat No and Password");
    return;
  }

  try {

    const societyId = localStorage.getItem("societyId"); // already stored from admin side

    if (!societyId) {
      setError("Society not found");
      return;
    }

    const membersQuery = query(
      collection(db, "societies", societyId, "members"),
      where("flat", "==", flat)
    );

    const membersSnapshot = await getDocs(membersQuery);

    if (membersSnapshot.empty) {
      setError("Flat number not found ❌");
      return;
    }

    const userDoc = membersSnapshot.docs[0];
    const userData = userDoc.data();

    if (userData.password !== password) {
      setError("Incorrect password ❌");
      return;
    }

    /* STORE USER DATA */
    localStorage.setItem("userId", userDoc.id);
    localStorage.setItem("isUserLoggedIn", "true");
    localStorage.setItem("memberName", userData.name || "");
    localStorage.setItem("flatNumber", userData.flat || "");

    navigate("/Dashboard");

  } catch (err) {
    console.error("Login Error:", err);
    setError("Login failed. Try again.");
  }
};

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="login-card">
        <h1 className="welcome">Welcome!</h1>
        <h2 className="login-title">User Login</h2>

        <form onSubmit={handleLogin} autoComplete="off">

          <input type="text" style={{ display: "none" }} />
          <input type="password" style={{ display: "none" }} />

          <div className="input-group">
            <label>Flat No</label>
            <input
              type="text"
              placeholder="Enter Flat No"
              value={flat}
              onChange={(e) => setFlat(e.target.value)}
              autoComplete="off"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
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