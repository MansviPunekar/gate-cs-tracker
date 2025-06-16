// DBMSPage.js
import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./OperatingSystemPage.css"; // Reuse the same CSS for DBMS

const topics = [
  {
    name: "Introduction to DBMS",
    subtopics: [
      {
        name: "DBMS Overview",
        video: "https://www.youtube.com/embed/Y0QpMFG9F4s",
        notes: "Covers the purpose, definition, and advantages of DBMS."
      },
      {
        name: "Database Models",
        video: "https://www.youtube.com/embed/wU3W2JkFZ0E",
        notes: "Explains hierarchical, network, and relational models."
      }
    ]
  },
  {
    name: "Relational Model",
    subtopics: [
      {
        name: "Keys in DBMS",
        video: "https://www.youtube.com/embed/dOq2QblvrT8",
        notes: "Primary, candidate, foreign, and super keys."
      },
      {
        name: "Relational Algebra",
        video: "https://www.youtube.com/embed/3Jxeh-yAXek",
        notes: "Operations: select, project, union, set difference, Cartesian product."
      }
    ]
  },
  {
    name: "Normalization",
    subtopics: [
      {
        name: "Functional Dependencies",
        video: "https://www.youtube.com/embed/Uo-K_HtTTHk",
        notes: "FDs, full/partial dependency, transitive dependency."
      },
      {
        name: "1NF to 3NF",
        video: "https://www.youtube.com/embed/Kcx3eBvUAEU",
        notes: "Steps to normalize schemas and reduce redundancy."
      }
    ]
  }
];

export default function DBMSPage() {
  const [checked, setChecked] = useState({});
  const user = auth.currentUser;
  const uid = user?.uid;
  const userProgressRef = uid ? doc(db, "userProgress", uid) : null;

  const totalSubtopics = topics.reduce((acc, t) => acc + t.subtopics.length, 0);
  const completedSubtopics = Object.values(checked).filter(Boolean).length;
  const overallProgress = Math.round((completedSubtopics / totalSubtopics) * 100);

  useEffect(() => {
    const fetchData = async () => {
      if (userProgressRef) {
        const docSnap = await getDoc(userProgressRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.dbmsChecked) {
            setChecked(data.dbmsChecked);
          }
        }
      }
    };
    fetchData();
  }, [userProgressRef]);

  const handleCheckboxChange = async (topicIndex, subIndex) => {
    const key = `${topicIndex}-${subIndex}`;
    const updated = { ...checked, [key]: !checked[key] };
    setChecked(updated);

    const completedSubtopics = Object.values(updated).filter(Boolean).length;
    const overallProgress = Math.round((completedSubtopics / totalSubtopics) * 100);

    if (userProgressRef) {
      await setDoc(
        userProgressRef,
        {
          dbmsChecked: updated,
          subjectProgress: {
            DBMS: overallProgress,
          },
        },
        { merge: true }
      );
    }
  };

  const getProgress = (subtopics, topicIndex) => {
    const total = subtopics.length;
    const completed = subtopics.filter((_, i) => checked[`${topicIndex}-${i}`]).length;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="subject-wrapper">
      <h2>🗃️ Database Management Systems</h2>
      <p className="progress-info">Overall Progress: {overallProgress}% Completed</p>

      {topics.map((topic, topicIndex) => (
        <div key={topicIndex} className="topic-section">
          <details>
            <summary className="topic-summary">
              {topic.name} – {getProgress(topic.subtopics, topicIndex)}% Completed
            </summary>
            <ul className="subtopic-list">
              {topic.subtopics.map((sub, subIndex) => (
                <li key={subIndex} className="subtopic-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={checked[`${topicIndex}-${subIndex}`] || false}
                      onChange={() => handleCheckboxChange(topicIndex, subIndex)}
                    />
                    {sub.name}
                  </label>
                  <div className="video-container">
                    <iframe
                      src={sub.video}
                      title={sub.name}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="revision-note">
                    <strong>Revision Note:</strong> <em>{sub.notes}</em>
                  </div>
                </li>
              ))}
            </ul>
          </details>
        </div>
      ))}
    </div>
  );
}
