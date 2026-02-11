import React from "react";
import "./css/PaymentMaintenance.css";
import { FaDownload } from "react-icons/fa";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ✅ Society Logo */
import logo from "../assets/logo.png";

const PaymentMaintenance = () => {
  const payments = [
    {
      date: "05-12-2025",
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
  ];

  /* ✅ Download Invoice PDF */
  const downloadSlip = (pay, index) => {
    const doc = new jsPDF();

    const invoiceNo = `INV-2026-${index + 101}`;

    /* ✅ Receipt Border */
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.rect(10, 10, 190, 277);

    /* ✅ Society Logo */
    doc.addImage(logo, "PNG", 15, 15, 25, 25);

    /* ✅ Title */
    doc.setFontSize(18);
    doc.text("Society Payment Invoice Receipt", 50, 25);

    doc.setFontSize(11);
    doc.text("SocietyHub Management System", 65, 33);

    /* ✅ Invoice Info */
    doc.setFontSize(12);
    doc.text(`Invoice No: ${invoiceNo}`, 20, 55);
    doc.text(`Payment Status: PAID ✅`, 140, 55);

    /* ✅ PAID Stamp */
    doc.setTextColor(200, 0, 0);
    doc.setFontSize(28);
    doc.text("PAID", 140, 90, { angle: 25 });
    doc.setTextColor(0, 0, 0);

    /* ✅ Resident Details Table */
    autoTable(doc, {
      startY: 70,
      theme: "grid",
      head: [["Pay Date", "Resident ID", "Resident Name"]],
      body: [[pay.date, pay.rid, pay.name]],
      styles: {
        halign: "center",
        fontSize: 11,
      },
      headStyles: {
        fillColor: [30, 64, 175],
        textColor: 255,
      },
    });

    /* ✅ Payment Details Table */
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      theme: "grid",
      head: [["Description", "Amount (₹)"]],
      body: [
        ["Maintenance Amount", pay.amount],
        ["Penalty Charges", pay.penalty],
        ["Total Paid Amount", pay.total],
      ],

      /* ✅ Penalty Red + Total Green */
      didParseCell: function (data) {
        if (data.row.index === 1) {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fillColor = [254, 226, 226];
          data.cell.styles.fontStyle = "bold";
        }

        if (data.row.index === 2) {
          data.cell.styles.textColor = [22, 163, 74];
          data.cell.styles.fillColor = [220, 252, 231];
          data.cell.styles.fontStyle = "bold";
        }
      },

      styles: {
        halign: "center",
        fontSize: 11,
      },

      headStyles: {
        fillColor: [22, 163, 74],
        textColor: 255,
      },
    });

    /* ✅ Footer */
    doc.setFontSize(11);
    doc.text(
      "Thank you for your payment 🙏",
      70,
      doc.lastAutoTable.finalY + 25
    );

    /* ✅ Stamp Seal */
    doc.setDrawColor(200, 0, 0);
    doc.setLineWidth(2);
    doc.circle(160, doc.lastAutoTable.finalY + 55, 18);

    doc.setFontSize(10);
    doc.text("SOCIETY", 152, doc.lastAutoTable.finalY + 53);
    doc.text("STAMP", 154, doc.lastAutoTable.finalY + 60);

    /* ✅ Signature */
    doc.text(
      "Authorized Signature:",
      20,
      doc.lastAutoTable.finalY + 55
    );

    doc.line(
      20,
      doc.lastAutoTable.finalY + 60,
      80,
      doc.lastAutoTable.finalY + 60
    );

    /* ✅ Save PDF */
    doc.save(`${pay.name}_Invoice.pdf`);
  };

  return (
    <div className="payment-container">
      {/* ✅ Title */}
      <h2 className="payment-title">💳 Payment Maintenance</h2>

      {/* ✅ Table Box */}
      <div className="payment-table-box">
        <table className="payment-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>R-Id</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Penalty</th>
              <th>Total</th>
              <th>Download Slip</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((pay, index) => (
              <tr key={index}>
                <td>{pay.date}</td>
                <td>{pay.rid}</td>
                <td>{pay.name}</td>

                {/* ✅ Amount Blue */}
                <td className="amount">₹ {pay.amount}</td>

                {/* 🔴 Penalty Red */}
                <td className="penalty">₹ {pay.penalty}</td>

                {/* 🟢 Total Green */}
                <td className="total">₹ {pay.total}</td>

                {/* ✅ Download Button */}
                <td>
                  <button
                    className="download-btn"
                    onClick={() => downloadSlip(pay, index)}
                  >
                    Download <FaDownload />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentMaintenance;
