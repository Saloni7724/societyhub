import React, { useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import "../css/AddEvents.css";
import { FiX, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";

const AddEvents = () => {
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  /* 🔴 DELETE MODAL */
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  /* 🔹 DEMO EVENTS */
  const [events, setEvents] = useState([
    {
      title: "Annual Day Celebration",
      date: "2026-03-15",
      status: "Upcoming",
      groups: ["All Members", "Tower A"],
      amount: "100",
    },
    {
      title: "Cleaning Drive",
      date: "2026-02-10",
      status: "Ongoing",
      groups: ["Tower B"],
      amount: "50",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    status: "Upcoming",
    groups: ["All Members"],
    groupInput: "",
    amount: "100",
  });

  /* 🔍 SEARCH + FILTER */
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

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
  const openEdit = (event, index) => {
    setIsEdit(true);
    setEditIndex(index);
    setFormData({ ...event, groupInput: "" });
    setShowForm(true);
  };

  /* SAVE */
  const handleSave = () => {
    if (!formData.title || !formData.date) {
      alert("Please fill required fields");
      return;
    }

    if (isEdit) {
      const updated = [...events];
      updated[editIndex] = formData;
      setEvents(updated);
    } else {
      setEvents([...events, formData]);
    }

    setShowForm(false);
  };

  /* DELETE */
  const confirmDelete = () => {
    setEvents(events.filter((_, i) => i !== deleteIndex));
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
            {filteredEvents.map((event, index) => (
              < div className="event-card" key={index}>
               <div className="event-top">
  <h4>{event.title}</h4>
  <span
    className={`status ${
      event.status === "Ongoing" ? "ongoing" : "upcoming"
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
                {/* ACTIONS AT BOTTOM */}
<div className="event-footer">
  <button
    className="event-edit-btn"
    onClick={() => openEdit(event, index)}
  >
    <FiEdit2 />
    Edit
  </button>

  <FiTrash2
    className="event-delete-icon"
    onClick={() => {
      setDeleteIndex(index);
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
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Event Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
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
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
              </div>

              <button className="submit-btn" onClick={handleSave}>
                {isEdit ? "Update Event" : "Add Event"}
              </button>
            </div>
          </div>
        )}

        {/* DELETE CONFIRM MODAL */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="event-modal">
              <h3>Delete Event?</h3>
              <p style={{ marginTop: 10 }}>
                This action cannot be undone.
              </p>

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
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
