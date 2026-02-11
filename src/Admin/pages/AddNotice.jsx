import React, { useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import "../css/AddNotice.css";
import { FiTrash2, FiX } from "react-icons/fi";
import { AiOutlineExclamationCircle } from "react-icons/ai";

const AddNotice = () => {
  const [showModal, setShowModal] = useState(false);

  const [notices, setNotices] = useState([
    {
      title: "Water Supply Timing",
      date: "20/2/2026",
      message:
        "Water supply will be available from 6 AM to 9 AM and 6 PM to 9 PM",
      priority: "high",
    },
    {
      title: "Monthly Maintenance Due",
      date: "10/2/2026",
      message: "Please pay maintenance fees by 25th of this month",
      priority: "medium",
    },
    {
      title: "Routine Maintenance - Garden Area",
      date: "05/3/2026",
      message: "The central garden area will undergo routine maintenance.",
      priority: "low",
    },
  ]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deletedNotice, setDeletedNotice] = useState(null);
  const [showUndo, setShowUndo] = useState(false);

  // 🔹 OPEN CONFIRM POPUP
  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setShowConfirm(true);
  };

  // 🔹 CONFIRM DELETE
  const handleDelete = () => {
    const removed = notices[deleteIndex];

    setDeletedNotice(removed);
    setNotices(notices.filter((_, i) => i !== deleteIndex));

    setShowConfirm(false);
    setShowUndo(true);

    setTimeout(() => {
      setShowUndo(false);
      setDeletedNotice(null);
    }, 4000);
  };

  // 🔹 UNDO DELETE
  const undoDelete = () => {
    setNotices((prev) => [...prev, deletedNotice]);
    setShowUndo(false);
  };

  return (
    <AdminLayout active="notice">
      <div className={`notice-page ${showModal ? "blurred" : ""}`}>
        <div className="notice-header">
          <button
            className="add-notice-btn"
            onClick={() => setShowModal(true)}
          >
            + Add Notice
          </button>
        </div>

        <div className="notice-list">
          {notices.map((n, i) => (
            <div key={i} className={`notice-card ${n.priority}`}>
              <div className="notice-left">
                <AiOutlineExclamationCircle />
                <div>
                  <h4>{n.title}</h4>
                  <span className="notice-date">🔔 {n.date}</span>
                  <p>{n.message}</p>
                </div>
              </div>

              <div className="notice-right">
                <span className={`priority ${n.priority}`}>
                  {n.priority}
                </span>
                <FiTrash2
                  className="delete-icon"
                  onClick={() => confirmDelete(i)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 CREATE NOTICE MODAL */}
      {showModal && (
        <div className="notice-modal-overlay">
          <div className="notice-modal">
            <button
              className="close-btn"
              onClick={() => setShowModal(false)}
            >
              <FiX />
            </button>

            <h3>Create New Notice</h3>

            <label>Notice Title</label>
            <input type="text" />

            <label>Date</label>
            <input type="date" />

            <label>Content</label>
            <textarea rows="4"></textarea>

            <label>Status</label>
            <select>
              <option>high</option>
              <option>medium</option>
              <option>low</option>
            </select>

            <button className="post-btn">Post Notice</button>
          </div>
        </div>
      )}

      {/* 🔹 DELETE CONFIRMATION */}
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h4>Delete Notice?</h4>
            <p>This action cannot be undone.</p>

            <div className="confirm-actions">
              <button onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 UNDO TOAST */}
      {showUndo && (
        <div className="undo-toast">
          <span>Notice deleted</span>
          <button onClick={undoDelete}>UNDO</button>
        </div>
      )}
    </AdminLayout>
  );
};

export default AddNotice;
