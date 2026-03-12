import React, { useState, useEffect } from "react";
import "./css/PaymentMaintenance.css";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* Firebase */
import { db } from "../Backend/firebase-init";
import { collection, getDocs } from "firebase/firestore";

const PaymentMaintenance = () => {

  const [payments, setPayments] = useState([]);

  const societyId = localStorage.getItem("societyId");
  const userFlat = localStorage.getItem("userFlat");

  const fetchPayments = async () => {

    const snapshot = await getDocs(
      collection(db, "societies", societyId, "maintenance")
    );

    const list = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(
        (item) =>
          item.flat === userFlat && item.status === "Paid"
      );

    setPayments(list);
  };

  useEffect(() => {
  fetchPayments();
// eslint-disable-next-line
}, []);

  const formatINR = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(value);
  };

  /* PDF RECEIPT */

  const downloadSlip = (pay) => {

    const doc = new jsPDF();

    doc.text("Maintenance Receipt", 70, 20);

    autoTable(doc, {
      startY: 40,
      head: [["Paid Date", "Month", "Amount", "Mode"]],
      body: [
        [
          pay.paidDate,
          pay.month,
          `₹ ${pay.paidAmount}`,
          pay.paymentMode || "Cash"
        ]
      ]
    });

    doc.save(`Receipt_${pay.month}.pdf`);
  };

  return (
    <div className="payment-page">

      <h2 className="payment-heading">
        Payment Maintenance
      </h2>

      <div className="payment-table-box">

        <table className="payment-table">

          <thead>
            <tr>
             
              <th>MONTH</th>
              <th>AMOUNT</th>
              <th>MODE</th>
              <th>DOWNLOAD</th>
            </tr>
          </thead>

          <tbody>

            {payments.length > 0 ? (

              payments.map((pay) => (

                <tr key={pay.id}>
                  <td>{pay.paidDate}</td>
                  <td>{pay.month}</td>
                  <td>{formatINR(pay.paidAmount)}</td>
                  <td>{pay.paymentMode}</td>

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
                <td colSpan="5">
                  No Payment Records
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