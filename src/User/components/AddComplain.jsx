import React from "react";
import "./css/AddComplain.css";




const AddComplain = () => {
  return (
    <div className="dashboard">

      
      

      {/* Main */}
      <main
        className="main"
     
      >
        <div className="overlay">

          <div className="page-title">

          </div>

          {/* Form Box */}
          <div className="complain-box">
            <h3>Add Complain</h3>

            <label>Complain Title</label>
            <input type="text" />

            <label>Add Complain</label>
            <textarea rows="6"></textarea>

            <button>Submit Complaint</button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AddComplain;
