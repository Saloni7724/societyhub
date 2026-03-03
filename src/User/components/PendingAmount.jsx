import React, { useState } from "react";
import "./css/PendingAmount.css";

const PendingAmount = () => {
  // ✅ Store Paid Status
  const [paidFund, setPaidFund] = useState(null);

  // ✅ Pay Button Function
  const handlePayNow = (fundName, amount) => {
    alert(`Payment Successful ✅\nFund: ${fundName}\nAmount: ₹${amount}`);

    // Mark as Paid
    setPaidFund(fundName);
  };

  return (
    <div className="pending-container">
      <h2 className="pending-title">Pending Amount Details</h2>

      <div className="pending-grid">
        
        {/* Card 1 */}
        <div className="pending-card">
          <p>Resident Name : <span>Rahul Sharma</span></p>
          <p>Flat No : <span>A-101</span></p>
          <p>
            Pending For :{" "}
            <span className="pending-type">Holi Celebration Fund 🎉</span>
          </p>
          <p>
            Amount Due : <span className="amount">₹ 500</span>
          </p>

          {/* ✅ Button */}
          <button
            className="pay-btn"
            onClick={() => handlePayNow("Holi Celebration Fund", 500)}
            disabled={paidFund === "Holi Celebration Fund"}
          >
            {paidFund === "Holi Celebration Fund" ? "Paid ✅" : "Pay Now"}
          </button>
        </div>

        {/* Card 2 */}
        <div className="pending-card">
          <p>Resident Name : <span>Priya Patel</span></p>
          <p>Flat No : <span>B-205</span></p>
          <p>
            Pending For :{" "}
            <span className="pending-type">Monthly Maintenance 🏠</span>
          </p>
          <p>
            Amount Due : <span className="amount">₹ 3000</span>
          </p>

          <button
            className="pay-btn"
            onClick={() => handlePayNow("Monthly Maintenance", 3000)}
            disabled={paidFund === "Monthly Maintenance"}
          >
            {paidFund === "Monthly Maintenance" ? "Paid ✅" : "Pay Now"}
          </button>
        </div>

        {/* Card 3 */}
        <div className="pending-card">
          <p>Resident Name : <span>Amit Verma</span></p>
          <p>Flat No : <span>C-302</span></p>
          <p>
            Pending For :{" "}
            <span className="pending-type">Parking Charges 🚗</span>
          </p>
          <p>
            Amount Due : <span className="amount">₹ 1500</span>
          </p>

          <button
            className="pay-btn"
            onClick={() => handlePayNow("Parking Charges", 1500)}
            disabled={paidFund === "Parking Charges"}
          >
            {paidFund === "Parking Charges" ? "Paid ✅" : "Pay Now"}
          </button>
        </div>

        {/* Card 4 */}
        <div className="pending-card">
          <p>Resident Name : <span>Neha Singh</span></p>
          <p>Flat No : <span>D-110</span></p>
          <p>
            Pending For :{" "}
            <span className="pending-type">Ganesh Festival Donation 🙏</span>
          </p>
          <p>
            Amount Due : <span className="amount">₹ 2000</span>
          </p>

          <button
            className="pay-btn"
            onClick={() => handlePayNow("Ganesh Festival Donation", 2000)}
            disabled={paidFund === "Ganesh Festival Donation"}
          >
            {paidFund === "Ganesh Festival Donation" ? "Paid ✅" : "Pay Now"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PendingAmount;
