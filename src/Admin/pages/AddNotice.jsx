import React, { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import "../css/AddNotice.css";
import { FiTrash2, FiX } from "react-icons/fi";
import { AiOutlineExclamationCircle } from "react-icons/ai";

import { db } from "../Backend/firebase-init";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const AddNotice = () => {

  const societyId = localStorage.getItem("societyId");

  const [showModal, setShowModal] = useState(false);
  const [notices, setNotices] = useState([]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: "",
    date: "",
    message: "",
    priority: "high",
  });

  /* FETCH NOTICES */
  const fetchNotices = async () => {
    if (!societyId) return;

    try {
      const q = query(
        collection(db, "societies", societyId, "notices"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotices(data);
    } catch (err) {
      console.error("Error fetching notices:", err);
    }
  };

useEffect(() => {
  if (societyId) fetchNotices();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  /* HANDLE INPUT */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* VALIDATE FORM */
  const validateForm = () => {
    let newErrors = {};

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    if (!form.title.trim()) {
      newErrors.title = "Notice title is required";
    }

    if (!form.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(form.date);

      if (selectedDate < todayDate) {
        newErrors.date = "Past dates are not allowed";
      }
    }

    if (!form.message.trim()) {
      newErrors.message = "Content is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ADD NOTICE */
  const handleAddNotice = async () => {
    if (!validateForm()) return;
    if (!societyId) return alert("Society not found");

    try {
      await addDoc(collection(db, "societies", societyId, "notices"), {
        ...form,
        createdAt: serverTimestamp(),
      });

      setForm({
        title: "",
        date: "",
        message: "",
        priority: "high",
      });

      setErrors({});
      setShowModal(false);
      fetchNotices();
    } catch (err) {
      console.error("Error adding notice:", err);
      alert("Error saving notice");
    }
  };

  /* DELETE CONFIRM */
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  /* DELETE NOTICE */
  const handleDelete = async () => {
    if (!societyId || !deleteId) return;

    try {
      await deleteDoc(
        doc(db, "societies", societyId, "notices", deleteId)
      );

      setShowConfirm(false);
      fetchNotices();
    } catch (err) {
      console.error("Error deleting notice:", err);
      alert("Error deleting notice");
    }
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
          {notices.map((n) => (
            <div key={n.id} className={`notice-card ${n.priority}`}>
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
                  onClick={() => confirmDelete(n.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE NOTICE MODAL */}
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
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
            />
            {errors.title && <span className="error">{errors.title}</span>}

            <input
              type="date"
              name="date"
              min={new Date().toISOString().split("T")[0]}
              value={form.date}
              onChange={handleChange}
            />
            {errors.date && <span className="error">{errors.date}</span>}

            <label>Content</label>
            <textarea
              rows="4"
              name="message"
              value={form.message}
              onChange={handleChange}
            ></textarea>
            {errors.message && <span className="error">{errors.message}</span>}

            <label>Status</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="high">high</option>
              <option value="medium">medium</option>
              <option value="low">low</option>
            </select>

            <button className="post-btn" onClick={handleAddNotice}>
              Post Notice
            </button>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">

            <h4>Delete Notice?</h4>
            <p>This action cannot be undone.</p>

            <div className="confirm-actions">
              <button onClick={() => setShowConfirm(false)}>
                Cancel
              </button>

              <button className="danger" onClick={handleDelete}>
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default AddNotice;