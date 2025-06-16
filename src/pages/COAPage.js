import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./OperatingSystemPage.css"; // Using shared CSS

const topics = [
  {
    name: "Basic Structure of Computers",
    subtopics: [
      {
        name: "Functional Units and Bus Structures",
        video: "https://www.youtube.com/embed/example1",
        notes: "Understand basic components like ALU, control unit, memory and I/O."
      },
      {
        name: "Instruction Set Architecture",
        video: "https://www.youtube.com/embed/example2",
        notes: "Covers types of instructions, formats and addressing modes."
      }
    ]
  },
  {
    name: "Memory Hierarchy",
    subtopics: [
      {
        name: "Cache Memory",
        video: "https://www.youtube.com/embed/example3",
        notes: "Working of cache memory and mapping techniques (direct, associative)."
      },
      {
        name: "Virtual Memory",
        video: "https://www.youtube.com/embed/example4",
        notes: "Concepts of paging, segmentation, TLB and demand paging."
      }
    ]
  },
  {
    name: "Input/Output Organization",
    subtopics: [
      {
        name: "I/O Techniques",
        video: "https://www.youtube.com/embed/example5",
        notes: "Programmed I/O, Interrupt-driven I/O, and DMA mechanisms."
      },
      {
        name: "Interrupts and Controllers",
        video: "https://www.youtube.com/embed/example6",
        notes: "Details on hardware interrupt handling and I/O processors."
      }
    ]
  },
  {
    name: "Processor Design",
    subtopics: [
      {
        name: "Datapath and Control Unit",
        video: "https://www.youtube.com/embed/example7",
        notes: "Detailed view of datapath elements, instruction cycle, and control logic."
      },
      {
        name: "Pipelining",
        video: "https://www.youtube.com/embed/example8",
        notes: "Concept, hazards, and performance enhancement through pipelining."
      }
    ]
  }
];

export default function COAPage() {
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
          if (data.coaChecked) {
            setChecked(data.coaChecked);
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
          coaChecked: updated,
          subjectProgress: {
            COA: overallProgress,
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
      <h2>🧮 Computer Organization and Architecture (COA)</h2>
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
