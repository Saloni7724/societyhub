import React, { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import "../css/Maintenance.css";
import { FiX } from "react-icons/fi";
import { db } from "../Backend/firebase-init";

import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  getDocs
} from "firebase/firestore";
const societyId = localStorage.getItem("societyId");
const Maintenance = () => {
  const [showModal, setShowModal] = useState(false);
  const [rows, setRows] = useState([]);

  const [formData, setFormData] = useState({
  title: "",
  date: "",
  status: "Upcoming",
  amount: "100",
  targetType: "All",
});

  const [error, setError] = useState("");

  /* 🔥 FETCH DATA REALTIME */
 useEffect(() => {
  if (!societyId) return;

  const unsubscribe = onSnapshot(
    collection(db, "societies", societyId, "maintenance"),
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRows(data);
    }
  );

  return () => unsubscribe();
}, [societyId]);

  /* OPEN / CLOSE MODAL */
  const openModal = () => {
    setShowModal(true);
    setError("");
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ amount: "", profession: "", month: "" });
    setError("");
  };

  /* HANDLE INPUT */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* 🔥 SUBMIT TO FIRESTORE */


const handleSubmit = async () => {
  if (!formData.amount || !formData.profession || !formData.month) {
    setError("All fields are required");
    return;
  }

  if (!societyId) {
    setError("Society not found");
    return;
  }

  try {
    // 🔹 Get Members from the society
    const membersSnapshot = await getDocs(
      collection(db, "societies", societyId, "members")
    );

    const members = membersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    let filteredMembers = [];

    if (formData.profession === "all") {
      filteredMembers = members;
    } else if (formData.profession === "rent") {
      filteredMembers = members.filter((m) => m.residenceType === "Rent");
    } else if (formData.profession === "permanent") {
      filteredMembers = members.filter(
        (m) => m.residenceType === "Permanent"
      );
    }

    // 🔹 Create Maintenance for each member in society
    for (let member of filteredMembers) {
      await addDoc(
        collection(db, "societies", societyId, "maintenance"),
        {
          member: member.name,
          flat: member.flat,
          block: member.block,
          month: formData.month,
          dueAmount: formData.amount,
          paidAmount: 0,
          pendingAmount: formData.amount,
          dueDate: `10-${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
          status: "Pending",
          residenceType: member.residenceType,
          createdAt: serverTimestamp(),
        }
      );

      // 🔔 Notification entry per society
      await addDoc(
        collection(db, "societies", societyId, "notifications"),
        {
          userId: member.id,
          title: "Maintenance Generated",
          message: `₹${formData.amount} maintenance for ${formData.month} generated for Flat ${member.flat}`,
          createdAt: serverTimestamp(),
          read: false,
        }
      );
    }
    

    closeModal();
  } catch (err) {
    console.error("Error generating maintenance:", err);
    setError("Failed to generate maintenance");
  }
};

  return (
    <AdminLayout active="maintenance">
      <div className="maintenance-container">
        <div className="maintenance-header">
       
          <button className="add-maintenance" onClick={openModal}>
            + Add Maintenance
          </button>
        </div>

        <table className="maintenance-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Flat</th>
              <th>Month</th>
              <th>Due Amount</th>
              <th>Paid Amount</th>
              <th>Pending Amount</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No maintenance generated
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.member}</td>
                  <td>{row.flat}</td>
                  <td>{row.month}</td>
                  <td>₹{row.dueAmount}</td>
                  <td>₹{row.paidAmount}</td>
                  <td>₹{row.pendingAmount}</td>
                  <td>{row.dueDate}</td>
                  <td>
                    <span className="status pending">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* MODAL */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <div className="modal-header">
                <h3>Generate Maintenance</h3>
                <FiX onClick={closeModal} className="close-icon" />
              </div>

              <div className="modal-body">
                <label>Month</label>
                <input
                  type="text"
                  name="month"
                  placeholder="Enter month"
                  value={formData.month}
                  onChange={handleChange}
                />

                <label>Amount</label>
                <input
                  type="number"
                  name="amount"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={handleChange}
                />

                <label>Assign to</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="profession"
                      value="all"
                      onChange={handleChange}
                    />
                    All Members
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="profession"
                      value="rent"
                      onChange={handleChange}
                    />
                    Rent House
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="profession"
                      value="permanent"
                      onChange={handleChange}
                    />
                    Permanent House
                  </label>
                </div>

                {error && <p className="error-text">{error}</p>}
              </div>

              <div className="modal-footer">
                <button className="cancel-maintenance" onClick={closeModal}>
                  Cancel
                </button>
                <button className="submit-maintenance" onClick={handleSubmit}>
                  Generate Maintenance
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Maintenance;