import React from "react";
import "./css/SocietyEvents.css";
import { FaCalendarAlt, FaUsers, FaRupeeSign, FaRegCalendarCheck } from "react-icons/fa";

const SocietyEvents = () => {
  return (
    <div className="events-wrapper">

      {/* Header with image */}
      <div
        className="events-header"
    
      >
        <h2>
          <FaRegCalendarCheck /> Society Events
        </h2>
      </div>

      <hr />

      <div className="events-grid">

        {/* Event 1 */}
        <div className="event-box">
          <label>Event Title</label>
          <div className="field">Republic day celebration</div>

          <label>Event Date</label>
          <div className="field">
            <FaCalendarAlt /> 26 jan 2026
          </div>

          <label>Total Joining Person</label>
          <select>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>

          <label>Total Amount</label>
          <div className="field">
            <FaRupeeSign /> 300
          </div>

          <button className="pay-btn">Pay ₹ 300</button>
        </div>

        {/* Event 2 */}
        <div className="event-box">
          <label>Event Title</label>
          <div className="field">Holi Celebration</div>

          <label>Event Date</label>
          <div className="field">
            <FaCalendarAlt /> 04 mar 2026
          </div>

          <label>Total Joining Person</label>
          <select>
            <option>4</option>
            <option>5</option>
            <option>6</option>
          </select>

          <label>Total Amount</label>
          <div className="field">
            <FaRupeeSign /> 200
          </div>

          <button className="pay-btn">Pay ₹ 200</button>
        </div>

      </div>
    </div>
  );
};

export default SocietyEvents;
