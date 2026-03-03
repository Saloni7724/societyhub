import React, { useEffect } from "react";
import "./css/NotificationPopup.css";

const NotificationPopup = ({ message, onClose }) => {

  /* ✅ Auto Close Popup After 3 Seconds */
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="popup-alert">
      🔔 {message}
    </div>
  );
};

export default NotificationPopup;
