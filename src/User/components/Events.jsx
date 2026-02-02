import React from "react";
import "./css/Events.css";
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

const Events = () => {
  return (

    
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2><FaBuilding /> Society Name</h2>

        <ul>
          <li><FaUser /> My Profile</li>
          <li><FaClock /> Pending Amount</li>
          <li><FaTools /> Payment Maintenance</li>
          <li><FaPhone /> Emergency Contact</li>
          <li className="active"><FaCalendarAlt /> Events</li>
          <li><FaUsers /> Resident List</li>
          <li><FaBell /> Notification</li>
          <li><FaExclamationCircle /> Add Complain</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main">
        

        {/* Header */}
        <div className="page-header">
          <h2><FaCalendarAlt /> Events</h2>
        </div>
        

        <h3 className="title">Society Events</h3>
        <hr />

        {/* Event Cards */}
        <div className="events-grid">

          {/* Card 1 */}
          <div className="event-card">
            <h4>Republic day celebration</h4>

            <p><FaCalendarAlt /> <strong>Date :</strong> 26 jan 2026</p>

            <p>
              <strong>Title :</strong><br />
              Republic day celebration
            </p>

            <button>view</button>
          </div>

          {/* Card 2 */}
          <div className="event-card">
            <h4>Holi Celebration</h4>

            <p><FaCalendarAlt /> <strong>Date :</strong> 04 mar 2026</p>

            <p>
              <strong>Title :</strong><br />
              Holi Celebration
            </p>

            <button>view</button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Events;
