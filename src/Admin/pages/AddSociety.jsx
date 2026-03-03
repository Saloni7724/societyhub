import React, { useState } from "react";
import "../css/AddSociety.css";
import bgImage from "../photos/Addsociety.png";
import { db, auth } from "../Backend/firebase-init";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const generateSocietyCode = (length = 6) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

function AddSociety() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: generateSocietyCode(),
    name: "",
    address: "",
    adminId: "", // now email
    adminPass: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateUniqueCode = async () => {
    let isUnique = false;
    let newCode = "";

    while (!isUnique) {
      newCode = generateSocietyCode();

      const q = query(
        collection(db, "societies"),
        where("code", "==", newCode)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        isUnique = true;
      }
    }

    return newCode;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.adminId || !formData.adminPass) {
      alert("All fields required");
      return;
    }

    try {
      // ✅ Create Firebase Auth User
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.adminId,
        formData.adminPass
      );

      const uid = userCredential.user.uid;

      const uniqueCode = await generateUniqueCode();

      // ✅ Save Society without password
      await addDoc(collection(db, "societies"), {
        code: uniqueCode,
        name: formData.name,
        address: formData.address,
        adminEmail: formData.adminId,
        adminUid: uid,
        createdAt: serverTimestamp(),
      });

      alert(`Society Registered Successfully ✅`);

      navigate("/Login");

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div
      className="society-bg"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="society-form-card">
        <h2>Society Registration</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="code"
            value={formData.code}
            readOnly
            className="auto-code"
          />

          <input
            type="text"
            name="name"
            placeholder="Society Name"
            onChange={handleChange}
          />

          <textarea
            name="address"
            placeholder="Society Address"
            onChange={handleChange}
          />

          <input
            type="email"
            name="adminId"
            placeholder="Admin Email"
            onChange={handleChange}
          />

          <input
            type="password"
            name="adminPass"
            placeholder="Admin Password"
            onChange={handleChange}
          />

          <button type="submit">Register Society</button>
        </form>
      </div>
    </div>
  );
}

export default AddSociety;