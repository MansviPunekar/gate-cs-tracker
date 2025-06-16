import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./OperatingSystemPage.css"; // shared CSS

const topics = [
  {
    name: "Basics of Programming",
    subtopics: [
      {
        name: "Introduction to C Programming",
        video: "https://www.youtube.com/embed/KJgsSFOSQv0",
        notes: "Basics of C syntax, variables, operators, and structure of a C program."
      },
      {
        name: "Control Structures",
        video: "https://www.youtube.com/embed/Ib2usa-4UJM",
        notes: "If-else, loops, switch-case and flow control in C."
      }
    ]
  },
  {
    name: "Functions and Arrays",
    subtopics: [
      {
        name: "Functions in C",
        video: "https://www.youtube.com/embed/bMt47wvK6u0",
        notes: "Function declaration, definition, call by value/reference, recursion."
      },
      {
        name: "Arrays and Strings",
        video: "https://www.youtube.com/embed/VzRXRf3bJKk",
        notes: "Understanding 1D/2D arrays, strings and memory layout."
      }
    ]
  },
  {
    name: "Data Structures Basics",
    subtopics: [
      {
        name: "Structures and Pointers",
        video: "https://www.youtube.com/embed/wU1m-vW_Hsk",
        notes: "Introduction to structures, pointers, dynamic memory allocation."
      },
      {
        name: "Linked List",
        video: "https://www.youtube.com/embed/sxTFSDAZM8s",
        notes: "Single linked list basics, insertion and deletion."
      }
    ]
  },
  {
    name: "Stacks, Queues & Trees",
    subtopics: [
      {
        name: "Stacks and Queues",
        video: "https://www.youtube.com/embed/wjI1WNcIntg",
        notes: "Understanding LIFO, FIFO, operations and applications."
      },
      {
        name: "Trees and Traversals",
        video: "https://www.youtube.com/embed/Zd5t9u8OPME",
        notes: "Binary trees, traversals (inorder, preorder, postorder)."
      }
    ]
  }
];

export default function ProgrammingAndDSPage() {
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
          if (data.pdsChecked) {
            setChecked(data.pdsChecked);
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
         pdsChecked: updated,
           subjectProgress: {
             PDS: overallProgress,
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
      <h2>👨‍💻 Programming and Data Structures</h2>
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
