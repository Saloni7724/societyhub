import React, { useState, useEffect } from "react";
import "./css/Notification.css";

/* ✅ Popup Component */
import NotificationPopup from "./NotificationPopup";

import { FaBell, FaWater, FaFlag } from "react-icons/fa";

const Notifications = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setShowPopup(true);
  }, []);

  const notificationData = [
    {
      title: "Maintenance Reminder",
      date: "22 Jan 2026",
      message:
        "Please pay monthly maintenance fees before the end of this month.",
      icon: <FaBell />,
      type: "blue",
    },
    {
      title: "Republic Day Celebration",
      date: "26 Jan 2026",
      message:
        "Join us in the society garden on 26th January at 9:00 AM.",
      icon: <FaFlag />,
      type: "green",
    },
    {
      title: "Water Supply Disruption",
      date: "29 Jan 2026",
      message:
        "Water supply will be disrupted from 10:00 AM to 5:00 PM due to maintenance work.",
      icon: <FaWater />,
      type: "red",
    },
  ];

  return (
    <div className="notification-page">
      {/* ✅ Popup */}
      {showPopup && (
        <NotificationPopup
          message="New Notification Received!"
          onClose={() => setShowPopup(false)}
        />
      )}

      {/* Title */}
      <h2 className="notification-title">
        🔔 Society Notifications
      </h2>

      {/* Notification List */}
      <div className="notification-wrapper">
        {notificationData.map((item, index) => (
          <div key={index} className={`notify-card ${item.type}`}>
            
            {/* Icon Box */}
            <div className="notify-icon">
              {item.icon}
            </div>

            {/* Content */}
            <div className="notify-info">
              <h3>{item.title}</h3>
              <span>{item.date}</span>
              <p>{item.message}</p>
            </div>

            {/* Badge */}
            <div className="notify-badge">NEW</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
