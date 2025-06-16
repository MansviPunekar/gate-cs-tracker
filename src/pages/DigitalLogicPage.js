import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./OperatingSystemPage.css"; // Reuse the same CSS

const topics = [
  {
    name: "Number Systems and Codes",
    subtopics: [
      {
        name: "Binary, Octal, Hexadecimal",
        video: "https://www.youtube.com/embed/example1",
        notes: "Understand conversion between binary, octal, decimal, and hexadecimal."
      },
      {
        name: "BCD, Gray, Excess-3",
        video: "https://www.youtube.com/embed/example2",
        notes: "Learn about different coding systems used in digital circuits."
      }
    ]
  },
  {
    name: "Logic Gates and Circuits",
    subtopics: [
      {
        name: "Basic Gates and Truth Tables",
        video: "https://www.youtube.com/embed/example3",
        notes: "Explanation of AND, OR, NOT, NAND, NOR, XOR, XNOR gates."
      },
      {
        name: "Boolean Algebra & Laws",
        video: "https://www.youtube.com/embed/example4",
        notes: "Laws of Boolean algebra, simplification techniques using K-maps."
      }
    ]
  },
  {
    name: "Combinational and Sequential Circuits",
    subtopics: [
      {
        name: "Adders, Subtractors, Multiplexers",
        video: "https://www.youtube.com/embed/example5",
        notes: "Design and working of half adder, full adder, MUX, DEMUX."
      },
      {
        name: "Flip-Flops and Registers",
        video: "https://www.youtube.com/embed/example6",
        notes: "SR, JK, D, T flip-flops and their characteristic tables."
      }
    ]
  }
];

export default function DigitalLogicPage() {
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
          if (data.dlChecked) {
            setChecked(data.dlChecked);
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
          dlChecked: updated,
          subjectProgress: {
            DigitalLogic: overallProgress,
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
      <h2>⚙️ Digital Logic</h2>
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
