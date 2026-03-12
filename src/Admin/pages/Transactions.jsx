import React, { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "../Backend/firebase-init";
import "../css/Transactions.css";

const societyId = localStorage.getItem("societyId");

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [filter, setFilter] = useState("All");

const fetchTransactions = useCallback(async () => {
    if (!societyId) return;

    try {
      // 1️⃣ Fetch manual transactions
      const transactionQuery = query(
        collection(db, "societies", societyId, "transactions"),
        orderBy("createdAt", "desc")
      );

    const snapshot = await getDocs(q);
    const list = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setTransactions(list);

    // 🔥 CALCULATE BALANCE
    let total = 0;
    list.forEach(item => {
      if (item.type === "Credit") {
        total += item.amount;
      } else {
        total -= item.amount;
      }
    });

      setBalance(total);

    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [societyId]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions =
    filter === "All"
      ? transactions
      : transactions.filter(t => t.type === filter);

  return (
    <AdminLayout active="transactions">
      <div className="transactions-container">

        <div className="transactions-header">
          <h3>Transaction History</h3>

          <div className="balance-box">
            Society Balance: ₹{balance}
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Transaction</option>
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
          </select>
        </div>

        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Flat No</th>
              <th>Payment Method</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map((t) => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.description}</td>
                <td>{t.category}</td>
                <td>{t.flatNo}</td>
                <td>{t.paymentMethod}</td>
                <td>
                  <span
                    className={
                      t.type === "Credit"
                        ? "type credit"
                        : "type debit"
                    }
                  >
                    {t.type}
                  </span>
                </td>
                <td
                  className={
                    t.type === "Credit"
                      ? "amount credit-amount"
                      : "amount debit-amount"
                  }
                >
                  {t.type === "Credit" ? "+" : "-"}₹{t.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </AdminLayout>
  );
};

export default Transactions;