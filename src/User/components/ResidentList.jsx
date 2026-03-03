import React, { useState } from "react";
import "./css/ResidentList.css";

const ResidentList = () => {
  const residentsData = [
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
      name: "Ravi Shah",
      email: "ravishah@gmail.com",
      flat: "B-201",
      contact: "9876543210",
      profession: "Business",
      type: "Marketing",
    },
  ];

  const [search, setSearch] = useState("");
  const [flatFilter, setFlatFilter] = useState("All");
  const [professionFilter, setProfessionFilter] = useState("All");

  /* Pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const residentsPerPage = 4;

  /* Unique Flats */
  const flats = ["All", ...new Set(residentsData.map((r) => r.flat))];

  /* Unique Professions */
  const professions = [
    "All",
    ...new Set(residentsData.map((r) => r.profession)),
  ];

  /* Filter Logic */
  const filteredResidents = residentsData.filter((r) => {
    return (
      r.name.toLowerCase().includes(search.toLowerCase()) &&
      (flatFilter === "All" || r.flat === flatFilter) &&
      (professionFilter === "All" || r.profession === professionFilter)
    );
  });

  /* Pagination Logic */
  const indexOfLast = currentPage * residentsPerPage;
  const indexOfFirst = indexOfLast - residentsPerPage;
  const currentResidents = filteredResidents.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredResidents.length / residentsPerPage);

  return (
    <div className="resident-container">
      {/* Title */}
      <h2 className="resident-title">Resident List</h2>

      {/* Search + Filters */}
      <div className="resident-filters">
        <input
          type="text"
          placeholder="Search Resident Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={flatFilter}
          onChange={(e) => setFlatFilter(e.target.value)}
        >
          {flats.map((flat, index) => (
            <option key={index} value={flat}>
              Flat: {flat}
            </option>
          ))}
        </select>

        <select
          value={professionFilter}
          onChange={(e) => setProfessionFilter(e.target.value)}
        >
          {professions.map((pro, index) => (
            <option key={index} value={pro}>
              Profession: {pro}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="resident-table-box">
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
              currentResidents.map((r, index) => (
                <tr key={index}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.flat}</td>
                  <td>{r.contact}</td>

                  <td>
                    <span className="profession-badge">{r.profession}</span>
                  </td>

                  <td>
                    <span className="type-badge">{r.type}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: "20px", color: "red" }}>
                  No Residents Found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          className="prev-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        <div className="page-number">{currentPage}</div>

        <button
          className="next-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ResidentList;
