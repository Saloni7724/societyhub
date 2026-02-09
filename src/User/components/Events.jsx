import React, { useState } from "react";
import "./css/Events.css";

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    {
      id: 1,
      name: "Republic Day Celebration 🇮🇳",
      date: "26 Jan 2026",
      persons: 120,
      amount: 300,
    },
    {
      id: 2,
      name: "Holi Celebration 🎨",
      date: "04 Mar 2026",
      persons: 200,
      amount: 200,
    },
  ];

  return (
    <div className="events-page">
      {/* Title */}
      <h2 className="events-title">✨ Society Events</h2>
      <p className="events-subtitle">
        Celebrate together and manage event payments easily.
      </p>

      {/* Cards */}
      <div className="events-grid">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            <h3>{event.name}</h3>

            <p>
              <strong>Date:</strong> {event.date}
            </p>

            <p>
              <strong>Joining:</strong> {event.persons} Members
            </p>

            <p className="amount">
              ₹ {event.amount} Contribution
            </p>

            <button
              className="details-btn"
              onClick={() => setSelectedEvent(event)}
            >
              View Details →
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2>{selectedEvent.name}</h2>

              <button
                className="close-btn"
                onClick={() => setSelectedEvent(null)}
              >
                ✖
              </button>
            </div>

            <div className="modal-body">
              <p>
                <strong>Date:</strong> {selectedEvent.date}
              </p>
              <p>
                <strong>Total Joining:</strong> {selectedEvent.persons}
              </p>
              <p>
                <strong>Amount:</strong> ₹ {selectedEvent.amount}
              </p>

              <button className="pay-btn">
                Pay Now ₹ {selectedEvent.amount}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
