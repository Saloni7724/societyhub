import React, { useState } from "react";
import "../css/AddSociety.css";
import bgImage from "../photos/Addsociety.png";

const generateSocietyCode = (length = 6) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

function AddSociety() {
  const [formData, setFormData] = useState({
    code: generateSocietyCode(),
    name: "",
    address: "",
    adminId: "",
    adminPass: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Society Code: ${formData.code}`);
  };

  return (
    <div
      className="society-bg"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="society-form-card">
        <h2>Society Registration</h2>

        <form onSubmit={handleSubmit}>
          {/* AUTO GENERATED CODE */}
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
            type="text"
            name="adminId"
            placeholder="Admin ID"
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
