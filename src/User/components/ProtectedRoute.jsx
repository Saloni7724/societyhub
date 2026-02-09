import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // ✅ Get login status from localStorage
  const isLoggedIn = localStorage.getItem("isAdminLoggedIn");

  // ❌ Not logged in → redirect login page
  if (isLoggedIn !== "true") {
    return <Navigate to="/" replace />;
  }

  // ✅ Logged in → show dashboard
  return children;
};

export default ProtectedRoute;
