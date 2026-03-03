import React, { useState } from "react";
import "../css/Login.css";
import manImage from "../photos/admin_login.png";
import { FaUserShield, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../Backend/firebase-init";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Backend/firebase-init";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
  if (!email || !password) {
    setError("Please enter email and password");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = userCredential.user.uid;

    // 🔍 Find society linked to this admin
    const q = query(
      collection(db, "societies"),
      where("adminUid", "==", uid)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const societyDoc = snapshot.docs[0];

      // ✅ CLEAR OLD DATA FIRST
     
      // ✅ Save new society context
      localStorage.setItem("societyId", societyDoc.id);
      localStorage.setItem("societyCode", societyDoc.data().code);
      localStorage.setItem("societyName", societyDoc.data().name);

      setError("");
      navigate("/manage-members");
    } else {
      setError("Society not found");
    }

  } catch (error) {
    setError("Invalid Email or Password");
  }
};

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Enter your email first");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent to your email ✅");
      setError("");
    } catch (error) {
      setError("Error sending reset email");
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

        {/* Email */}
        <div className="input-box">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <p
          style={{ marginTop: "15px", cursor: "pointer", color: "#4a90e2" }}
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </p>
      </div>
    </div>
  );
}

export default Login;