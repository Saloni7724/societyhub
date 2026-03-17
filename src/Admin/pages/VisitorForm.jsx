import React, { useState, useEffect } from "react";
import Select from "react-select";
import { db } from "../Backend/firebase-init";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import "../css/VisitorForm.css";

import { onSnapshot } from "firebase/firestore";



const VisitorForm = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    flat: "",
    purpose: "",
  });
  const [flatOptions, setFlatOptions] = useState([]);

  const [searchParams] = useSearchParams();
  const societyId = searchParams.get("societyId");
 useEffect(() => {
  if (!societyId) return;

  const q = collection(db, "societies", societyId, "members");

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const flatsSet = new Set();

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.flat) {
        flatsSet.add(data.flat); // avoid duplicates
      }
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleFlatChange = (selectedOption) => {
  setForm({
    ...form,
    flat: selectedOption?.value || "",
  });
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
          onChange={(e) => {
            let val = e.target.value.replace(/\D/g, "").slice(0, 10);
            if (val.length > 5)
              val = val.slice(0, 5) + " " + val.slice(5);
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

        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default VisitorForm;