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

import { FiMenu } from "react-icons/fi";
import { auth, db } from "../Backend/firebase-init";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

import adminProfile from "../photos/admin_profile.png";
import "./AdminLayout.css";

const AdminLayout = ({ children, active }) => {
  const navigate = useNavigate();
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const [adminName, setAdminName] = useState("");
  
  const [societyName, setSocietyName] = useState(
  localStorage.getItem("societyName") || ""
);
const [loadingSociety, setLoadingSociety] = useState(
  !localStorage.getItem("societyName")
);

  //const [societyName, setSocietyName] = useState("Society Dashboard"); // ✅ MOVED HERE

  const adminMenuRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 🔹 GET ADMIN NAME FROM LOCALSTORAGE
  useEffect(() => {
    const name = localStorage.getItem("adminName");
    if (name) {
      setAdminName(name);
    }
  }, []);

  // 🔹 FETCH SOCIETY NAME FROM FIRESTORE
 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // Query societies collection where adminUid == logged in user uid
        const q = query(
          collection(db, "societies"),
          where("adminUid", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const societyDoc = querySnapshot.docs[0];
          setSocietyName(societyDoc.data().name); // your field is "name"
          localStorage.setItem("societyName", societyDoc.data().name);
setLoadingSociety(false);
         
        }
      } catch (error) {
        console.log("Error fetching society name:", error);
      }
    }
  });

  return () => unsubscribe();
}, []);
  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        
        <div className="avatar">
         <span><img src={adminProfile} alt="Admin" /></span> 
        </div>

        <nav>
          <button
            className={`menu-item ${active === "members" ? "active" : ""}`}
            onClick={() => navigate("/manage-members")}
          >
            <FiUsers /><span>Manage Members</span>
          </button>

          <button
            className={`menu-item ${active === "events" ? "active" : ""}`}
            onClick={() => navigate("/add-events")}
          >
            <FiCalendar /><span>Add Events</span>
          </button>

          <button
            className={`menu-item ${active === "notice" ? "active" : ""}`}
            onClick={() => navigate("/add-notice")}
          >
            <FiBell /> <span>Add Notice</span>
          </button>

          <button
            className={`menu-item ${active === "maintenance" ? "active" : ""}`}
            onClick={() => navigate("/maintenance")}
          >
            <FiTool /> <span> Maintenance</span>
          </button>

          <button
            className={`menu-item ${active === "complaints" ? "active" : ""}`}
            onClick={() => navigate("/complaints")}
          >
            <FiAlertCircle /> <span>Complaints</span>
          </button>

          <button
            className={`menu-item ${active === "visitors" ? "active" : ""}`}
            onClick={() => navigate("/visitors")}
          >
            <FiUserCheck /> <span>Visitors</span>
          </button>

          <button
            className={`menu-item ${active === "expenses" ? "active" : ""}`}
            onClick={() => navigate("/expenses")}
          >
            <FiDollarSign /> <span>Expenses</span>
          </button>

          <button
            className={`menu-item ${active === "transactions" ? "active" : ""}`}
            onClick={() => navigate("/transactions")}
          >
            <FiCreditCard /> <span>Transactions</span>
          </button>
        </nav>

        <button
          className="menu-item logout-btn"
          onClick={() => {
            localStorage.removeItem("isAdminLoggedIn");
            localStorage.removeItem("adminName");
            navigate("/");
          }}
        >
          <FiLogOut /> <span>Logout</span>
        </button>
      </aside>

      {/* MAIN */}
      <main className="admin-main">
       <header className="admin-header">
  <div className="header-left">
    <FiMenu
      className="hamburger"
      onClick={() => setSidebarOpen(!sidebarOpen)}
    />
    <h2>{societyName}</h2>
  </div>
</header>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;