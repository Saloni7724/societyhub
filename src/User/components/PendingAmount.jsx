import React, { useState, useEffect } from "react";
import "./css/PendingAmount.css";

/* Firebase */
import { db } from "../Backend/firebase-init";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

const PendingAmount = () => {

  const [dataList, setDataList] = useState([]);

  const societyId = localStorage.getItem("societyId");
  const userFlat = localStorage.getItem("userFlat");

  /* FETCH MAINTENANCE + EXPENSES */

  const fetchData = async () => {

    if (!societyId) return;

    /* 🔵 Maintenance */ 
    const maintenanceSnap = await getDocs(
      collection(db, "societies", societyId, "maintenance")
    );

    const maintenanceData = maintenanceSnap.docs
      .map(doc => ({
        id: doc.id,
        type: "Maintenance",
        ...doc.data()
      }))
      .filter(m => m.flat === userFlat);

    /* 🔴 Expenses (View Only) */
    const expenseSnap = await getDocs(
      collection(db, "societies", societyId, "expenses")
    );

    const expenseData = expenseSnap.docs.map(doc => ({
      id: doc.id,
      type: "Expense",
      ...doc.data()
    }));

    setDataList([...maintenanceData, ...expenseData]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* PAYMENT */

  const handlePayNow = async (item) => {

    if (item.type !== "Maintenance") return;

    try {

      await updateDoc(
        doc(db, "societies", societyId, "maintenance", item.id),
        {
          status: "Paid",
          paidAmount: item.pendingAmount,
          pendingAmount: 0,
          paymentMode: "Online"
        }
      );

      /* Transaction Entry */
      await addDoc(
        collection(db, "societies", societyId, "transactions"),
        {
          date: new Date().toLocaleDateString(),
          description: `Maintenance Payment (${item.month || ""})`,
          flatNo: item.flat,
          type: "Credit",
          amount: Number(item.pendingAmount),
          createdAt: serverTimestamp()
        }
      );

      alert("Payment Successful ✅");

      fetchData();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="pending-container">

      <h2>Pending Payments</h2>

      <div className="pending-grid">

        {dataList.map(item => (

          <div className="pending-card" key={item.id}>

            <p>
              Type :
              <span>{item.type}</span>
            </p>

            <p>
              Title :
              <span>
                {item.title || item.month}
              </span>
            </p>

            <p>
              Amount :
              <span className="amount">
                ₹ {item.amount || item.pendingAmount}
              </span>
            </p>

            {item.type === "Maintenance" && (
              <>
                <p>
                  Status :
                  <span>{item.status}</span>
                </p>

                <button
                  className="pay-btn"
                  disabled={item.status === "Paid"}
                  onClick={() => handlePayNow(item)}
                >
                  {item.status === "Paid"
                    ? "Paid ✅"
                    : "Pay Now"}
                </button>
              </>
            )}

          </div>

        ))}

      </div>
    </div>
  );
};

export default PendingAmount;