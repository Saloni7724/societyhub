import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiCalendar,
  FiBell,
  FiTool,
  FiAlertCircle,
  FiUserCheck,
  FiDollarSign,
  FiCreditCard,
  FiChevronDown,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

import adminProfile from "../photos/admin_profile.png";
import "./AdminLayout.css";

const AdminLayout = ({ children, active }) => {
  const navigate = useNavigate();
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const adminMenuRef = useRef(null); // 🔹 ADDED

  // 🔹 CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(e.target)
      ) {
        setShowAdminMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="avatar">
          <img src={adminProfile} alt="Admin" />
        </div>

        <nav>
          <button
            className={`menu-item ${active === "members" ? "active" : ""}`}
            onClick={() => navigate("/")}
          >
            <FiUsers /> Manage Members
          </button>

          <button
            className={`menu-item ${active === "events" ? "active" : ""}`}
            onClick={() => navigate("/add-events")}
          >
            <FiCalendar /> Add Events
          </button>

          <button
            className={`menu-item ${active === "notice" ? "active" : ""}`}
            onClick={() => navigate("/add-notice")}
          >
            <FiBell /> Add Notice
          </button>

          <button
            className={`menu-item ${active === "maintenance" ? "active" : ""}`}
            onClick={() => navigate("/maintenance")}
          >
            <FiTool /> Maintenance
          </button>

          <button
            className={`menu-item ${active === "complaints" ? "active" : ""}`}
            onClick={() => navigate("/complaints")}
          >
            <FiAlertCircle /> Complaints
          </button>

          <button
            className={`menu-item ${active === "visitors" ? "active" : ""}`}
            onClick={() => navigate("/visitors")}
          >
            <FiUserCheck /> Visitors
          </button>

          <button
            className={`menu-item ${active === "expenses" ? "active" : ""}`}
            onClick={() => navigate("/expenses")}
          >
            <FiDollarSign /> Expenses
          </button>

          <button
            className={`menu-item ${active === "transactions" ? "active" : ""}`}
            onClick={() => navigate("/transactions")}
          >
            <FiCreditCard /> Transactions
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        <header className="admin-header">
          <h2>Hello Saloni 👋</h2>

          <div className="admin-profile" ref={adminMenuRef}>
            <div
              className="admin-trigger"
              onClick={() => setShowAdminMenu(!showAdminMenu)}
            >
              <img src={adminProfile} alt="Admin" />
              <FiChevronDown />
            </div>

            {showAdminMenu && (
              <div className="admin-dropdown">
                <button>
                  <FiUser /> Profile
                </button>
                <button
                  className="logout"
                  onClick={() => {
                    localStorage.removeItem("isAdminLoggedIn");
                    navigate("/");
                  }}
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
