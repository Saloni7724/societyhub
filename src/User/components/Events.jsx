import React, { useState } from "react";
import "./css/Events.css";

/* ✅ PDF Libraries */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [joinCount, setJoinCount] = useState(1);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  /* ✅ Member Info (You can change dynamically later) */
  const member = {
    name: "Patel Mansi",
    flat: "A-101",
  };

  /* Events Data */
  const events = [
    {
      id: 1,
      name: "Republic Day Celebration 🇮🇳",
      date: "26 Jan 2026",
      amountPerPerson: 300,
    },
    {
      id: 2,
      name: "Holi Celebration 🎨",
      date: "04 Mar 2026",
      amountPerPerson: 200,
    },
  ];

  /* ✅ Total Amount Auto Calculation */
  const totalAmount =
    selectedEvent ? joinCount * selectedEvent.amountPerPerson : 0;

  /* =============================== */
  /* ✅ Pay Now Function */
  /* =============================== */
  const handlePayment = () => {
    setPaymentSuccess(true);
  };

  /* =============================== */
  /* ✅ Receipt PDF Download */
  /* =============================== */
  const downloadReceipt = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Society Event Payment Receipt", 20, 20);

    doc.setFontSize(12);
    doc.text("Payment Successful ✅", 20, 35);

    /* ✅ Receipt Table with Member Details */
    autoTable(doc, {
      startY: 45,
      head: [["Field", "Details"]],
      body: [
        ["Member Name", member.name],
        ["Flat Number", member.flat],

        ["Event Name", selectedEvent.name],
        ["Event Date", selectedEvent.date],

        ["Joining Persons", joinCount],
        ["Amount Per Person", `₹ ${selectedEvent.amountPerPerson}`],

        ["Total Paid Amount", `₹ ${totalAmount}`],
        ["Payment Status", "PAID ✅"],
      ],
    });

    doc.text(
      "Thank you for your payment!",
      20,
      doc.lastAutoTable.finalY + 20
    );

    doc.save("Event_Receipt.pdf");
  };

  return (
    <div className="events-page">
      {/* Title */}
      <h2 className="events-title">✨ Society Events</h2>
      <p className="events-subtitle">
        Celebrate together and manage event payments easily.
      </p>

      {/* =============================== */}
      {/* Event Cards */}
      {/* =============================== */}
      <div className="events-grid">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            <h3>{event.name}</h3>

            <p>
              <strong>Date:</strong> {event.date}
            </p>

            {/* View Details Button */}
            <button
              className="details-btn"
              onClick={() => {
                setSelectedEvent(event);
                setJoinCount(1);
              }}
            >
              View Details →
            </button>
          </div>
        ))}
      </div>

      {/* =============================== */}
      {/* Event Payment Details Form */}
      {/* =============================== */}
      {selectedEvent && (
        <div className="details-overlay">
          <div className="details-page">
            {/* Header */}
            <div className="details-header">
              <h2>Event Payment Details</h2>

              <button
                className="close-btn"
                onClick={() => setSelectedEvent(null)}
              >
                ✖
              </button>
            </div>

            {/* Form */}
            <div className="details-form">
              {/* Member Info */}
              <label>Member Name</label>
              <input type="text" value={member.name} disabled />

              <label>Flat Number</label>
              <input type="text" value={member.flat} disabled />

              {/* Event Info */}
              <label>Event Title</label>
              <input type="text" value={selectedEvent.name} disabled />

              <label>Event Date</label>
              <input type="text" value={selectedEvent.date} disabled />

              {/* Dropdown Persons */}
              <label>Total Joining Persons</label>
              <select
                value={joinCount}
                onChange={(e) => setJoinCount(Number(e.target.value))}
              >
                <option value="1">1 Person</option>
                <option value="2">2 Persons</option>
                <option value="3">3 Persons</option>
                <option value="4">4 Persons</option>
                <option value="5">5 Persons</option>
              </select>

              {/* Total Amount */}
              <label>Total Amount</label>
              <input type="text" value={`₹ ${totalAmount}`} disabled />

              {/* Pay Button */}
              <button className="pay-btn" onClick={handlePayment}>
                Pay Now ₹ {totalAmount}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =============================== */}
      {/* Payment Success Popup */}
      {/* =============================== */}
      {paymentSuccess && (
        <div className="success-overlay">
          <div className="success-box">
            <h2>✅ Payment Successful!</h2>

            <p>
              Thank you <b>{member.name}</b> (Flat: {member.flat})
            </p>

            <p>
              Paid Amount: <b>₹ {totalAmount}</b>
            </p>

            {/* Receipt Download */}
            <button className="receipt-btn" onClick={downloadReceipt}>
              📄 Download Receipt PDF
            </button>

            {/* Done Button */}
            <button
              className="done-btn"
              onClick={() => {
                setPaymentSuccess(false);
                setSelectedEvent(null);
              }}
            >
              Done ✔
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
