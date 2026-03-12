import React, { useState, useEffect } from "react";
import "./css/Complaint.css";
import { FaPaperPlane, FaExclamationTriangle } from "react-icons/fa";

import { db } from "../Backend/firebase-init";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot
} from "firebase/firestore";

const Complaint = () => {

  const societyId = localStorage.getItem("societyId");
  const userName = localStorage.getItem("userName");
  const userFlat = localStorage.getItem("userFlat");

  const [formData, setFormData] = useState({
    category: "",
    priority: "",
    message: ""
  });

  const [complaints, setComplaints] = useState([]);

  /* ========================= */
  /* Realtime Complaints */
  /* ========================= */

  useEffect(() => {

    if (!societyId) return;

    const q = query(
      collection(db, "societies", societyId, "complaints"),
      where("residentName", "==", userName),
      where("flatNumber", "==", userFlat)
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComplaints(list);
    });

    return () => unsubscribe();

  }, [societyId, userName, userFlat]);

  /* ========================= */

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /* ========================= */
  /* Submit Complaint */
  /* ========================= */

  const handleSubmit = async e => {
    e.preventDefault();

    try {

      const complaintData = {
        residentName: userName,
        flatNumber: userFlat,
        category: formData.category,
        priority: formData.priority,
        complaintMessage: formData.message,
        status: "Pending",
        createdAt: new Date()
      };

      await addDoc(
        collection(db, "societies", societyId, "complaints"),
        complaintData
      );

      alert(`✅ Complaint Submitted Successfully

Resident Name : ${userName}
Flat Number : ${userFlat}`);

      setFormData({
        category: "",
        priority: "",
        message: ""
      });

    } catch (err) {
      console.log(err);
      alert("Error submitting complaint");
    }
  };

  /* ========================= */

  const getStatusColor = status => {
    if (status === "Pending") return "orange";
    if (status === "In Progress") return "blue";
    if (status === "Resolved") return "green";
    return "gray";
  };

  /* ========================= */

  return (
    <div className="complaint-page">

      <div className="complaint-card">

        <h2>💬 Register Complaint</h2>

        <form onSubmit={handleSubmit} className="complaint-form">

          {/* Category + Priority Row */}
          <div className="form-row">

            <div className="input-box">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option>Water Issue</option>
                <option>Electricity Issue</option>
                <option>Cleaning Issue</option>
                <option>Security Issue</option>
              </select>
            </div>

            <div className="input-box">
              <label>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="">Select Priority</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

          </div>

          {/* Complaint Box */}
          <div className="input-box full">
            <label>Complaint Message</label>
            <textarea
              name="message"
              placeholder="Enter complaint details..."
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          {/* Note */}
          <div className="complaint-note">
            <FaExclamationTriangle />
            <span>Will be sent with your Name and Flat Number</span>
          </div>

          <button className="submit-btn">
            <FaPaperPlane /> Submit Complaint
          </button>

        </form>
      </div>

      {/* ========================= */}
      {/* Complaint Status List */}
      {/* ========================= */}

      <div className="complaint-card">
        <h3>📋 My Complaint Status</h3>

        {complaints.map(c => (
          <div key={c.id} className="status-card">

            <h4>{c.category}</h4>
            <p>{c.complaintMessage}</p>

            <p>
              Status :
              <b style={{
                marginLeft: "10px",
                color: getStatusColor(c.status)
              }}>
                {c.status}
              </b>
            </p>

          </div>
        ))}

      </div>

    </div>
  );
};

export default Complaint;