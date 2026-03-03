import React, { useState } from "react";
import "./css/ResidentList.css";

const ResidentList = () => {
  const residents = [
    {
      name: "Mansi Patel",
      email: "MansiPatel1708@gmail.com",
      flat: "A-101",
      contact: "9875046562",
      profession: "Job",
      type: "IT",
    },
    {
      name: "Saloni Patel",
      email: "SaloniPatel7720@gmail.com",
      flat: "A-102",
      contact: "9764257613",
      profession: "Job",
      type: "Account",
    },
    {
      name: "Vishwa Dave",
      email: "Vishwadave3120@gmail.com",
      flat: "A-103",
      contact: "8942387951",
      profession: "Business",
      type: "Finance",
    },
    {
      name: "Mahi Patel",
      email: "MahiPatel8765@gmail.com",
      flat: "A-104",
      contact: "8912476573",
      profession: "Job",
      type: "Education",
    },
    {
      name: "Kavya Patel",
      email: "KavyaPatel9220@gmail.com",
      flat: "A-105",
      contact: "9654231576",
      profession: "Business",
      type: "Marketing",
    },
    {
      name: "Dhruvi Patel",
      email: "DhruviPatel7654@gmail.com",
      flat: "A-106",
      contact: "9178151108",
      profession: "Job",
      type: "Developer",
    },
  ];

  /* ---------------- STATES ---------------- */

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const residentsPerPage = 4;

  // Search Resident Name
  const [searchName, setSearchName] = useState("");

  // Flat Filter
  const [selectedFlat, setSelectedFlat] = useState("All");

  // Profession Filter
  const [selectedProfession, setSelectedProfession] = useState("All");

  /* ---------------- DROPDOWN OPTIONS ---------------- */

  const flats = ["All", ...new Set(residents.map((r) => r.flat))];

  const professions = [
    "All",
    ...new Set(residents.map((r) => r.profession)),
  ];

  /* ---------------- FILTER LOGIC ---------------- */

  const filteredResidents = residents.filter((r) => {
    const matchName = r.name
      .toLowerCase()
      .includes(searchName.toLowerCase());

    const matchFlat =
      selectedFlat === "All" ? true : r.flat === selectedFlat;

    const matchProfession =
      selectedProfession === "All"
        ? true
        : r.profession === selectedProfession;

    return matchName && matchFlat && matchProfession;
  });

  /* ---------------- PAGINATION LOGIC ---------------- */

  const indexOfLast = currentPage * residentsPerPage;
  const indexOfFirst = indexOfLast - residentsPerPage;

  const currentResidents = filteredResidents.slice(
    indexOfFirst,
    indexOfLast
  );

  return (
    <div className="resident-container">
      {/* Title */}
      <h2 className="resident-title">Resident List</h2>

      {/* ✅ Filters Section */}
      <div className="filters">
        {/* Search */}
        <input
          type="text"
          placeholder="Search Resident Name..."
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setCurrentPage(1);
          }}
        />

        {/* Flat Filter */}
        <select
          value={selectedFlat}
          onChange={(e) => {
            setSelectedFlat(e.target.value);
            setCurrentPage(1);
          }}
        >
          {flats.map((flat, index) => (
            <option key={index} value={flat}>
              Flat: {flat}
            </option>
          ))}
        </select>

        {/* Profession Filter */}
        <select
          value={selectedProfession}
          onChange={(e) => {
            setSelectedProfession(e.target.value);
            setCurrentPage(1);
          }}
        >
          {professions.map((pro, index) => (
            <option key={index} value={pro}>
              Profession: {pro}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <table className="resident-table">
        <thead>
          <tr>
            <th>Resident Name</th>
            <th>Email</th>
            <th>Flat No.</th>
            <th>Contact</th>
            <th>Profession</th>
            <th>Type</th>
          </tr>
        </thead>

        <tbody>
          {currentResidents.length > 0 ? (
            currentResidents.map((res, index) => (
              <tr key={index}>
                <td>{res.name}</td>
                <td>{res.email}</td>
                <td>{res.flat}</td>
                <td>{res.contact}</td>
                <td>{res.profession}</td>
                <td>{res.type}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No Residents Found ❌
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        <button className="page-number active">{currentPage}</button>

        <button
          className="page-btn"
          disabled={indexOfLast >= filteredResidents.length}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ResidentList;
