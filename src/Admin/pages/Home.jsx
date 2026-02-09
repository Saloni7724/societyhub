import React from 'react';
import { Link } from "react-router-dom";
import '../css/Home.css';
import bgImage from '../photos/bg.jpg';

// Import icons
import { FaUserShield, FaUser, FaHome } from 'react-icons/fa';

const Home = () => {
  return (
    <div
      className="home-container"
      style={{ '--bg-image': `url(${bgImage})` }}
    >
      <div className="transparent-panel">
        <h2 className="title">Please Select an Option</h2>

        <div className="card-wrapper">
          {/* Admin Card */}
          <div className="card admin">
            <FaUserShield className="card-logo" />
            <h3>Login as Admin</h3>
            <Link to="/Login">
              <button className="btn admin-btn">Login as Admin</button>
            </Link>
          </div>

          {/* User Card */}
          <div className="card user">
            <FaUser className="card-logo" />
            <h3>Login as User</h3>
            <Link to="/LoginUser">
              <button className="btn user-btn">Login as User</button>
            </Link>
          </div>

          {/* Residency Card */}
          <div className="card residency">
            <FaHome className="card-logo" />
            <h3>Add Residency</h3>
            <Link to="/AddSociety">
              <button className="btn residency-btn">Add Residency</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
