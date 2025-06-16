// CompilerDesignPage.js
import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./TOCPage.css"; // Reuse same styles

const topics = [
  {
    name: "Introduction to Compiler Design",
    subtopics: [
      {
        name: "Lexical Analysis",
        video: "https://www.youtube.com/embed/y6m71C-e40s",
        notes: "Introduction to the overall structure of compilers and the role of lexical analysis in breaking source code into tokens."
      },
      {
        name: "Top Down Parsing",
        video: "https://www.youtube.com/embed/JgDAweCCEI8",
        notes: "Detailed explanation of top-down parsing techniques including recursive descent and predictive parsing."
      },
      {
        name: "Bottom Up Parsing",
        video: "https://www.youtube.com/embed/W0EkrvGDoBY",
        notes: "Introduction to bottom-up parsing methods such as shift-reduce parsing and LR parsing."
      },
      {
        name: "Syntax Directed Translations",
        video: "https://www.youtube.com/embed/tVud-lFAdTg",
        notes: "Discussion on semantic analysis, syntax-directed definitions, and how translations are directed by syntax."
      },
      {
        name: "Intermediate Code and Code Optimization",
        video: "https://www.youtube.com/embed/oERJfSvelXA",
        notes: "Covers intermediate code generation, types of intermediate representations, and basics of code optimization techniques."
      }
    ]
  }
];


export default function CompilerDesignPage() {
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
          if (data.compilerDesignChecked) {
            setChecked(data.compilerDesignChecked);
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
          compilerDesignChecked: updated,
          subjectProgress: {
            CompilerDesign: overallProgress,
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
      <h2>🧠 Compiler Design</h2>
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
