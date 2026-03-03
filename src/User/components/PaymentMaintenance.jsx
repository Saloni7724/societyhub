import React, { useState } from "react";
import "./css/PaymentMaintenance.css";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PaymentMaintenance = () => {
  const payments = [
    {
      date: "05-12-2025",
      Month: "December",
      amount: 2500,
      penalty: 150,
      total: 2650,
    },
    {
      date: "12-12-2025",
      Month: "January",
      amount: 2500,
      penalty: 200,
      total: 2700,
    },
    {
      date: "20-12-2025",
      Month: "February",
      amount: 2500,
      penalty: 0,
      total: 2600,
    },
  ];

  /* ✅ Indian Currency Format Function */
  const formatINR = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);
  };

  /* ✅ Month Filter State */
  const [selectedMonth, setSelectedMonth] = useState("All");

  /* ✅ Search State */
  const [searchText, setSearchText] = useState("");

  /* ✅ Filter Payments */
  const filteredPayments = payments.filter((pay) => {
    const matchMonth =
      selectedMonth === "All" || pay.Month === selectedMonth;

    const matchSearch =
      pay.Month.toLowerCase().includes(searchText.toLowerCase());

    return matchMonth && matchSearch;
  });

  /* ✅ Download Slip PDF */
  const downloadSlip = (pay) => {
  const doc = new jsPDF();
  doc.setFont("helvetica"); 
  doc.setFontSize(16);
  doc.text("Payment Receipt", 70, 20);

  autoTable(doc, {
    startY: 40,
    head: [["Paid Date", "Month", "Amount", "Penalty", "Total"]],
    body: [
      [
        pay.date,
        pay.Month,
        `Rs. ${pay.amount}`,
        `Rs. ${pay.penalty}`,
        `Rs. ${pay.total}`,
      ],
    ],
  });

  doc.save(`PaymentSlip_${pay.Month}.pdf`);
};

  return (
    <div className="payment-page">
      <h2 className="payment-heading">
        Payment Maintenance
        <div className="heading-line"></div>
      </h2>

      <div className="payment-filters">
        <input
          type="text"
          placeholder="Search Month..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="All">Month: All</option>
          <option value="December">December</option>
          <option value="January">January</option>
          <option value="February">February</option>
        </select>
      </div>

      <div className="payment-table-box">
        <table className="payment-table">
          <thead>
            {/* ✅ FIXED HERE (removed extra 'a') */}
            <tr>
              <th>PAID DATE</th>
              <th>MONTH</th>
              <th>AMOUNT</th>
              <th>PENALTY</th>
              <th>TOTAL</th>
              <th>DOWNLOAD</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((pay, index) => (
                <tr key={index}>
                  <td>{pay.date}</td>
                  <td className="month">{pay.Month}</td>
                  <td className="amount">{formatINR(pay.amount)}</td>
                  <td className="penalty">{formatINR(pay.penalty)}</td>
                  <td className="total">{formatINR(pay.total)}</td>

                  <td>
                    <button
                      className="download-btn"
                      onClick={() => downloadSlip(pay)}
                    >
                      Download <FaDownload />
                      
                    </button>
                    
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: "20px" }}>
                  ❌ No Payment Records Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentMaintenance;