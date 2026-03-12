import React, { useState } from "react";
import "./css/Dashboard.css";
import { FaPhoneAlt } from "react-icons/fa";
import { useEffect } from "react";
import { db } from "../../Admin/Backend/firebase-init";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaMoneyBillWave,
  FaTools,
  FaCalendarAlt,
  FaUsers,
  FaBell,
  FaCommentDots,
  FaSignOutAlt,
  FaBuilding,
} from "react-icons/fa";


/* :white_check_mark: Import Pages */
import Profile from "./Profile";
import PendingAmount from "./PendingAmount";
import EmergencyContact from "./EmergencyContact";
import Events from "./Events";
import PaymentMaintenance from "./PaymentMaintenance";
import ResidentList from "./ResidentList";

/* :white_check_mark: Import Notification Page */
import Notifications from "./Notice";

/* :white_check_mark: Import Complaint Page */
import Complaint from "./Complaint";

const Dashboard = () => {
   const [activePage, setActivePage] = useState("profile");
 const [user, setUser] = useState(null);
  const [societyName, setSocietyName] = useState("");
   const navigate = useNavigate();
  /* :white_check_mark: Check Login + Fetch User */
 useEffect(() => {
  const isLoggedIn = localStorage.getItem("isUserLoggedIn");

  if (!isLoggedIn) {
    navigate("/login-user");
    return;
  }

  fetchUserData();
}, [navigate]);
  const fetchUserData = async () => {
    const societyId = localStorage.getItem("societyId");
    const userId = localStorage.getItem("userId");


    try {
      // :small_blue_diamond: Fetch Member
      const memberRef = doc(db, "societies", societyId, "members", userId);
      const memberSnap = await getDoc(memberRef);

      if (memberSnap.exists()) {
        setUser(memberSnap.data());
      }

      // :small_blue_diamond: Fetch Society Name
     // :small_blue_diamond: Fetch Society Name
const societyRef = doc(db, "societies", societyId);
const societySnap = await getDoc(societyRef);

if (societySnap.exists()) {
  setSocietyName(societySnap.data().name);   // :white_check_mark: FIXED
}

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  /* :white_check_mark: Logout */
  const handleLogout = () => {
    localStorage.removeItem("isUserLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userFlat");
    navigate("/login-user");
  };

  return (
    <div className="dashboard-container">
      {/* ================= Sidebar ================= */}
      <aside className="sidebar">

        {/* Logo */}
       <div className="sidebar-logo">
  <FaBuilding className="logo-icon" />
  <h2>{societyName || "Loading..."}</h2>
</div>

        {/* Menu */}
        <ul className="menu">



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

          {/* :white_check_mark: Complaint */}
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

          {user && (
  <h3 style={{ marginBottom: "16px" }}>
    Welcome, {user.name} :wave:
  </h3>
)}
          {/* Dashboard Welcome */}
          {activePage === "dashboard" && (
            <h2>Welcome to Dashboard :tada:</h2>
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

          {/* :white_check_mark: Complaint Page Opens Here */}
          {activePage === "complain" && <Complaint />}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;