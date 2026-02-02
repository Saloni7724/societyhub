import React from "react";
import "./css/Profile.css";
import {
  FaUser,
  FaClock,
  FaTools,
  FaPhone,
  FaCalendarAlt,
  FaBell,
  FaUsers,
  FaExclamationCircle,
  FaBuilding
} from "react-icons/fa";

const Profile = () => {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2><FaBuilding /> Society Name</h2>
        <ul>
          <li className="active"><FaUser /> My Profile</li>
          <li><FaClock /> Pending Amount</li>
          <li><FaTools /> Payment Maintenance</li>
          <li><FaPhone /> Emergency Contact</li>
          <li><FaCalendarAlt /> Events</li>
          <li><FaUsers /> Resident List</li>
          <li><FaBell /> Notification</li>
          <li><FaExclamationCircle /> Add Complain</li>
        </ul>
      </aside>

      {/* Main Section */}
      <main className="main">
        {/* Topbar */}
        <header className="topbar">
          <span><FaUser /> My Profile</span>
          <div className="top-icons">
            <FaBell />
            <FaUser />
          </div>
        </header>

        {/* Profile Card */}
        <div className="profile-card">
          <h3>Basic Details</h3>

          <div className="profile-content">
            <div className="details">
              <div className="box">Flat no : 101</div>
              <div className="box">
                <strong>Patel Mansi</strong><br />
                Contact : 9875046562
              </div>

              <div className="row">Profession : Job</div>
              <div className="row gender">Gender : Female</div>
            </div>

            <div className="photo">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="Profile"
              />
              <p>Profile Photo</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
