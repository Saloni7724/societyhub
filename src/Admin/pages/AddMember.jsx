import React, { useState } from "react";
import "../css/AddMember.css";

const AddMember = () => {
  const [profession, setProfession] = useState("job");

  return (
    <div className="page">
      <div className="card">
        <h2>Add New Member</h2>

        {/* Row 1 */}
        <div className="row">
          <div className="field">
            <label>Name</label>
            <input type="text" placeholder="Enter full name" />
          </div>

          <div className="field">
            <label>Email</label>
            <input type="email" placeholder="Enter email address" />
          </div>
        </div>

        {/* Row 2 */}
        <div className="row">
          <div className="field">
            <label>Flat No</label>
            <input type="text" placeholder="e.g. A-203" />
          </div>

          <div className="field">
            <label>No Of Members</label>
            <input type="number" placeholder="Total members" />
          </div>
        </div>

        {/* Row 3 */}
        <div className="field full">
          <label>Password</label>
          <input type="password" placeholder="Create password" />
        </div>

        {/* Profession */}
        <div className="field full">
          <label>Profession</label>
          <div className="radio-group">
            <label className={profession === "job" ? "active" : ""}>
              <input
                type="radio"
                value="job"
                checked={profession === "job"}
                onChange={() => setProfession("job")}
              />
              Job
            </label>

            <label className={profession === "business" ? "active" : ""}>
              <input
                type="radio"
                value="business"
                checked={profession === "business"}
                onChange={() => setProfession("business")}
              />
              Business
            </label>
          </div>
        </div>

        {/* Job / Business Type */}
        <div className="field full">
          <label>Type of Job or Business</label>
          <input type="text" placeholder="Specify job or business type" />
        </div>

        <button className="submit-btn">Add Member</button>
      </div>
    </div>
  );
};

export default AddMember;
