import React from "react";
import "./css/EmergencyContact.css";
import {
  FaUser,
  FaMoneyBill,
  FaTools,
  FaPhoneAlt,
  FaCalendarAlt,
  FaUsers,
  FaBell,
  FaCommentDots,
  FaBuilding,
} from "react-icons/fa";

const EmergencyContact = () => {
  return (
    <div className="page">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">
          <FaBuilding /> Society Name
        </h2>

        <ul>
          <li><FaUser /> My Profile</li>
          <li><FaMoneyBill /> Pending Amount</li>
          <li><FaTools /> Payment Maintenance</li>
          <li className="active"><FaPhoneAlt /> Emergency Contact</li>
          <li><FaCalendarAlt /> Events</li>
          <li><FaUsers /> Resident List</li>
          <li><FaBell /> Notification</li>
          <li><FaCommentDots /> Add Complain</li>
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div className="content">
        <h2 className="page-title">
          <FaPhoneAlt /> Emergency Contact
        </h2>

        <div className="cards">
          <div className="card doctor">
            <h3>Doctor</h3>
            <p>Name : DR. Hannan Yunusbhai</p>
            <p>Flat No : A-201</p>
            <p>Contact : <span>9845674321</span></p>
          </div>

          <div className="card fire">
            <h3>Fire Brigade</h3>
            <p>Contact : <span>112</span></p>
          </div>

          <div className="card police">
            <h3>Police</h3>
            <p>Contact : <span>100</span></p>
          </div>

          <div className="card security">
            <h3>Security</h3>
            <p>Name : Ramukaka</p>
            <p>Contact : <span>9754092345</span></p>
          </div>

          <div className="card secretary">
            <h3>Secretary</h3>
            <p>Name : Rameshbhai</p>
            <p>Flat No : B-104</p>
            <p>Contact : <span>9745761209</span></p>
          </div>

          <div className="card custom1">
            <h3>Custom number</h3>
            <p>Name : SureshBhai</p>
            <p>Flat No : A-302</p>
            <p>Contact : <span>9809985676</span></p>
          </div>

          <div className="card custom2">
            <h3>Custom number</h3>
            <p>Name : BharatBhai</p>
            <p>Flat No : B-401</p>
            <p>Contact : <span>9125629867</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContact;
