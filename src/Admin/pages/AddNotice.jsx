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
  const [showModal, setShowModal] = useState(false);
  const [notices, setNotices] = useState([]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    date: "",
    message: "",
    priority: "high",
  });

  /* FETCH NOTICES */
  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));
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

  /* HANDLE INPUT */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ADD NOTICE */
  const handleAddNotice = async () => {
    if (!form.title || !form.date || !form.message) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "notices"), {
        ...form,
        createdAt: serverTimestamp(),
      });

      setForm({
        title: "",
        date: "",
        message: "",
        priority: "high",
      });

      setShowModal(false);
      fetchNotices();
    } catch (err) {
      console.error("Error adding notice:", err);
    }
  };

  /* DELETE CONFIRM */
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  /* DELETE NOTICE */
  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "notices", deleteId));
      setShowConfirm(false);
      fetchNotices();
    } catch (err) {
      console.error("Error deleting notice:", err);
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

            <label>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />

            <label>Content</label>
            <textarea
              rows="4"
              name="message"
              value={form.message}
              onChange={handleChange}
            ></textarea>

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
              <button onClick={() => setShowConfirm(false)}>Cancel</button>
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
