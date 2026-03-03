import React, { useState } from "react";
import "./css/Dashboard.css";

import {
  FaUserCircle,
  FaUser,
  FaMoneyBillWave,
  FaTools,
  FaPhoneAlt,
  FaCalendarAlt,
  FaUsers,
  FaBell,
  FaCommentDots,
  FaSignOutAlt,
  FaBuilding,
} from "react-icons/fa";

/* ✅ Import Pages */
import Profile from "./Profile";
import PendingAmount from "./PendingAmount";
import EmergencyContact from "./EmergencyContact";
import Events from "./Events";
import PaymentMaintenance from "./PaymentMaintenance";
import ResidentList from "./ResidentList";

/* ✅ Import Notification Page */
import Notifications from "./Notification";

/* ✅ Import Complaint Page */
import Complaint from "./Complaint";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");

  /* ✅ Logout Function */
  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">
      {/* ================= Sidebar ================= */}
      <aside className="sidebar">
        
        {/* Logo */}
        <div className="sidebar-logo">
          <FaBuilding className="logo-icon" />
          <h2>Society Name</h2>
        </div>

        {/* Menu */}
        <ul className="menu">
          
          {/* Dashboard */}
          <li
            className={activePage === "dashboard" ? "active" : ""}
            onClick={() => setActivePage("dashboard")}
          >
            <FaUserCircle />
            <span>Dashboard</span>
          </li>

          {/* My Profile */}
          <li
            className={activePage === "profile" ? "active" : ""}
            onClick={() => setActivePage("profile")}
          >
            <FaUser />
            <span>My Profile</span>
          </li>

          {/* Pending Amount */}
          <li
            className={activePage === "pending" ? "active" : ""}
            onClick={() => setActivePage("pending")}
          >
            <FaMoneyBillWave />
            <span>Pending Amount</span>
          </li>

          {/* Payment Maintenance */}
          <li
            className={activePage === "payment" ? "active" : ""}
            onClick={() => setActivePage("payment")}
          >
            <FaTools />
            <span>Payment Maintenance</span>
          </li>

          {/* Emergency Contact */}
          <li
            className={activePage === "contact" ? "active" : ""}
            onClick={() => setActivePage("contact")}
          >
            <FaPhoneAlt />
            <span>Emergency Contact</span>
          </li>

          {/* Events */}
          <li
            className={activePage === "events" ? "active" : ""}
            onClick={() => setActivePage("events")}
          >
            <FaCalendarAlt />
            <span>Events</span>
          </li>

          {/* Resident List */}
          <li
            className={activePage === "residents" ? "active" : ""}
            onClick={() => setActivePage("residents")}
          >
            <FaUsers />
            <span>Resident List</span>
          </li>

          {/* Notification */}
          <li
            className={activePage === "notification" ? "active" : ""}
            onClick={() => setActivePage("notification")}
          >
            <FaBell />
            <span>Notification</span>
          </li>

          {/* ✅ Complaint */}
          <li
            className={activePage === "complain" ? "active" : ""}
            onClick={() => setActivePage("complain")}
          >
            <FaCommentDots />
            <span>Add Complaint</span>
          </li>
        </ul>

        {/* Logout */}
        <div className="logout" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </div>
      </aside>

      {/* ================= Main Content ================= */}
      <main className="main-content">

        {/* Right Side Page Body */}
        <div className="page-body">
          
          {/* Dashboard Welcome */}
          {activePage === "dashboard" && (
            <h2>Welcome to Dashboard 🎉</h2>
          )}

          {/* Profile Page */}
          {activePage === "profile" && <Profile />}

          {/* Pending Amount Page */}
          {activePage === "pending" && <PendingAmount />}

          {/* Payment Maintenance Page */}
          {activePage === "payment" && <PaymentMaintenance />}

          {/* Emergency Contact Page */}
          {activePage === "contact" && <EmergencyContact />}

          {/* Events Page */}
          {activePage === "events" && <Events />}

          {/* Resident List Page */}
          {activePage === "residents" && <ResidentList />}

          {/* Notification Page */}
          {activePage === "notification" && <Notifications />}

          {/* ✅ Complaint Page Opens Here */}
          {activePage === "complain" && <Complaint />}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
