import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "../layout/AdminLayout";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { setDoc, getDoc } from "firebase/firestore";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  increment
} from "firebase/firestore";
import { db } from "../Backend/firebase-init";
import "../css/Expenses.css";

const societyId = localStorage.getItem("societyId");

const Expenses = () => {
  const [showModal, setShowModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [editId, setEditId] = useState(null);
const [totalMembers, setTotalMembers] = useState(0);
  useEffect(() => {
  ensureFinanceDoc();
  fetchExpenses();
  fetchMeta();
}, []);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amount: "",
    date: "",
    assignTo: "All Members",
  });

  const fetchMeta = async () => {
  const membersSnapshot = await getDocs(
    collection(db, "societies", societyId, "members")
  );
  setTotalMembers(membersSnapshot.size);
};
const ensureFinanceDoc = async () => {
  const financeRef = doc(db, "societies", societyId, "meta", "finance");
  const snap = await getDoc(financeRef);

  if (!snap.exists()) {
    await setDoc(financeRef, { totalBalance: 0 });
  }
};

  const expensesRef = collection(db, "societies", societyId, "expenses");

  // ================= FETCH FROM FIRESTORE =================
  const fetchExpenses = async () => {
    const data = await getDocs(expensesRef);
    const expenseList = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setExpenses(expenseList);
  };
useEffect(() => {
  const init = async () => {
    await ensureFinanceDoc();
    await fetchExpenses();
    await fetchMeta();
  };

  init();

// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
  
  // ================= LIVE PER-MEMBER SPLIT =================
  const perMemberAmount = useMemo(() => {
    const amt = Number(formData.amount || 0);
    if (!amt || totalMembers <= 0) return 0;
    return (amt / totalMembers).toFixed(2);
  }, [formData.amount, totalMembers]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= PREVENT DOUBLE TRANSACTION =================
  const transactionExists = async (expenseId) => {
    const q = query(
      collection(db, "societies", societyId, "transactions"),
      where("expenseId", "==", expenseId)
    );
    const snap = await getDocs(q);
    return !snap.empty;
  };

  // ================= SUBMIT =================
// ================= SUBMIT =================
const handleSubmit = async (e) => {
  e.preventDefault();

  const today = new Date().toISOString().split("T")[0];

  // ================= VALIDATION =================
  if (
    !formData.title ||
    !formData.category ||
    !formData.amount ||
    !formData.date ||
    !formData.assignTo
  ) {
    alert("All fields are required");
    return;
  }

  if (formData.date < today) {
    alert("Past date not allowed");
    return;
  }

  if (formData.amount <= 0) {
    alert("Amount must be greater than 0");
    return;
  }

  try {
    // ================= CREATE EXPENSE OBJECT =================
    const newExpense = {
      title: formData.title,
      category: formData.category,
      date: formData.date,
      assignedTo: formData.assignTo,
      amount: Number(formData.amount),
      status: "Pending",
      createdAt: new Date(),
    };

    let expenseDocRef;

    // ================= SAVE / UPDATE =================
    if (editId) {
      await updateDoc(doc(db, "societies", societyId, "expenses", editId), newExpense);
      expenseDocRef = { id: editId };
      setEditId(null);
    } else {
      expenseDocRef = await addDoc(expensesRef, newExpense);
    }

    // ================= FETCH MEMBERS =================
   const membersSnapshot = await getDocs(
  collection(db, "societies", societyId, "members")
);
    const members = membersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    let filteredMembers = [];

    // ================= FILTER LOGIC =================
    if (formData.assignTo === "All Members") {
      filteredMembers = members;
    } 
    else if (formData.assignTo === "Permanent") {
      filteredMembers = members.filter(
        (m) => m.residenceType === "Permanent"
      );
    } 
    else if (formData.assignTo === "Rent") {
      filteredMembers = members.filter(
        (m) => m.residenceType === "Rent"
      );
    } 
    else if (formData.assignTo.startsWith("Block-")) {
      const blockLetter = formData.assignTo.split("-")[1];
      filteredMembers = members.filter(
        (m) => m.block === blockLetter
      );
    }

    // ================= SEND NOTIFICATIONS =================
    for (let member of filteredMembers) {
      await addDoc(collection(db, "societies", societyId, "notifications"), {
        userId: member.id,
        title: "New Expense Added 💰",
        message: `${formData.title} - ₹${formData.amount} Due on ${formData.date}`,
        expenseId: expenseDocRef.id,
        createdAt: new Date(),
        read: false,
      });
    }

    alert(editId ? "Expense Updated Successfully" : "Expense Added Successfully");

    // ================= RESET =================
    setFormData({
      title: "",
      category: "",
      amount: "",
      date: "",
      assignTo: "All Members",
    });

    setShowModal(false);
    fetchExpenses();

  } catch (error) {
    console.error(error);
    alert("Error saving expense");
  }
};

  // ================= DELETE =================
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "societies", societyId, "expenses", id));
    fetchExpenses();
  };

  
  return (
    <AdminLayout active="expenses">
      <div className="expenses-container">
        <div className="expenses-header">
          
          <button
            className="add-expense-btn"
            onClick={() => setShowModal(true)}
          >
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
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.title}</td>
                  <td>{expense.category}</td>
                  <td>{expense.date}</td>
                  <td>
                    {Array.isArray(expense.assignedTo)
                      ? expense.assignedTo.join(", ")
                      : expense.assignedTo}
                  </td>
                  <td>₹{expense.amount}</td>
                 <td>
  <span
    className={
      expense.status === "Paid"
        ? "status paid"
        : "status pending"
    }
  onClick={async () => {
  const newStatus =
    expense.status === "Paid" ? "Pending" : "Paid";

  await updateDoc(
    doc(db, "societies", societyId, "expenses", expense.id),
    { status: newStatus }
  );

  // ⭐ If marking as Paid → create DEBIT transaction
  if (newStatus === "Paid") {
    await addDoc(
      collection(db, "societies", societyId, "transactions"),
      {
        date: expense.date,
        description: expense.title,
        flatNo: "Society Expense",
        type: "Debit",
        amount: Number(expense.amount),
        createdAt: new Date(),
      }
    );

    // 🔻 Decrease balance
    await updateDoc(
      doc(db, "societies", societyId, "meta", "finance"),
      {
        totalBalance: increment(-Number(expense.amount)),
      }
    );
  }

  fetchExpenses();
}}
    style={{ cursor: "pointer" }}
  >
    {expense.status}
  </span>
</td>
                  <td className="actions">
  <Pencil
    size={16}
    style={{ cursor: "pointer", marginRight: "10px" }}
    onClick={() => {
      setFormData({
        title: expense.title,
        category: expense.category,
        amount: expense.amount,
        date: expense.date,
        assignTo: expense.assignedTo,
      });
      setEditId(expense.id);
      setShowModal(true);
    }}
  />

  <Trash2
    size={16}
    style={{ cursor: "pointer" }}
    onClick={() => handleDelete(expense.id)}
  />
</td>
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
                <X
                  size={18}
                  className="close-icon"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <form onSubmit={handleSubmit}>
                <label>Expense Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

                <div className="row">
                  <div>
                    <label>Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label>Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />

                <label>Assign To</label>
               <select
  name="assignTo"
  value={formData.assignTo}
  onChange={handleChange}
  required
>
  <option value="">Select Option</option>
  <option value="All">All Members</option>
  <option value="Permanent">Permanent</option>
  <option value="Rent">Rent</option>
  <option value="Block-A">Block A</option>
  <option value="Block-B">Block B</option>
  <option value="Block-C">Block C</option>
</select>

              

                <div className="modal-buttons">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn5">
                    Add Expense
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