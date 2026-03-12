import React, { useState, useEffect } from "react";
import "./css/Dashboard.css";

/* Icons */
import {
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

/* Firebase */
import { db, auth } from "../Backend/firebase-init";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

/* Pages */
import Profile from "./Profile";
import PendingAmount from "./PendingAmount";
import EmergencyContact from "./EmergencyContact";
import Events from "./Events";
import PaymentMaintenance from "./PaymentMaintenance";
import ResidentList from "./ResidentList";
import Notice from "./Notice";
import Complaint from "./Complaint";

const Dashboard = () => {

  const [activePage, setActivePage] = useState("profile");
  const [societyName, setSocietyName] = useState("");

  

  /* ⭐ Fetch Society Name From Firebase */
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (user) {

        const userDoc = await getDoc(doc(db, "Users", user.uid));

        if (userDoc.exists()) {

          const societyId = userDoc.data().societyId;

          const societyDoc = await getDoc(doc(db, "Societies", societyId));

          if (societyDoc.exists()) {
            setSocietyName(societyDoc.data().societyName);
          }

        }

      }

    });

    return () => unsubscribe();

  }, []);

  /* Logout */
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          <FaBuilding className="logo-icon" />
          <h2>{societyName || "Society Name"}</h2>
        </div>

        <ul className="menu">

          <li className={activePage === "profile" ? "active" : ""}
              onClick={() => setActivePage("profile")}>
            <FaUser />
            <span>My Profile</span>
          </li>

          <li className={activePage === "pending" ? "active" : ""}
              onClick={() => setActivePage("pending")}>
            <FaMoneyBillWave />
            <span>Pending Amount</span>
          </li>

          <li className={activePage === "payment" ? "active" : ""}
              onClick={() => setActivePage("payment")}>
            <FaTools />
            <span>Payment Maintenance</span>
          </li>

          <li className={activePage === "contact" ? "active" : ""}
              onClick={() => setActivePage("contact")}>
            <FaPhoneAlt />
            <span>Emergency Contact</span>
          </li>

          <li className={activePage === "events" ? "active" : ""}
              onClick={() => setActivePage("events")}>
            <FaCalendarAlt />
            <span>Events</span>
          </li>

          <li className={activePage === "residents" ? "active" : ""}
              onClick={() => setActivePage("residents")}>
            <FaUsers />
            <span>Resident List</span>
          </li>

          <li className={activePage === "notice" ? "active" : ""}
              onClick={() => setActivePage("notice")}>
            <FaBell />
            <span>Notice</span>
          </li>

          <li className={activePage === "complain" ? "active" : ""}
              onClick={() => setActivePage("complain")}>
            <FaCommentDots />
            <span>Add Complaint</span>
          </li>

        </ul>

        <div className="logout" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </div>

      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="page-body">

          {activePage === "profile" && <Profile />}
          {activePage === "pending" && <PendingAmount />}
          {activePage === "payment" && <PaymentMaintenance />}
          {activePage === "contact" && <EmergencyContact />}
          {activePage === "events" && <Events />}
          {activePage === "residents" && <ResidentList />}
          {activePage === "notice" && <Notice />}
          {activePage === "complain" && <Complaint />}

        </div>
      </main>

    </div>
  );
};

export default Dashboard;