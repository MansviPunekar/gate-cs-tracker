// Example: ComputerNetworksPage.js (Repeat for each subject)
import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./OperatingSystemPage.css";

const topics = [
  {
    name: "Introduction to Computer Networks",
    subtopics: [
      {
        name: "Basics of Networking",
        video: "https://www.youtube.com/embed/your_embed_link1",
        notes: "Overview of networks, types, and uses."
      },
      {
        name: "OSI Model",
        video: "https://www.youtube.com/embed/your_embed_link2",
        notes: "Explanation of 7 layers in OSI model."
      }
    ]
  }
  // Add more topic objects
];

export default function ComputerNetworksPage() {
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
          if (data.cnChecked) {
            setChecked(data.cnChecked);
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
          cnChecked: updated,
          subjectProgress: {
            ComputerNetworks: overallProgress,
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
      <h2>🌐 Computer Networks</h2>
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
