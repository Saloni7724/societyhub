import "../css/ManageMembers.css";
import AdminLayout from "../layout/AdminLayout";

import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiSearch,
  FiX,
  FiChevronDown,
  FiEdit2,
  FiTrash2,
  FiPhoneCall,
  FiMoreHorizontal,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

import { db } from "../Backend/firebase-init";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

function ManageMembers() {
  const navigate = useNavigate();
  const filterRef = useRef(null);
  

  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilter, setShowFilter] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+91",
    flat: "",
    familyCount: "",
    password: "",
    profession: "",
    type: "",
    showPassword: false,
  });
useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      filterRef.current &&
      !filterRef.current.contains(event.target)
    ) {
      setShowFilter(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () =>
    document.removeEventListener("mousedown", handleClickOutside);
}, []);

  /* ------------------ AUTH CHECK ------------------ */
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isLoggedIn) navigate("/");
  }, [navigate]);

  /* ------------------ FETCH MEMBERS ------------------ */
  const fetchMembers = async () => {
    const snapshot = await getDocs(collection(db, "members"));
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMembers(list);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  /* ------------------ FILTER + SORT ------------------ */
  const filteredMembers = members
    .filter((m) =>
      `${m.name} ${m.flat} ${m.phone}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  /* ------------------ FORM HELPERS ------------------ */
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "+91",
      flat: "",
      familyCount: "",
      password: "",
      profession: "",
      type: "",
      showPassword: false,
    });
    setIsEdit(false);
    setIsReadOnly(false);
    setEditIndex(null);
  };

  const handleChange = (e) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /* ------------------ ADD / UPDATE ------------------ */
  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.flat ||
      !formData.familyCount ||
      !formData.profession ||
      !formData.type
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (isEdit) {
        const memberRef = doc(db, "members", editIndex);
        await updateDoc(memberRef, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          flat: formData.flat,
          familyCount: formData.familyCount,
          profession: formData.profession,
          type: formData.type,
        });
      } else {
        await addDoc(collection(db, "members"), {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          flat: formData.flat,
          familyCount: formData.familyCount,
          profession: formData.profession,
          type: formData.type,
          createdAt: serverTimestamp(),
        });
      }

      await fetchMembers();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Error saving member");
    }
  };

  /* ------------------ DELETE ------------------ */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    await deleteDoc(doc(db, "members", id));
    fetchMembers();
  };

  const openEdit = (member) => {
    setFormData({ ...member, showPassword: false });
    setIsEdit(true);
    setIsReadOnly(false);
    setEditIndex(member.id);
    setShowModal(true);
  };

  const openReadMore = (member) => {
    setFormData({ ...member, showPassword: false });
    setIsReadOnly(true);
    setShowModal(true);
  };

  /* ====================== UI ====================== */
  return (
    <>
      <AdminLayout active="ManageMembers">
        <section className="mm-content">
          <div className="mm-toolbar">
  <div className="left-tools">
    {/* FILTER */}
   <div ref={filterRef} className="filter-wrapper">

     <button
  className="btn-outline"
  onClick={() => setShowFilter((p) => !p)}
>
  Filters <FiChevronDown />
</button>


     <div className={`filter-dropdown ${showFilter ? "open" : ""}`}>
  <button
    onClick={() => {
      setSortOrder("asc");
      setShowFilter(false);
    }}
  >
    A → Z
  </button>

  <button
    onClick={() => {
      setSortOrder("desc");
      setShowFilter(false);
    }}
  >
    Z → A
  </button>
</div>

    </div>

    {/* ADD MEMBER */}
    <button
      className="btn-primary"
      onClick={() => {
        resetForm();
        setShowModal(true);
      }}
    >
      + Add Member
    </button>
  </div>

  {/* SEARCH */}
  <div className="mm-search-box">
    <FiSearch />
    <input
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
</div>


          <div className="mm-grid">
            {filteredMembers.map((m) => (
              <div className="mm-card" key={m.id}>
                <span className="flat">Flat No: {m.flat}</span>
                <h4>{m.name}</h4>
                <p className="phone">
                  <FiPhoneCall /> {m.phone}
                </p>

                <div className="mm-actions">
                  <button
                    className="btn-read"
                    onClick={() => openReadMore(m)}
                  >
                    <FiMoreHorizontal /> Read More
                  </button>

                  <FiEdit2
                    className="action-icon edit"
                    onClick={() => openEdit(m)}
                  />

                  <FiTrash2
                    className="action-icon delete"
                    onClick={() => handleDelete(m.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </AdminLayout>

        {showModal && (
  <div className="modal-overlay">
    <div className="modal-card">

      {/* HEADER */}
      <div className="modal-header">
        <h3>
          {isReadOnly
            ? "Member Details"
            : isEdit
            ? "Edit Member"
            : "Add Member"}
        </h3>

        <button
          className="modal-close"
          onClick={() => {
            setShowModal(false);
            resetForm();
          }}
        >
          <FiX />
        </button>
      </div>

      {/* BODY */}
      <div className="modal-body">

        {/* NAME + EMAIL */}
        <div className="form-row">
          <div className="form-group">
            <label>Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isReadOnly}
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isReadOnly}
            />
          </div>
        </div>

        {/* PHONE */}
        <div className="form-group">
          <label>Phone *</label>
          <input
            name="phone"
            value={formData.phone}
            disabled={isReadOnly}
            onChange={(e) => {
              let val = e.target.value;
              if (!val.startsWith("+91")) val = "+91";
              val = "+91" + val.slice(3).replace(/\D/g, "");
              if (val.length > 13) val = val.slice(0, 13);
              setFormData({ ...formData, phone: val });
            }}
          />
        </div>

        {/* FLAT + FAMILY */}
       <div className="form-row">
  <div className="form-group">
    <label>Flat No *</label>
    <input
      name="flat"
      value={formData.flat}
      onChange={handleChange}
      disabled={isReadOnly}
    />
  </div>

  <div className="form-group">
    <label>Family Members *</label>
    <input
      type="number"
      name="familyCount"
      value={formData.familyCount}
      onChange={handleChange}
      disabled={isReadOnly}
    />
  </div>
</div>



        {/* PASSWORD */}
        {!isReadOnly && (
          <div className="form-group">
            <label>Password *</label>
            <div className="password-wrapper">
              <input
                type={formData.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <span
                className="password-toggle"
                onClick={() =>
                  setFormData({
                    ...formData,
                    showPassword: !formData.showPassword,
                  })
                }
              >
                {formData.showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>
        )}

        {/* PROFESSION */}
        <div className="form-group">
          <label>Profession *</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="profession"
                value="Job"
                checked={formData.profession === "Job"}
                onChange={handleChange}
                disabled={isReadOnly}
              />
              Job
            </label>

            <label>
              <input
                type="radio"
                name="profession"
                value="Business"
                checked={formData.profession === "Business"}
                onChange={handleChange}
                disabled={isReadOnly}
              />
              Business
            </label>
          </div>
        </div>

        {/* TYPE */}
        {formData.profession && (
          <div className="form-group">
            <label>Type *</label>
            <input
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={isReadOnly}
            />
          </div>
        )}
      </div>

      {/* FOOTER */}
      {!isReadOnly && (
        <div className="modal-footer">
          <button className="submit-btn" onClick={handleSubmit}>
            {isEdit ? "Update Member" : "Add Member"}
          </button>
        </div>
      )}
    </div>
  </div>
)}
    </>
  );
}

export default ManageMembers;
