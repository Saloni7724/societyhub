import React, { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import "../css/AddEvents.css";
import { FiX, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";

import { db } from "../Backend/firebase-init";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const AddEvents = () => {
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});

  /* DELETE MODAL */
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  /* EVENTS */
  const [events, setEvents] = useState([]);

  /* FORM DATA */
  const [formData, setFormData] = useState({
  title: "",
  date: "",
  status: "Upcoming",
  amount: "100",
  targetType: "All",
});
  /* SEARCH + FILTER */
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  /* FETCH EVENTS */
 const [societyId, setSocietyId] = useState(localStorage.getItem("societyId"));

useEffect(() => {
  if (!societyId) return; // safety check
  const fetchEvents = async () => {
    const snapshot = await getDocs(collection(db, "societies", societyId, "events"));
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEvents(list);
  };
  fetchEvents();
}, [societyId]);
const fetchEvents = async () => {
  if (!societyId) return; // safety check

  const snapshot = await getDocs(collection(db, "societies", societyId, "events"));
  const list = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  setEvents(list);
};
  /* ADD */
  const openAdd = () => {
    setIsEdit(false);
    setFormData({
      title: "",
      date: "",
      status: "Upcoming",
      amount: "100",
       targetType: "All", // ✅ ADD THIS
    });
    setShowForm(true);
  };

  /* EDIT */
  const openEdit = (event) => {
    setIsEdit(true);
    setEditIndex(event.id);
    setFormData({ ...event, groupInput: "" });
    setShowForm(true);
  };

  const validateForm = () => {
  let newErrors = {};

  if (!formData.title.trim()) {
    newErrors.title = "Event title is required";
  }

  if (!formData.date) {
    newErrors.date = "Event date is required";
  } else {
    const today = new Date().toISOString().split("T")[0];
    if (formData.date < today) {
      newErrors.date = "Past dates are not allowed";
    }
  }

  if (!formData.amount || formData.amount <= 0) {
    newErrors.amount = "Amount must be greater than 0";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
  /* SAVE (ADD OR UPDATE) */
 const handleSave = async () => {
  try {
    if (!formData.title.trim() || !formData.date || formData.amount <= 0) {
      alert("Please fill valid event details");
      return;
    }

    if (isEdit) {
      // ✅ UPDATE EXISTING EVENT
      const eventDocRef = doc(
        db,
        "societies",
        societyId,
        "events",
        editIndex
      );

      await updateDoc(eventDocRef, {
        title: formData.title,
        date: formData.date,
        status: formData.status,
        amount: formData.amount,
        targetType: formData.targetType,
        updatedAt: new Date(),
      });

    } else {
      // ✅ ADD NEW EVENT
      await addDoc(
        collection(db, "societies", societyId, "events"),
        {
          title: formData.title,
          date: formData.date,
          status: formData.status,
          amount: formData.amount,
          targetType: formData.targetType,
          createdAt: new Date(),
        }
      );
    }

    fetchEvents();
    setShowForm(false);
    setIsEdit(false);
    setEditIndex(null);

  } catch (err) {
    console.error(err);
    alert("Error saving event: " + err.message);
  }
};


  /* DELETE */
  const confirmDelete = async () => {
   await deleteDoc(
  doc(db, "societies", societyId, "events", deleteIndex)
);
    fetchEvents();
    setShowDeleteModal(false);
  };


  /* FILTER */
  const filteredEvents = events.filter((e) => {
    const matchSearch = e.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchFilter =
      filter === "All" || e.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <AdminLayout active="events">
      <div className="events-page">
        <section className="mm-content">
          <div className="events-header">
            {/* LEFT SIDE */}
            <div className="header-left">
              <select
                className="filter-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
              </select>

              <button className="add-event" onClick={openAdd}>
                + Add Event
              </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="mm-search-box">
              <FiSearch />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* CARDS */}
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <div className="event-card" key={event.id}>
                <div className="event-top">
                  <h4>{event.title}</h4>
                  <span
                    className={`status ${
                      event.status === "Ongoing"
                        ? "ongoing"
                        : "upcoming"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>

                <p className="date">📅 {event.date}</p>

               

                <div className="event-footer">
                  <button
                    className="event-edit-btn"
                    onClick={() => openEdit(event)}
                  >
                    <FiEdit2 />
                    Edit
                  </button>

                  <FiTrash2
                    className="event-delete-icon"
                    onClick={() => {
                      setDeleteIndex(event.id);
                      setShowDeleteModal(true);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ADD / EDIT MODAL */}
        {showForm && (
          <div className="modal-overlay">
            <div className="event-modal">
              <div className="modal-header">
                <h3>{isEdit ? "Edit Event" : "Add Event"}</h3>
                <FiX onClick={() => setShowForm(false)} />
              </div>

              <div className="form-group2">
                <label>Event Title</label>
                <input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                />
                 {errors.title && <span className="error">{errors.title}</span>}
              </div>
                    <div className="form-group2">
  <label>Event Date</label>
  <input
    type="date"
    min={new Date().toISOString().split("T")[0]}
    value={formData.date}
    onChange={(e) =>
      setFormData({
        ...formData,
        date: e.target.value,
      })
    }
  />
  {errors.date && (
    <span className="error">{errors.date}</span>
  )}
</div>
      
             {errors.date && <span className="error">{errors.date}</span>}

            

              <div className="form-group2">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value,
                    })
                  }
                >
                  <option>Upcoming</option>
                  <option>Ongoing</option>
                </select>
                
              </div>
                    <div className="form-group2">
  <label>Send Event To</label>
  <select
    value={formData.targetType}
    onChange={(e) =>
      setFormData({
        ...formData,
        targetType: e.target.value,
      })
    }
  >
    <option value="All">All Members</option>
    <option value="Permanent">Permanent House</option>
    <option value="Rent">Rent House</option>
    <option value="Block-A">Block A</option>
    <option value="Block-B">Block B</option>
    <option value="Block-C">Block C</option>
  </select>
</div>
              

              <div className="form-group2">
                <label>Amount Per Person (₹)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: e.target.value,
                    })
                  }
                />
                  {errors.amount && <span className="error">{errors.amount}</span>}
              </div>

             <button className="submit-btn2" onClick={handleSave}>
  {isEdit ? "Update Event" : "Add Event"}
</button>
            </div>
          </div>
        )}

        {/* DELETE MODAL */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="event-modal">
              <h3>Delete Event?</h3>
              <p style={{ marginTop: 10 }}>
                This action cannot be undone.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 20,
                }}
              >
                <button
                  className="edit"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="submit-btn"
                  style={{ background: "#dc2626" }}
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AddEvents;
