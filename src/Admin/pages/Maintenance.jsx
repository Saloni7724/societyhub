import React, { useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import "../css/Maintenance.css";
import { FiX } from "react-icons/fi";

const Maintenance = () => {
  const [showModal, setShowModal] = useState(false);
  const [rows, setRows] = useState([]);

  const [formData, setFormData] = useState({
    amount: "",
    profession: "",
  });

  const [error, setError] = useState("");

  /* 🔹 OPEN / CLOSE MODAL */
  const openModal = () => {
    setShowModal(true);
    setError("");
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ amount: "", profession: "" });
    setError("");
  };

  /* 🔹 HANDLE INPUT */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* 🔹 SUBMIT LOGIC */
  const handleSubmit = () => {
    if (!formData.amount || !formData.profession) {
      setError("All fields are required");
      return;
    }

    const newRow = {
      member: "All Members",
      flat: "-",
      month: "April 2024",
      dueAmount: formData.amount,
      paidAmount: "₹0",
      pendingAmount: formData.amount,
      dueDate: "10-04-2024",
      status: "Pending",
    };

    setRows([...rows, newRow]);
    closeModal();
  };

  return (
    <AdminLayout active="maintenance">
      <div className="maintenance-container">
        {/* HEADER */}
        <div className="maintenance-header">
          <h2>Maintenance Management</h2>
          <button className="add-btn" onClick={openModal}>
            + Add Maintenance
          </button>
        </div>

        {/* TABLE */}
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
              rows.map((row, index) => (
                <tr key={index}>
                  <td>{row.member}</td>
                  <td>{row.flat}</td>
                  <td>{row.month}</td>
                  <td>₹{row.dueAmount}</td>
                  <td>{row.paidAmount}</td>
                  <td>₹{row.pendingAmount}</td>
                  <td>{row.dueDate}</td>
                  <td>
                    <span className="status pending">{row.status}</span>
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
                <input value="April 2024" disabled />

                <label>Amount</label>
                <input
                  type="number"
                  name="amount"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={handleChange}
                />

                <label>Profession</label>
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
                <button className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button className="submit-btn" onClick={handleSubmit}>
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
