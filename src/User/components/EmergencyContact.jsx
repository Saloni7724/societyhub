import React from "react";
import "./css/EmergencyContact.css";

import {
  FaUserMd,
  FaFireExtinguisher,
  FaGavel,
  FaShieldAlt,
  FaUserTie,
  FaPhoneAlt,
} from "react-icons/fa";

const EmergencyContact = () => {
  const contacts = [
    {
      title: "Doctor",
      icon: <FaUserMd />,
      name: "Dr. Hannan Yunusbhai",
      flat: "A-201",
      phone: "9845674321",
      color: "card-doctor",
    },
    {
      title: "Fire Brigade",
      icon: <FaFireExtinguisher />,
      phone: "112",
      color: "card-fire",
    },
    {
      title: "Police",
      icon: <FaGavel />,
      phone: "100",
      color: "card-police",
    },
    {
      title: "Security",
      icon: <FaShieldAlt />,
      name: "Ramukaka",
      phone: "9754092345",
      color: "card-security",
    },
    {
      title: "Secretary",
      icon: <FaUserTie />,
      name: "Rameshbhai",
      flat: "B-104",
      phone: "9745761209",
      color: "card-secretary",
    },
    {
      title: "Custom Number",
      icon: <FaPhoneAlt />,
      name: "Sureshbhai",
      flat: "A-302",
      phone: "9809985676",
      color: "card-custom",
    },
  ];

  return (
    <div className="emergency-container">
      <h2 className="emergency-title">Emergency Contacts</h2>

      <div className="emergency-grid">
        {contacts.map((item, index) => (
          <div className={`emergency-card ${item.color}`} key={index}>
            
            <div className="card-icon">{item.icon}</div>

            <h3>{item.title}</h3>

            {item.name && (
              <p>
                <span>Name:</span> {item.name}
              </p>
            )}

            {item.flat && (
              <p>
                <span>Flat:</span> {item.flat}
              </p>
            )}

            <p className="phone">
              <span>Contact:</span> {item.phone}
            </p>

            {/* ✅ Buttons */}
            <div className="btn-row">
              <a href={`tel:${item.phone}`} className="call-btn">
                📞 Call
              </a>

              <a
                href={`https://wa.me/91${item.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyContact;
