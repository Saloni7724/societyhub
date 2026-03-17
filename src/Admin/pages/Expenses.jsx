import React, { useState, useEffect, useMemo, useCallback } from "react";
import AdminLayout from "../layout/AdminLayout";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  query,
  where,
  increment
} from "firebase/firestore";

import { db } from "../Backend/firebase-init";
import "../css/Expenses.css";

const societyId = localStorage.getItem("societyId");
const ensureFinanceDoc = async () => {
  const financeRef = doc(db, "societies", societyId, "meta", "finance");
  const snap = await getDoc(financeRef);

  if (!snap.exists()) {
    await setDoc(financeRef, { totalBalance: 0 });
  }
};

const Expenses = () => {

  const [showModal, setShowModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amount: "",
    date: "",
    assignTo: "All",
  });

  const [paymentSource, setPaymentSource] = useState("Members");
  const [currentBalance, setCurrentBalance] = useState(0);
 const [expenseDues, setExpenseDues] = useState([]);
const [members, setMembers] = useState([]);
  const expensesRef = collection(db, "societies", societyId, "expenses");

  // ================= FETCH EXPENSES =================
  const fetchExpenses = useCallback(async () => {
    const snap = await getDocs(expensesRef);
    setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }, [expensesRef]);

  // ================= FETCH META =================
  const fetchMeta = useCallback(async () => {

  const financeSnap = await getDoc(
    doc(db, "societies", societyId, "meta", "finance")
  );

  if (financeSnap.exists()) {
    setCurrentBalance(financeSnap.data().totalBalance || 0);
  }

  const membersSnap = await getDocs(
    collection(db, "societies", societyId, "members")
  );

  const membersData = membersSnap.docs.map(d => d.data());

  setMembers(membersData);
 
}, []);

  // ================= INITIAL LOAD =================
useEffect(() => {
  ensureFinanceDoc();
  fetchExpenses();
  fetchMeta();
  fetchExpenseDues();
}, [fetchExpenses, fetchMeta]);


const filteredMembers = useMemo(() => {

  let list = members;

  if (formData.assignTo === "Permanent") {
    list = members.filter(m => m.residenceType === "Permanent");
  }

  else if (formData.assignTo === "Rent") {
    list = members.filter(m => m.residenceType === "Rent");
  }

  else if (formData.assignTo.startsWith("Block-")) {
    const block = formData.assignTo.split("-")[1];
    list = members.filter(m => m.block === block);
  }

  return list;

}, [members, formData.assignTo]);
  // ================= PER MEMBER SPLIT =================
const perMemberAmount = useMemo(() => {

  const amt = Number(formData.amount || 0);
  if (!amt) return 0;

  let filteredMembers = members;

  if (formData.assignTo === "Permanent") {
    filteredMembers = members.filter(
      m => m.residenceType === "Permanent"
    );
  }

  else if (formData.assignTo === "Rent") {
    filteredMembers = members.filter(
      m => m.residenceType === "Rent"
    );
  }

  else if (formData.assignTo.startsWith("Block-")) {
    const block = formData.assignTo.split("-")[1];
    filteredMembers = members.filter(
      m => m.block === block
    );
  }

  if (filteredMembers.length === 0) return 0;

  return (amt / filteredMembers.length).toFixed(2);

}, [formData.amount, formData.assignTo, members]);
  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ================= PREVENT DUPLICATE TRANSACTION =================
  const transactionExists = async (expenseId) => {

    const q = query(
      collection(db, "societies", societyId, "transactions"),
      where("expenseId", "==", expenseId)
    );

    const snap = await getDocs(q);
    return !snap.empty;
  };

    const fetchExpenseDues = async () => {

  const snap = await getDocs(
    collection(db, "societies", societyId, "expenseDues")
  );

  const data = snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));

  setExpenseDues(data);

};
  // ================= SUBMIT =================
  const handleSubmit = async (e) => {

    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];

    if (!formData.title || !formData.category || !formData.amount || !formData.date) {
      alert("All fields are required");
      return;
    }

    if (formData.date < today) {
      alert("Past date not allowed");
      return;
    }

    const expenseAmount = Number(formData.amount);

    if (expenseAmount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    try {

      if (paymentSource === "SocietyFund" && currentBalance < expenseAmount) {
        alert("Insufficient Society Balance");
        return;
      }

      const expenseData = {
        title: formData.title,
        category: formData.category,
        date: formData.date,
        assignedTo: paymentSource === "Members" ? formData.assignTo : "Society Fund",
        amount: expenseAmount,
        paymentSource,
        status: paymentSource === "SocietyFund" ? "Paid" : "Pending",
        createdAt: new Date(),
      };

      let expenseId;

      if (editId) {

        await updateDoc(
          doc(db, "societies", societyId, "expenses", editId),
          expenseData
        );

        expenseId = editId;

      } else {

        const docRef = await addDoc(expensesRef, expenseData);
        expenseId = docRef.id;

      }

    

      // ===== SOCIETY FUND =====
      if (paymentSource === "SocietyFund") {

        const exists = await transactionExists(expenseId);

        if (!exists) {

          await addDoc(
            collection(db, "societies", societyId, "transactions"),
            {
              date: new Date().toLocaleDateString(),
              description: `Expense - ${formData.title}`,
              category: "Expense",
              paymentMethod: "Cash",
              type: "Debit",
              amount: expenseAmount,
              expenseId,
              createdAt: new Date(),
            }
          );

          await updateDoc(
            doc(db, "societies", societyId, "meta", "finance"),
            { totalBalance: increment(-expenseAmount) }
          );

        }

      }

      // ===== MEMBERS SPLIT =====
   // ===== MEMBERS SPLIT =====
// ===== MEMBERS SPLIT =====
if (paymentSource === "Members") {

  if (filteredMembers.length === 0) {
    alert("No members found");
    return;
  }

  const perMember = expenseAmount / filteredMembers.length;

  console.log("Total Members:", filteredMembers.length);
  console.log("Per Member Amount:", perMember);

  for (const m of filteredMembers) {

    await addDoc(
      collection(db, "societies", societyId, "expenseDues"),
      {
        member: m.name,
        flat: m.flat,
        block: m.block,

        expenseTitle: formData.title,
        totalAmount: expenseAmount,

        memberShare: perMember,
        paidAmount: 0,
        pendingAmount: perMember,

        status: "Pending",
        expenseId,
        createdAt: new Date(),
      }
    );

  }

}

      // RESET
      setFormData({
        title: "",
        category: "",
        amount: "",
        date: "",
        assignTo: "All"
      });

      setPaymentSource("Members");
      setEditId(null);
      setShowModal(false);

      fetchExpenses();
      fetchMeta();

    } catch (err) {

      console.error(err);
      alert("Error saving expense");

    }

  };

  // ================= DELETE =================
  const handleDelete = async (id) => {

    await deleteDoc(
      doc(db, "societies", societyId, "expenses", id)
    );

    fetchExpenses();

  };

  return (
    <AdminLayout active="expenses">
      <div className="expenses-container">
        <div className="expenses-header">
          <button className="add-expense-btn" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Expense
          </button>
        </div>

       <div className="expenses-card">
  <table className="expenses-table">
    <thead>
      <tr>
        <th>Title</th>
        <th>Category</th>
        <th>Date</th>
        <th>Assigned To</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {expenses.map((e) => (
        <tr key={e.id}>
          <td>{e.title}</td>
          <td>{e.category}</td>
          <td>{e.date}</td>
          <td>{e.assignedTo}</td>
          <td>₹{e.amount}</td>
          <td>
            <span className={e.status === "Paid" ? "status paid" : "status pending"}>
              {e.status}
            </span>
          </td>
          <td className="actions">
            <Pencil
              size={16}
              onClick={() => {
                setFormData({
                  title: e.title,
                  category: e.category,
                  amount: e.amount,
                  date: e.date,
                  assignTo: e.assignedTo,
                });
                setPaymentSource(e.paymentSource || "Members");
                setEditId(e.id);
                setShowModal(true);
              }}
            />
            <Trash2 size={16} onClick={() => handleDelete(e.id)} />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* MEMBER DUES TABLE */}
<div className="dues-card">
  <h3>Member Expense Dues</h3>

  <table className="expenses-table">
    <thead>
      <tr>
        <th>Member</th>
        <th>Flat</th>
        <th>Block</th>
        <th>Expense</th>
        <th>Amount</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody>
      {expenseDues.map((d) => (
        <tr key={d.id}>
          <td>{d.member}</td>
          <td>{d.flat}</td>
          <td>{d.block}</td>
          <td>{d.expenseTitle}</td>
          <td>₹{d.memberShare}</td>
          <td>{d.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        {/* ================= MODAL ================= */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>{editId ? "Edit Expense" : "Add New Expense"}</h3>
                <X size={18} onClick={() => setShowModal(false)} />
              </div>

              <form onSubmit={handleSubmit}>
                <label>Expense Title</label>
                <input name="title" value={formData.title} onChange={handleChange} required />

                <div className="row">
                  <div>
                    <label>Category</label>
                    <input name="category" value={formData.category} onChange={handleChange} required />
                  </div>
                  <div>
                    <label>Amount</label>
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
                  </div>
                </div>
                

                {/* Auto Split */}
                {paymentSource === "Members" && formData.amount && (
                  <div className="split-box">
                    Per Member: <strong>₹{perMemberAmount}</strong> ({filteredMembers.length} members)
                  </div>
                )}

                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />

                {/* Payment Toggle */}
                <label>Payment Method</label>
                <div className="payment-toggle">
                  <button type="button" className={paymentSource === "Members" ? "active" : ""} onClick={() => setPaymentSource("Members")}>Collect From Members</button>
                  <button type="button" className={paymentSource === "SocietyFund" ? "active" : ""} onClick={() => setPaymentSource("SocietyFund")}>Use Society Fund</button>
                </div>

                {/* Live Balance */}
                {paymentSource === "SocietyFund" && (
                  <div className="balance-box">
                    Available Balance: <strong>₹{currentBalance}</strong>
                  </div>
                )}

                {paymentSource === "Members" && (
                  <>
                    <label>Assign To</label>
                    <select name="assignTo" value={formData.assignTo} onChange={handleChange}>
                      <option value="All">All Members</option>
                      <option value="Permanent">Permanent</option>
                      <option value="Rent">Rent</option>
                      <option value="Block-A">Block A</option>
                      <option value="Block-B">Block B</option>
                      <option value="Block-C">Block C</option>
                    </select>
                  </>
                )}

              <div className="modal-buttons">
  <button
    type="button"
    className="cancel-btn"
    onClick={() => setShowModal(false)}
  >
    Cancel
  </button>

  <button
    type="submit"
    className="submit-btn"
  >
    {editId ? "Update Expense" : "Add Expense"}
  </button>
</div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Expenses;
