import React from "react";
import "./css/ResidentList.css";
import {
  FaUser,
  FaClock,
  FaTools,
  FaPhone,
  FaCalendarAlt,
  FaUsers,
  FaBell,
  FaExclamationCircle,
  FaBuilding
} from "react-icons/fa";

const ResidentList = () => {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">
          <FaBuilding /> Society Name
        </h2>

        <ul className="menu">
          <li><FaUser /> My Profile</li>
          <li><FaClock /> Pending Amount</li>
          <li><FaTools /> Payment Maintenance</li>
          <li><FaPhone /> Emergency Contact</li>
          <li><FaCalendarAlt /> Events</li>
          <li className="active"><FaUsers /> Resident List</li>
          <li><FaBell /> Notification</li>
          <li><FaExclamationCircle /> Add Complain</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h3><FaUsers /> Resident List</h3>

        <table className="resident-table">
          <thead>
            <tr>
              <th>Resident Name</th>
              <th>Email Id</th>
              <th>Flat no.</th>
              <th>Contact No.</th>
              <th>Profession</th>
              <th>Type of Profession</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Mansi Patel</td>
              <td>MansiPatel1708@gmail.com</td>
              <td>A-101</td>
              <td>9875046562</td>
              <td>Job</td>
              <td>IT</td>
            </tr>

            <tr>
              <td>Saloni Patel</td>
              <td>SaloniPatel7720@gmail.com</td>
              <td>A-102</td>
              <td>9764257613</td>
              <td>Job</td>
              <td>Account</td>
            </tr>

            <tr>
              <td>Vishwa Dave</td>
              <td>Vishwadave3120@gmail.com</td>
              <td>A-103</td>
              <td>8942387951</td>
              <td>Business</td>
              <td>Finance</td>
            </tr>

            <tr>
              <td>Mahi Patel</td>
              <td>MahiPatel8765@gmail.com</td>
              <td>A-104</td>
              <td>8912476573</td>
              <td>Job</td>
              <td>Education</td>
            </tr>

            <tr>
              <td>Kavya Patel</td>
              <td>KavyaPatel9220@gmail.com</td>
              <td>A-105</td>
              <td>9654231576</td>
              <td>Business</td>
              <td>Marketing</td>
            </tr>

            <tr>
              <td>Dhruvi Patel</td>
              <td>DhruviPatel7654@gmail.com</td>
              <td>A-106</td>
              <td>9178151108</td>
              <td>Job</td>
              <td>Developer</td>
            </tr>
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <button>Previous</button>
          <button className="active">1</button>
          <button>Next</button>
        </div>
      </div>
    </div>
  );
};

export default ResidentList;
