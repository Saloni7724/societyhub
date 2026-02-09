import React from "react";
import "./css/Notification.css";
import {
  FaUser,
  FaClock,
  FaTools,
  FaPhone,
  FaCalendarAlt,
  FaUsers,
  FaBell,
  FaExclamationCircle,
  FaBuilding
} from "react-icons/fa";

const Notification = () => {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">
          <FaBuilding /> Society Name
        </h2>

        <ul className="menu">
          <li><FaUser /> My Profile</li>
          <li><FaClock /> Pending Amount</li>
          <li><FaTools /> Payment Maintenance</li>
          <li><FaPhone /> Emergency Contact</li>
          <li><FaCalendarAlt /> Events</li>
          <li><FaUsers /> Resident List</li>
          <li className="active"><FaBell /> Notification</li>
          <li><FaExclamationCircle /> Add Complain</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h3><FaBell /> Notification</h3>

        <div className="notification-box">
          <div className="notification-item">
            <span className="tag blue">Maintenance reminder</span>
            <p className="date">22 jan 2026</p>
            <p>
              Reminder to monthly maintenance fees by the end of this Month.
            </p>
          </div>

          <div className="notification-item">
            <span className="tag green">Republic day celebration</span>
            <p className="date">26 jan 2026</p>
            <p>
              Join us for republic day at the society garden area on 26th January
              at 9:00 Am
            </p>
          </div>

          <div className="notification-item">
            <span className="tag red">Water supply disruption</span>
            <p className="date">29 jan 2026</p>
            <p>
              Due to maintenance work, water supply will be disrupted on 29th
              January from 10:00 Am to 5:00 pm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
