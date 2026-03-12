import React, { useState, useEffect } from "react";
import "./css/Events.css";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "../Backend/firebase-init";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [joinCount, setJoinCount] = useState(1);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const societyId = localStorage.getItem("societyId");

  const member = {
    name: localStorage.getItem("memberName"),
    flat: localStorage.getItem("flatNumber"),
    type: localStorage.getItem("memberType"),
  };

  /* =============================== */
  /* FETCH EVENTS */
  /* =============================== */
  useEffect(() => {
    if (!societyId) return;

    const unsubscribe = onSnapshot(
      collection(db, "societies", societyId, "events"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEvents(list);
      }
    );

    return () => unsubscribe();
  }, [societyId]);

  /* =============================== */
  /* DATE CHECK */
  /* =============================== */
  const isExpired = (eventDate) => {
    const today = new Date();
    const evDate = new Date(eventDate);

    today.setHours(0,0,0,0);
    evDate.setHours(0,0,0,0);

    return evDate < today;
  };

  /* =============================== */
  /* AUTO TOTAL */
  /* =============================== */
  const totalAmount =
    selectedEvent ? joinCount * selectedEvent.amount : 0;

  /* =============================== */
  /* PAYMENT */
  /* =============================== */
  const handlePayment = async () => {

    if (isExpired(selectedEvent.date)) {
      alert("❌ Payment not accepted. Event date expired.");
      return;
    }

    try {
      await addDoc(
        collection(db, "societies", societyId, "eventPayments"),
        {
          memberName: member.name,
          flatNumber: member.flat,
          eventId: selectedEvent.id,
          eventTitle: selectedEvent.title,
          eventDate: selectedEvent.date,
          persons: joinCount,
          amountPerPerson: selectedEvent.amount,
          totalPaid: totalAmount,
          paymentStatus: "PAID",
          createdAt: new Date(),
        }
      );

      setPaymentSuccess(true);

    } catch (error) {
      console.log(error);
      alert("Payment Failed");
    }
  };

  /* =============================== */
  /* PDF RECEIPT */
  /* =============================== */
  const downloadReceipt = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Society Event Payment Receipt", 20, 20);

    autoTable(doc, {
      startY: 40,
      head: [["Field", "Details"]],
      body: [
        ["Member Name", member.name],
        ["Flat Number", member.flat],
        ["Event Name", selectedEvent.title],
        ["Event Date", selectedEvent.date],
        ["Joining Persons", joinCount],
        ["Amount Per Person", `₹ ${selectedEvent.amount}`],
        ["Total Paid", `₹ ${totalAmount}`],
        ["Status", "PAID"],
      ],
    });

    doc.save("Event_Receipt.pdf");
  };

  return (
    <div className="events-page">
      <h2 className="events-title">✨ Society Events</h2>

      {/* =============================== */}
      {/* EVENT BOX */}
      {/* =============================== */}
      <div className="events-grid1">
        {events.map((event) => {

          const expired = isExpired(event.date);

          return (
            <div className="event-card" key={event.id}>
              <h3>{event.title}</h3>

              <p><strong>Date:</strong> {event.date}</p>

              {expired && (
                <p style={{color:"red", fontWeight:"bold"}}>
                  Event Expired
                </p>
              )}

              <button
                className="details-btn"
                disabled={expired}
                onClick={() => {
                  setSelectedEvent(event);
                  setJoinCount(1);
                }}
              >
                {expired ? "Expired" : "View Details →"}
              </button>

            </div>
          );
        })}
      </div>

      {/* =============================== */}
      {/* DETAILS FORM */}
      {/* =============================== */}
      {selectedEvent && (
        <div className="details-overlay">
          <div className="details-page">

            <h2>Event Payment Details</h2>

            <button
              className="close-btn"
              onClick={() => setSelectedEvent(null)}
            >
              ✖
            </button>

            {isExpired(selectedEvent.date) ? (

              <div style={{textAlign:"center"}}>
                <h3 style={{color:"red"}}>
                  ❌ Event Date Expired
                </h3>

                <p>Payment Not Accepted</p>

              </div>

            ) : (

              <div className="details-form">

                <label>Member Name</label>
                <input value={member.name} disabled />

                <label>Flat Number</label>
                <input value={member.flat} disabled />

                <label>Event Title</label>
                <input value={selectedEvent.title} disabled />

                <label>Event Date</label>
                <input value={selectedEvent.date} disabled />

                <label>Total Joining Persons</label>

                <select
                  value={joinCount}
                  onChange={(e) =>
                    setJoinCount(Number(e.target.value))
                  }
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 Persons</option>
                  <option value="3">3 Persons</option>
                  <option value="4">4 Persons</option>
                  <option value="5">5 Persons</option>
                </select>

                <label>Total Amount</label>
                <input value={`₹ ${totalAmount}`} disabled />

                <button
                  className="pay-btn"
                  onClick={handlePayment}
                >
                  Pay Now ₹ {totalAmount}
                </button>

              </div>

            )}

          </div>
        </div>
      )}

      {/* =============================== */}
      {/* SUCCESS POPUP */}
      {/* =============================== */}
      {paymentSuccess && (
        <div className="success-overlay">

          <div className="success-box">

            <h2>✅ Payment Successful!</h2>

            <p>
              Thank you <b>{member.name}</b>
            </p>

            <p>
              Paid: <b>₹ {totalAmount}</b>
            </p>

            <button
              className="receipt-btn"
              onClick={downloadReceipt}
            >
              Download Receipt
            </button>

            <button
              className="done-btn"
              onClick={() => {
                setPaymentSuccess(false);
                setSelectedEvent(null);
              }}
            >
              Done
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default Events;