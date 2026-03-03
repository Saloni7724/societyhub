import React, { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import "../css/Complaints.css";

import { db } from "../Backend/firebase-init";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";




const societyId = localStorage.getItem("societyId"); 
const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("All");

  /* FETCH COMPLAINTS */
  useEffect(() => {
    fetchComplaints();
  }, []);

 const fetchComplaints = async () => {
  if (!societyId) return; // safety check

  try {
    const q = query(
      collection(db, "societies", societyId, "complaints"), // subcollection path
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setComplaints(data);
  } catch (err) {
    console.error("Error fetching complaints:", err);
  }
};

  /* UPDATE STATUS */
  const handleStatusChange = async (id, newStatus) => {
    try {
     const complaintRef = doc(db, "societies", societyId, "complaints", id);
      await updateDoc(complaintRef, {
        status: newStatus,
      });

      // Update UI
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: newStatus } : c
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  /* FILTER LOGIC */
 const filteredComplaints = complaints.filter(c => {
  const matchesSearch =
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.flat?.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase());

  const matchesStatus =
    statusFilter === "All" || c.status === statusFilter;

  return matchesSearch && matchesStatus;
});
  /* STATS */
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const progress = complaints.filter((c) => c.status === "In Progress").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  return (
    <AdminLayout active="complaints">
      <div className="complaints-container">
        {/* STATS */}
        <div className="complaints-stats">
          <div className="stat-card">
            <p>Total Complaints</p>
            <h2>{total}</h2>
          </div>
          <div className="stat-card">
            <p>Pending</p>
            <h2>{pending}</h2>
          </div>
          <div className="stat-card">
            <p>In Progress</p>
            <h2>{progress}</h2>
          </div>
          <div className="stat-card">
            <p>Resolved</p>
            <h2>{resolved}</h2>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="complaints-filters">
          <input
            type="text"
            placeholder="Search Complaints..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* COMPLAINT LIST */}
        {filteredComplaints.map((c) => (
          <div className="complaint-card" key={c.id}>
            <div className="complaint-header">
              <div>
                <h4>{c.title}</h4>
                <p className="complaint-meta">
                  Flat: {c.flat} • {c.date}
                  <span className="tag">{c.category}</span>
                </p>
              </div>

              <select
                className={`status-dropdown ${c.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
                value={c.status}
                onChange={(e) =>
                  handleStatusChange(c.id, e.target.value)
                }
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>

            <p className="complaint-text">{c.text}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default Complaints;
