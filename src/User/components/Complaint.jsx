import React, { useState } from "react";
import "./css/Complaint.css";
import { FaPaperPlane, FaExclamationTriangle } from "react-icons/fa";

const Complaint = () => {
  // ✅ Hidden Logged-in User Info
  const userData = {
    name: "Patel Mansi",
    flat: "A-101",
  };

  const [formData, setFormData] = useState({
    category: "",
    priority: "",
    message: "",
  });

  // Handle Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Complaint
  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Complaint Data with Auto Name + Flat
    const complaintData = {
      residentName: userData.name,
      flatNumber: userData.flat,
      category: formData.category,
      priority: formData.priority,
      complaintMessage: formData.message,
      date: new Date().toLocaleString(),
    };

    console.log("✅ Complaint Submitted:", complaintData);

    // ✅ Show Full Complaint Message (Name + Flat)
    alert(
      `✅ Complaint Submitted Successfully!\n\n` +
        `👤 Name: ${userData.name}\n` +
        `🏠 Flat No: ${userData.flat}\n\n` +
        `📌 Category: ${formData.category}\n` +
        `⚡ Priority: ${formData.priority}\n\n` +
        `📝 Complaint: ${formData.message}`
    );

    // Reset Form
    setFormData({
      category: "",
      priority: "",
      message: "",
    });
  };

  return (
    <div className="complaint-page">
      {/* Header */}
      <div className="complaint-header">
        <h2>💬 Register Complaint</h2>
        <p>
          Submit your issue here. Society management will take action soon.
        </p>
      </div>

      {/* Complaint Form */}
      <div className="complaint-card">
        <form onSubmit={handleSubmit}>
          {/* Category + Priority */}
          <div className="form-row">
            <div className="input-box">
              <label>Complaint Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Category --</option>
                <option value="Water Issue">🚰 Water Issue</option>
                <option value="Electricity Issue">⚡ Electricity Issue</option>
                <option value="Cleaning Issue">🧹 Cleaning Issue</option>
                <option value="Security Issue">🛡️ Security Issue</option>
                <option value="Other">📌 Other</option>
              </select>
            </div>

            <div className="input-box">
              <label>Priority Level</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Priority --</option>
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </select>
            </div>
          </div>

          {/* Complaint Text */}
          <div className="input-box full">
            <label>Complaint Details</label>
            <textarea
              name="message"
              placeholder="Write your complaint in detail..."
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Note */}
          <div className="complaint-note">
            <FaExclamationTriangle className="warn-icon" />
            <span>
              Complaint will automatically be submitted with your registered Name
              and Flat Number.
            </span>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            <FaPaperPlane /> Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
};

export default Complaint;
