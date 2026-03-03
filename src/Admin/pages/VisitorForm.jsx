import React, { useState } from "react";
import { db } from "../Backend/firebase-init";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import "../css/VisitorForm.css";

const VisitorForm = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    flat: "",
    purpose: "",
  });

  const [searchParams] = useSearchParams();
  const societyId = searchParams.get("societyId");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  const cleanPhone = form.phone.replace(/\s/g, "");

  if (!form.name || !form.flat || !form.purpose || cleanPhone.length !== 10) {
    alert("Please fill all fields correctly");
    return;
  }

  if (!societyId) {
    alert("Society not found");
    return;
  }

  try {
    await addDoc(
      collection(db, "societies", societyId, "visitors"),
      {
        ...form,
        phone: cleanPhone,
        createdAt: serverTimestamp(),
        source: "qr",
      }
    );

    alert("Entry Submitted Successfully ✅");
    setForm({ name: "", phone: "", flat: "", purpose: "" });
  } catch (error) {
    console.error("Error adding visitor:", error);
    alert(error.message);
  }
};

  return (
    <div className="visitor-form-page">
      <div className="visitor-card">
        <h2>Visitor Entry</h2>

        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} />

    <label>Contact</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            maxLength={11}
            placeholder="98765 43210"
            inputMode="numeric"
            pattern="[0-9]*"
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, "").slice(0, 10);
      if (val.length > 5)
        val = val.slice(0, 5) + " " + val.slice(5);
      setForm({ ...form, phone: val });
           }}
/>

        <label>Flat</label>
        <input name="flat" value={form.flat} onChange={handleChange} />

        <label>Purpose</label>
        <select name="purpose" value={form.purpose} onChange={handleChange}>
          <option value="">Select</option>
          <option>Friend</option>
          <option>Delivery</option>
          <option>Family</option>
        </select>

        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default VisitorForm;