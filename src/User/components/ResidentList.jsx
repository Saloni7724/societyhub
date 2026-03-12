import React, { useState, useEffect } from "react";
import "./css/ResidentList.css";

/* Firebase */
import { db } from "../Backend/firebase-init";
import { collection, onSnapshot } from "firebase/firestore";

const ResidentList = () => {

  const societyId = localStorage.getItem("societyId");

  const [residentsData, setResidentsData] = useState([]);
  const [search, setSearch] = useState("");
  const [flatFilter, setFlatFilter] = useState("All");
  const [professionFilter, setProfessionFilter] = useState("All");
  const [blockFilter, setBlockFilter] = useState("All");

  /* Pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const residentsPerPage = 4;

  /* ================= FETCH DATA ================= */

  useEffect(() => {

    if (!societyId) return;

    const membersRef = collection(
      db,
      "societies",
      societyId,
      "members"
    );

    const unsub = onSnapshot(membersRef, (snapshot) => {

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setResidentsData(list);

    });

    return () => unsub();

  }, [societyId]);

  /* ================= UNIQUE FILTERS ================= */

  const flats = ["All", ...new Set(residentsData.map((r) => r.flat))];

  const professions = [
    "All",
    ...new Set(residentsData.map((r) => r.profession)),
  ];

  const blocks = [
    "All",
    ...new Set(residentsData.map((r) => r.block)),
  ];

  /* ================= FILTER LOGIC ================= */

  const filteredResidents = residentsData.filter((r) => {

    return (
      r.name?.toLowerCase().includes(search.toLowerCase()) &&
      (flatFilter === "All" || r.flat === flatFilter) &&
      (professionFilter === "All" || r.profession === professionFilter) &&
      (blockFilter === "All" || r.block === blockFilter)
    );

  });

  /* ================= PAGINATION ================= */

  const indexOfLast = currentPage * residentsPerPage;
  const indexOfFirst = indexOfLast - residentsPerPage;

  const currentResidents = filteredResidents.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(
    filteredResidents.length / residentsPerPage
  );

  return (
    <div className="resident-container">

      <h2 className="resident-title">Resident List</h2>

      {/* SEARCH + FILTER */}
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
          onChange={(e) =>
            setProfessionFilter(e.target.value)
          }
        >
          {professions.map((pro, index) => (
            <option key={index} value={pro}>
              Profession: {pro}
            </option>
          ))}
        </select>

        {/* BLOCK FILTER */}
        <select
          value={blockFilter}
          onChange={(e) =>
            setBlockFilter(e.target.value)
          }
        >
          {blocks.map((b, index) => (
            <option key={index} value={b}>
              Block: {b}
            </option>
          ))}
        </select>

      </div>

      {/* TABLE */}
      <div className="resident-table-box">
        <table className="resident-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Flat</th>
              <th>Block</th>
              <th>Phone</th>
              <th>Profession</th>
              <th>Type</th>
            </tr>
          </thead>

          <tbody>

            {currentResidents.length > 0 ? (

              currentResidents.map((r) => (

                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.flat}</td>
                  <td>{r.block}</td>
                  <td>{r.phone}</td>

                  <td>
                    <span className="profession-badge">
                      {r.profession}
                    </span>
                  </td>

                  <td>
                    <span className="type-badge">
                      {r.type}
                    </span>
                  </td>
                </tr>

              ))

            ) : (

              <tr>
                <td colSpan="7" style={{ padding: "20px", color: "red" }}>
                  No Residents Found
                </td>
              </tr>

            )}

          </tbody>

        </table>
      </div>

      {/* PAGINATION */}
      <div className="pagination">

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        <div className="page-number">
          {currentPage}
        </div>

        <button
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