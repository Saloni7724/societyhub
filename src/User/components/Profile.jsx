import React, { useState, useEffect } from "react";
import "./css/Profile.css";
import profileImg from "../assets/profile.png";
import { db } from "../Backend/firebase-init";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Profile = () => {
  const societyId = localStorage.getItem("societyId");
  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // :white_check_mark: Fetch Member Data
  useEffect(() => {
    const fetchUser = async () => {
      if (!societyId || !userId) return;

      const docRef = doc(db, "societies", societyId, "members", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser(docSnap.data());
        setFormData(docSnap.data());
      } else {
        console.log("No such member!");
      }
    };

    fetchUser();
  }, [societyId, userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // :white_check_mark: Update Member Data
  const handleSave = async () => {
    const docRef = doc(db, "societies", societyId, "members", userId);
    await updateDoc(docRef, formData);

    setUser(formData);
    setEditMode(false);
    alert("Profile Updated Successfully :white_check_mark:");
  };

  if (!user) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your personal details</p>
      </div>

      <div className="profile-card">
        <div className="profile-left">
          <img src={profileImg} alt="Profile" className="profile-image" />
          <h2>{user.name}</h2>
          <p className="flat">Flat No: {user.flat}</p>
        </div>

        <div className="profile-right">
          <h3>Basic Information</h3>

          {!editMode ? (
            <>
              <div className="info-box">
                <span> Contact</span>
                <p>{user.phone}</p>
              </div>

              <div className="info-box">
                <span> Profession</span>
                <p>{user.profession}</p>
              </div>

              <div className="info-box">
                <span> Email</span>
                <p>{user.email}</p>
              </div>

              <button className="edit-btn" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            </>
          ) : (
            <div className="edit-form">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
              />

              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />

              <label>Profession:</label>
              <input
                type="text"
                name="profession"
                value={formData.profession || ""}
                onChange={handleChange}
              />

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
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;