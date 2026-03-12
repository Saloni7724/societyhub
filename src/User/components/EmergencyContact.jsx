import React, { useEffect, useState } from "react";
import "./css/EmergencyContact.css";

import {
  FaUserMd
} from "react-icons/fa";

/* Firebase */
import { db } from "../Backend/firebase-init";
import { collection, getDocs } from "firebase/firestore";

const EmergencyContact = () => {

  const [contacts, setContacts] = useState([]);

  const societyId = localStorage.getItem("societyId");

  useEffect(() => {

    const fetchEmergency = async () => {

      if (!societyId) return;

      const membersRef = collection(
        db,
        "societies",
        societyId,
        "members"
      );

      const snapshot = await getDocs(membersRef);

      let doctorList = [];

      snapshot.forEach((doc) => {

        const data = doc.data();

        /* Only Doctor Fetch */
        if (
          data.type &&
          data.type.toLowerCase().includes("doctor")
        ) {
          doctorList.push({
            id: doc.id,
            name: data.name,
            phone: data.phone,
            flat: data.flat,
            block: data.block,
          });
        }

      });

      setContacts(doctorList);

    };

    fetchEmergency();

  }, [societyId]);

  return (
    <div className="emergency-container">

      <h2 className="emergency-title">
        Emergency Contacts
      </h2>

      <div className="emergency-grid">

        {contacts.length > 0 ? (

          contacts.map((item) => (

            <div
              className="emergency-card card-doctor"
              key={item.id}
            >

              <div className="card-icon">
                <FaUserMd />
              </div>

              <h3>Doctor</h3>

              <p>
                <span>Name:</span> {item.name}
              </p>

              <p>
                <span>Flat:</span> {item.flat}
              </p>

              <p>
                <span>Block:</span> {item.block}
              </p>

              <p className="phone">
                <span>Contact:</span> {item.phone}
              </p>

              <div className="emegency-btn">

                <a
                  href={`tel:${item.phone}`}
                  className="call-btn"
                >
                  📞 Call
                </a>

                <a
                  href={`https://wa.me/${item.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-btn"
                >
                  💬 WhatsApp
                </a>

              </div>

            </div>

          ))

        ) : (

          <p style={{ textAlign: "center", width: "100%" }}>
            No Doctor Available
          </p>

        )}

      </div>

    </div>
  );
};

export default EmergencyContact;