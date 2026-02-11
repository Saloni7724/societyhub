import React, { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import "../css/Visitors.css";

import { db } from "../Backend/firebase-init";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const Visitors = () => {
  const [showForm, setShowForm] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [search, setSearch] = useState("");

  const [visitors, setVisitors] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    flat: "",
    purpose: "",
  });

  const websiteURL = "https://your-visitor-form.com";

  /* FETCH VISITORS */
  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const q = query(
        collection(db, "visitors"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setVisitors(data);
    } catch (err) {
      console.error("Error fetching visitors:", err);
    }
  };

  /* HANDLE INPUT */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* SUBMIT FORM */
  const handleSubmit = async () => {
    const cleanPhone = form.phone.replace(/\s/g, "");

    if (
      !form.name ||
      !form.flat ||
      !form.purpose ||
      cleanPhone.length !== 10
    ) {
      alert("Please fill all fields correctly");
      return;
    }

    try {
      await addDoc(collection(db, "visitors"), {
        name: form.name,
        phone: cleanPhone,
        flat: form.flat,
        purpose: form.purpose,
        createdAt: serverTimestamp(),
      });

      setForm({ name: "", phone: "", flat: "", purpose: "" });
      setShowForm(false);
      fetchVisitors();
    } catch (error) {
      console.error("Error adding visitor:", error);
    }
  };

  /* SEARCH FILTER */
  const filteredVisitors = visitors.filter((v) =>
    v.name?.toLowerCase().includes(search.toLowerCase())
  );

  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${websiteURL}`;

  return (
    <AdminLayout active="visitors">
      <div className="visitors-page">
        {/* HEADER */}
        <div className="visitors-header">
          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Add Visitors
          </button>

          <div className="right-actions">
            <button className="qr-btn" onClick={() => setShowQR(true)}>
              QR Code
            </button>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <table className="visitors-table">
          <thead>
            <tr>
              <th>Visitor Name</th>
              <th>Contact</th>
              <th>Flat</th>
              <th>Purpose</th>
              <th>Check-In</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisitors.map((v) => (
              <tr key={v.id}>
                <td>{v.name}</td>
                <td>{v.phone}</td>
                <td>{v.flat}</td>
                <td>{v.purpose}</td>
                <td>
                  {v.createdAt?.toDate
                    ? v.createdAt.toDate().toLocaleString()
                    : "Just now"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* FORM MODAL */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>Visitor Entry</h3>

              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} />

              <label>Contact</label>
              <input
                name="phone"
                value={form.phone}
                maxLength={11}
                placeholder="98765 43210"
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  if (val.length > 5) val = val.slice(0, 5) + " " + val.slice(5);
                  setForm({ ...form, phone: val });
                }}
              />

              <label>Flat</label>
              <input name="flat" value={form.flat} onChange={handleChange} />

              <label>Purpose</label>
              <select
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>Friend</option>
                <option>Delivery</option>
                <option>Family</option>
              </select>

              <button className="submit-btn" onClick={handleSubmit}>
                Submit
              </button>

              <span className="close" onClick={() => setShowForm(false)}>
                ✕
              </span>
            </div>
          </div>
        )}

        {/* QR MODAL */}
        {showQR && (
          <div className="modal-overlay">
            <div className="modal-card qr-card">
              <h3>Visitor QR Code</h3>
              <img src={qrImage} alt="QR" />
              <a href={qrImage} download="visitor-qr.png">
                <button className="submit-btn">Download QR</button>
              </a>
              <span className="close" onClick={() => setShowQR(false)}>
                ✕
              </span>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Visitors;
