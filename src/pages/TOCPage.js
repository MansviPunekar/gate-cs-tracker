// TOCPage.js
import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./TOCPage.css";

const topics = [
  {
    name: "Introduction Of Algorithms",
    subtopics: [
      {
        name: "Part 01",
        video: "https://www.youtube.com/embed/orOqKlq89_A",
        notes: "Introduction to algorithm fundamentals—definitions, examples, and real-life applications."
      },
      {
        name: "Part 02",
        video: "https://www.youtube.com/embed/7x5vpzb4tbA",
        notes: "Overview of problem-solving steps and algorithm correctness discussion."
      },
      {
        name: "Part 03",
        video: "https://www.youtube.com/embed/Ubab6STQZLc",
        notes: "Demonstration of simple searching & sorting algorithms."
      },
      {
        name: "Part 04",
        video: "https://www.youtube.com/embed/b2hnL-0_9kY",
        notes: "Comparison of efficiency metrics and performance measurement."
      },
      {
        name: "Part 05",
        video: "https://www.youtube.com/embed/Ka7XO8b_8Zs",
        notes: "Understanding pseudo-code and algorithmic expression."
      },
      {
        name: "Part 06",
        video: "https://www.youtube.com/embed/BM98qY4vgMY",
        notes: "Example walkthrough: binary search implementation."
      },
      {
        name: "Part 07",
        video: "https://www.youtube.com/embed/Bw5nTX2VuE0",
        notes: "Demystifying recursion with practical examples."
      },
      {
        name: "Part 08",
        video: "https://www.youtube.com/embed/9m-XO9ucUeQ",
        notes: "Factorial, Fibonacci via recursive vs iterative methods."
      },
      {
        name: "Part 09",
        video: "https://www.youtube.com/embed/iPAo7MXVYmM",
        notes: "Time complexity of basic recursive algorithms."
      },
      {
        name: "Part 10",
        video: "https://www.youtube.com/embed/gx3KuqO2DCQ",
        notes: "Base cases and stack depth in recursive solutions."
      }
    ]
  },
  // ... the rest of your topic structure
];


export default function TOCPage() {
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
          if (data.tocChecked) {
            setChecked(data.tocChecked);
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
          tocChecked: updated,
          subjectProgress: {
            TOC: overallProgress,
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
      <h2>📚 Theory of Computation</h2>
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
