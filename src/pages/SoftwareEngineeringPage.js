import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./OperatingSystemPage.css"; // Reusing the same CSS

const topics = [
  {
    name: "Introduction to Software Engineering",
    subtopics: [
      {
        name: "What is Software Engineering?",
        video: "https://www.youtube.com/embed/example1",
        notes: "Definition, characteristics of software, and need for engineering principles."
      },
      {
        name: "Software Process Models",
        video: "https://www.youtube.com/embed/example2",
        notes: "Waterfall, Incremental, Spiral, and Agile models overview."
      }
    ],
  },
  {
    name: "Requirements and Design",
    subtopics: [
      {
        name: "Requirement Engineering",
        video: "https://www.youtube.com/embed/example3",
        notes: "Functional vs non-functional requirements, requirement elicitation."
      },
      {
        name: "Software Design Concepts",
        video: "https://www.youtube.com/embed/example4",
        notes: "Modularity, abstraction, cohesion, coupling, and design strategies."
      }
    ],
  },
  {
    name: "Testing and Maintenance",
    subtopics: [
      {
        name: "Software Testing",
        video: "https://www.youtube.com/embed/example5",
        notes: "Unit testing, integration testing, system testing and validation."
      },
      {
        name: "Software Maintenance",
        video: "https://www.youtube.com/embed/example6",
        notes: "Corrective, adaptive, perfective and preventive maintenance types."
      }
    ],
  }
];

export default function SoftwareEngineeringPage() {
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
          if (data.seChecked) {
            setChecked(data.seChecked);
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
          seChecked: updated,
          subjectProgress: {
            SoftwareEngineering: overallProgress,
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
      <h2>💻 Software Engineering</h2>
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
