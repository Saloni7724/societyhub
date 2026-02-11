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
    groups: ["All Members"],
    groupInput: "",
    amount: "100",
  });

  /* SEARCH + FILTER */
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  /* FETCH EVENTS */
  const fetchEvents = async () => {
    const snapshot = await getDocs(collection(db, "events"));
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEvents(list);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  /* ADD */
  const openAdd = () => {
    setIsEdit(false);
    setFormData({
      title: "",
      date: "",
      status: "Upcoming",
      groups: ["All Members"],
      groupInput: "",
      amount: "100",
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

  /* SAVE (ADD OR UPDATE) */
  const handleSave = async () => {
    if (!formData.title || !formData.date) {
      alert("Please fill required fields");
      return;
    }

    try {
      if (isEdit) {
        const eventRef = doc(db, "events", editIndex);
        await updateDoc(eventRef, {
          title: formData.title,
          date: formData.date,
          status: formData.status,
          groups: formData.groups,
          amount: formData.amount,
        });
      } else {
        await addDoc(collection(db, "events"), {
          title: formData.title,
          date: formData.date,
          status: formData.status,
          groups: formData.groups,
          amount: formData.amount,
        });
      }

      fetchEvents();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Error saving event");
    }
  };

  /* DELETE */
  const confirmDelete = async () => {
    await deleteDoc(doc(db, "events", deleteIndex));
    fetchEvents();
    setShowDeleteModal(false);
  };

  /* GROUP */
  const addGroup = () => {
    if (
      formData.groupInput &&
      !formData.groups.includes(formData.groupInput)
    ) {
      setFormData({
        ...formData,
        groups: [...formData.groups, formData.groupInput],
        groupInput: "",
      });
    }
  };

  const removeGroup = (g) => {
    setFormData({
      ...formData,
      groups: formData.groups.filter((x) => x !== g),
    });
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

              <button className="add-btn" onClick={openAdd}>
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

                <div className="groups">
                  {event.groups.map((g, i) => (
                    <span key={i}>{g}</span>
                  ))}
                </div>

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

              <div className="form-group">
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
              </div>

              <div className="form-group">
                <label>Event Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
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

              <div className="form-group">
                <label>Custom Group</label>
                <div className="group-input">
                  <input
                    value={formData.groupInput}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        groupInput: e.target.value,
                      })
                    }
                  />
                  <button onClick={addGroup}>Add</button>
                </div>
              </div>

              <div className="group-tags">
                {formData.groups.map((g, i) => (
                  <span key={i} onClick={() => removeGroup(g)}>
                    {g} ✕
                  </span>
                ))}
              </div>

              <div className="form-group">
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
              </div>

              <button className="submit-btn" onClick={handleSave}>
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
