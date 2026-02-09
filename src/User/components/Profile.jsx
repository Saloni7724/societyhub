import React, { useState } from "react";
import "./css/Profile.css";
import profileImg from "../assets/profile.png";

const Profile = () => {
  // Profile Data State
  const [user, setUser] = useState({
    name: "Patel Mansi",
    flat: "101",
    contact: "9875046562",
    profession: "Job",
    gender: "Female",
  });

  // Edit Mode State
  const [editMode, setEditMode] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState(user);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save Updated Data
  const handleSave = () => {
    setUser(formData);
    setEditMode(false);
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your personal details</p>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        {/* Left Side */}
        <div className="profile-left">
          <img src={profileImg} alt="Profile" className="profile-image" />
          <h2>{user.name}</h2>
          <p className="flat">Flat No: {user.flat}</p>
        </div>

        {/* Right Side */}
        <div className="profile-right">
          <h3>Basic Information</h3>

          {/* VIEW MODE */}
          {!editMode ? (
            <>
              <div className="info-box">
                <span>📞 Contact</span>
                <p>{user.contact}</p>
              </div>

              <div className="info-box">
                <span>💼 Profession</span>
                <p>{user.profession}</p>
              </div>

              <div className="info-box">
                <span>🚻 Gender</span>
                <p>{user.gender}</p>
              </div>

              {/* Edit Button */}
              <button
                className="edit-btn"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            </>
          ) : (
            <>
              {/* EDIT FORM MODE */}
              <div className="edit-form">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />

                <label>Contact:</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                />

                <label>Profession:</label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                />

                <label>Gender:</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>

                {/* Buttons */}
                <div className="btn-group">
                  <button className="save-btn" onClick={handleSave}>
                    Save
                  </button>

                  <button
                    className="cancel-btn"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
