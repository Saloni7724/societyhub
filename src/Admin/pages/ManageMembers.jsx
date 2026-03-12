import "../css/ManageMembers.css";
import AdminLayout from "../layout/AdminLayout";
 import { query, orderBy } from "firebase/firestore";
import { useRef, useEffect, useState } from "react";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiSearch,
  FiX,
  FiChevronDown,
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
  
const societyId = localStorage.getItem("societyId");
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
    residenceType: "",   // NEW
    block: "",           // NEW
    showPassword: false,
  });

  // Duplicate check


  const [errors, setErrors] = useState({});
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
    if (!isLoggedIn) navigate("/manage-members");
  }, [navigate]);
useEffect(() => {
  if (societyId) {
    fetchMembers();
  }
}, [societyId, fetchMembers]);
  /* ------------------ FETCH MEMBERS ------------------ */
/* ------------------ FETCH MEMBERS ------------------ */
const fetchMembers = async () => {
  if (!societyId) return;

  try {
    const q = query(
      collection(db, "societies", societyId, "members"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMembers(list);
  } catch (error) {
    console.error("Error fetching members:", error);
  }
};
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
      residenceType: "",   // NEW
      block: "",           // NEW
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
  if (!societyId) {
    alert("Society ID not found. Cannot save member.");
    return;
  }

  let newErrors = {};

  /* ================= BASIC VALIDATION ================= */

  if (!formData.name.trim())
    newErrors.name = "Name is required";

  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = "Email is not in proper format";
  }

  if (!formData.phone || formData.phone.length !== 13)
    newErrors.phone = "Phone number must be 10 digits";

  if (!formData.flat.trim())
    newErrors.flat = "Flat number is required";

  if (!formData.familyCount || formData.familyCount <= 0)
    newErrors.familyCount = "Enter valid number";

  if (!formData.profession)
    newErrors.profession = "Profession is required";

  if (!formData.type.trim())
    newErrors.type = "Type is required";

  if (!formData.residenceType)
    newErrors.residenceType = "Residence type is required";

  if (!formData.block)
    newErrors.block = "Block is required";

  if (!isEdit && !formData.password.trim())
    newErrors.password = "Password is required";


  /* ================= DUPLICATE CHECK ================= */

  const emailExists = members.some(
    (m) =>
      m.email?.toLowerCase() === formData.email.toLowerCase() &&
      m.id !== editIndex
  );

  const phoneExists = members.some(
    (m) =>
      m.phone === formData.phone &&
      m.id !== editIndex
  );

  if (emailExists)
    newErrors.email = "Email already exists";

  if (phoneExists)
    newErrors.phone = "Phone number already exists";


  /* ================= FINAL ERROR CHECK ================= */

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});

  /* ================= SAVE DATA ================= */

  try {
    if (isEdit) {
      const memberRef = doc(
        db,
        "societies",
        societyId,
        "members",
        editIndex
      );

      await updateDoc(memberRef, {
        name: formData.name,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        flat: formData.flat,
        familyCount: formData.familyCount,
        profession: formData.profession,
        type: formData.type,
        residenceType: formData.residenceType,
        block: formData.block,
        updatedAt: serverTimestamp(),
      });

    } else {
      const membersRef = collection(
        db,
        "societies",
        societyId,
        "members"
      );

      await addDoc(membersRef, {
        name: formData.name,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        flat: formData.flat,
        familyCount: formData.familyCount,
        profession: formData.profession,
        type: formData.type,
        residenceType: formData.residenceType,
        block: formData.block,
        password: formData.password,
        createdAt: serverTimestamp(),
      });
    }

    await fetchMembers();
    setShowModal(false);
    resetForm();

  } catch (error) {
    console.error("Error saving member:", error);
    alert("Error saving member. Check console for details.");
  }
};
  /* ------------------ DELETE ------------------ */
 const handleDelete = async (id) => {
  if (!window.confirm("Delete this member?")) return;

  await deleteDoc(doc(db, "societies", societyId, "members", id));
  fetchMembers(); // refresh after delete
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
      <AdminLayout active="members">
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

        <span className="edit-btn" onClick={() => openEdit(m)}>
  ✏️
</span>

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
    <div className="modal-card1">

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
          <div className="form-group1">
            <label>Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isReadOnly}
            />
       
{errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group1">
            <label>Email *</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isReadOnly}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
        </div>

        {/* PHONE */}
        <div className="form-group1">
          <label>Phone *</label>
          <input
            name="phone"
            value={formData.phone}
            disabled={isReadOnly}
            onChange={(e) => {
  let val = e.target.value.replace(/\D/g, "");

  // Remove 91 if user types manually
  if (val.startsWith("91")) {
    val = val.slice(2);
  }

  if (val.length > 10) {
    val = val.slice(0, 10);
  }

  setFormData({ ...formData, phone: "+91" + val });
}}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>

        {/* FLAT + FAMILY */}
       {/* FLAT + FAMILY */}
<div className="form-row">
  <div className="form-group1">
    <label>Flat No *</label>
    <input
      name="flat"
      value={formData.flat}
      onChange={handleChange}
      disabled={isReadOnly}
    />
    {errors.flat && <span className="error">{errors.flat}</span>}
  </div>

  <div className="form-group1">
    <label>Family Count *</label>
    <input
      type="number"
      name="familyCount"
      value={formData.familyCount}
      onChange={(e) => {
        if (e.target.value >= 0) {
          handleChange(e);
        }
      }}
      disabled={isReadOnly}
    />
    {errors.familyCount && (
      <span className="error">{errors.familyCount}</span>
    )}
  </div>
</div>


        {/* PASSWORD */}
        {!isReadOnly && (
          <div className="form-group1">
            <label>Password *</label>
            <div className="password-wrapper">
              <input
                type={formData.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="error">{errors.password}</span>}
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
            <div className="form-group1">
              <label>Profession <span className="required">*</span></label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="profession"
                    value="Job"
                    checked={formData.profession === "Job"}
                    onChange={handleChange}
                    disabled={isReadOnly}
                  /> Job
                </label>
                <label>
                  <input
                    type="radio"
                    name="profession"
                    value="Business"
                    checked={formData.profession === "Business"}
                    onChange={handleChange}
                    disabled={isReadOnly}
                  /> Business
                </label>
                {errors.profession && <span className="error">{errors.profession}</span>}
              </div>
            </div>

            {formData.profession && (
              <div className="form-group1">
                <label>Type of {formData.profession} <span className="required">*</span></label>
                <input
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={isReadOnly}
                />
                {errors.type && <span className="error">{errors.type}</span>}
              </div>
            )}
</div>
< div className="form-row">
<div className="form-group1">
  <label>Residence Type *</label>
  <select
    name="residenceType"
    value={formData.residenceType}
    onChange={handleChange}
    disabled={isReadOnly}
  >
    <option value="">Select</option>
    <option value="Permanent">Permanent</option>
    <option value="Rent">Rent</option>
  </select>
  {errors.residenceType && (
    <span className="error">{errors.residenceType}</span>
  )}
</div>


<div className="form-group1">
  <label>Block *</label>
  <select
    name="block"
    value={formData.block}
    onChange={handleChange}
    disabled={isReadOnly}
  >
    <option value="">Select Block</option>
    <option value="A">A Block</option>
    <option value="B">B Block</option>
    <option value="C">C Block</option>
  </select>
  {errors.block && (
    <span className="error">{errors.block}</span>
  )}
</div>
</div>

      {/* FOOTER */}
      {!isReadOnly && (
        <div className="modal-footer">
          <button className="submit-btn1" onClick={handleSubmit}>
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
