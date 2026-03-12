import React, { useState, useEffect } from "react";
import "./css/Notice.css";

/* Icons */
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FaBell } from "react-icons/fa";

/* Firebase */
import { db } from "../Backend/firebase-init";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const Notice = () => {

  const [notices, setNotices] = useState([]);
  const societyId = localStorage.getItem("societyId");

 useEffect(() => {

  if (!societyId) return;

  const q = query(
    collection(db, "societies", societyId, "notices"),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {

    const today = new Date();
    today.setHours(0,0,0,0);

    const data = snapshot.docs.map(doc => {

      const notice = doc.data();
      const noticeDate = new Date(notice.date);

      let status = "active";

      if (noticeDate > today) status = "upcoming";
      else if (noticeDate < today) status = "expired";

      return {
        id: doc.id,
        ...notice,
        status,
        noticeDate
      };

    })

    /* ❌ Expired notice remove after 7 days */

    .filter(n => {
      if (n.status !== "expired") return true;

      const diff = (today - n.noticeDate) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    });

    setNotices(data);

  });

  return () => unsubscribe();

}, [societyId]);

  return (
    <div className="notice-page">

      <h2 className="notification-title">
        <FaBell /> Society Notices
      </h2>

      <div className="notice-wrapper">

        {notices.length === 0 ? (
          <p className="no-notice">
            No Notices Available 🚫
          </p>
        ) : (

          notices.map((n) => (
            <div key={n.id} className={`notify-card ${n.priority}`}>

              <div className="notify-left">
                <AiOutlineExclamationCircle className="notify-icon" />

                <div>
                  <h3>{n.title}</h3>

                  <span className="notify-date">
                    📅 {n.date}
                  </span>

                  <p>{n.message}</p>

                  {/* ✅ Status Show */}
                  <p className={`notice-status ${n.status}`}>
                    {n.status === "expired" && "❌ Expired Notice"}
                    {n.status === "upcoming" && "⏳ Upcoming Notice"}
                    {n.status === "active" && "✅ Active Today"}
                  </p>

                </div>
              </div>

              <span className={`priority-badge ${n.priority}`}>
                {n.priority}
              </span>

            </div>
          ))

        )}

      </div>
    </div>
  );
};

export default Notice;