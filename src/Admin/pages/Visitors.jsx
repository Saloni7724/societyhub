import React, { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import "../css/Visitors.css";
import Select from "react-select";
import { db } from "../Backend/firebase-init";
import {
  collection,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";

const Visitors = () => {
  const [flatOptions, setFlatOptions] = useState([]);
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
const societyId = localStorage.getItem("societyId"); 
const websiteURL = `https://societyhub-cyan.vercel.app/visitor-form?societyId=${societyId}`;

  // ✅ Fetch flats dynamically from Firestore
  useEffect(() => {
    if (!societyId) return;

    const q = collection(db, "societies", societyId, "members");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const flatsSet = new Set();

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.flat) flatsSet.add(data.flat);
      });

     const flatsArray = Array.from(flatsSet)
  .sort((a, b) => {
    // Split block and number
    const [blockA, numA] = a.split("-"); 
    const [blockB, numB] = b.split("-"); 
    if (blockA === blockB) {
      return parseInt(numA) - parseInt(numB); // sort by number within same block
    }
    return blockA.localeCompare(blockB); // sort by block
  })
  .map((flat) => ({ value: flat, label: flat }));

setFlatOptions(flatsArray);
    });

    return () => unsubscribe();
  }, [societyId]);

  // ✅ Fetch visitors
  useEffect(() => {
    if (!societyId) return;

    const q = query(
      collection(db, "societies", societyId, "visitors"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVisitors(data);
    });

    return () => unsubscribe();
  }, [societyId]);

  // Input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Flat select change
  const handleFlatChange = (selectedOption) => {
    setForm({ ...form, flat: selectedOption?.value || "" });
  };

  // Submit form
  const handleSubmit = async () => {
    const cleanPhone = form.phone.replace(/\s/g, "");

    if (!form.name || !form.flat || !form.purpose || cleanPhone.length !== 10) {
      alert("Please fill all fields correctly");
      return;
    }

    try {
      await addDoc(collection(db, "societies", societyId, "visitors"), {
        name: form.name,
        phone: cleanPhone,
        flat: form.flat,
        purpose: form.purpose,
        createdAt: serverTimestamp(),
      });

      setForm({ name: "", phone: "", flat: "", purpose: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding visitor:", error);
    }
  };

  // Filter visitors
  const filteredVisitors = visitors.filter((v) =>
    v.name?.toLowerCase().includes(search.toLowerCase())
  );

  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    websiteURL
  )}`;

  return (
    <AdminLayout active="visitors">
      <div className="visitors-page">
        {/* HEADER */}
        <div className="visitors-header">
          <button className="add-visitor" onClick={() => setShowForm(true)}>
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
              <Select
                options={flatOptions}
                onChange={handleFlatChange}
                value={flatOptions.find((f) => f.value === form.flat)}
                placeholder="Select flat..."
                isSearchable
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />

              <label>Purpose</label>
              <select name="purpose" value={form.purpose} onChange={handleChange}>
                <option value="">Select</option>
                <option>Friend</option>
                <option>Delivery</option>
                <option>Family</option>
              </select>

              <button className="submit-btn4" onClick={handleSubmit}>
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
                <button className="submit-btn4">Download QR</button>
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