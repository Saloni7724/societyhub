import React from "react";
import "./css/PaymentMaintenance.css";
import { FaDownload } from "react-icons/fa";

const PaymentMaintenance = () => {
  const payments = [
    {
      date: "5-12-2025",
      rid: "R001",
      name: "Mansi Patel",
      amount: 2500,
      penalty: 150,
      total: 2650,
    },
    {
      date: "12-12-2025",
      rid: "R002",
      name: "Saloni Patel",
      amount: 2500,
      penalty: 200,
      total: 2700,
    },
    {
      date: "7-01-2026",
      rid: "R003",
      name: "Vishwa Dave",
      amount: 2500,
      penalty: 100,
      total: 2600,
    },
    {
      date: "03-01-2026",
      rid: "R004",
      name: "Kavya Patel",
      amount: 2500,
      penalty: 300,
      total: 2800,
    },
  ];

  return (
    <div className="payment-container">
      {/* Title */}
      <h2 className="payment-title">Payment Maintenance</h2>

      {/* Table */}
      <table className="payment-table">
        <thead>
          <tr>
            <th>Pay Date</th>
            <th>R-Id</th>
            <th>Resident Name</th>
            <th>Amount</th>
            <th>Penalty</th>
            <th>Total Amount</th>
            <th>Download payment slips</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((pay, index) => (
            <tr key={index}>
              <td>{pay.date}</td>
              <td>{pay.rid}</td>
              <td>{pay.name}</td>
              <td>₹ {pay.amount}</td>
              <td>₹ {pay.penalty}</td>
              <td>₹ {pay.total}</td>
              <td>
                <button className="download-btn">
                  Download <FaDownload className="download-icon" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentMaintenance;
