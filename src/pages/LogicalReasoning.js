// VerbalAbility.js
import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./VerbalAbility.css";

const subtopics = [
  "Reading Comprehension",
  "Synonyms and Antonyms",
  "Sentence Completion",
  "Word Usage",
  "Grammar and Sentence Correction",
  "Verbal Analogies",
  "Idioms and Phrases"
];

export default function NumericalAbility() {
  const [checked, setChecked] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        const completed = data?.numericalCompleted || [];
        setChecked(completed);

        const calculatedProgress = Math.round((completed.length / subtopics.length) * 100);
        setProgress(calculatedProgress);
      }
    };

    fetchProgress();
  }, []);

  const handleCheckboxChange = async (index) => {
    let updatedChecked;
    if (checked.includes(index)) {
      updatedChecked = checked.filter((i) => i !== index);
    } else {
      updatedChecked = [...checked, index];
    }

    setChecked(updatedChecked);

    const updatedProgress = Math.round((updatedChecked.length / subtopics.length) * 100);
    setProgress(updatedProgress);

    const user = auth.currentUser;
    if (!user) return;

    await setDoc(
      doc(db, "users", user.uid, "progress", "LogicalReasoning"),
      {
        progress:  updatedProgress,
        checked: updatedChecked,
      },
      { merge: true }
    );
  };

  return (
    <div className="subject-wrapper">
      <h2 className="subject-header">Logical reasoning</h2>
      <p className="progress-info">Progress: {progress}%</p>
      <div className="subtopics-list">
        {subtopics.map((topic, index) => (
          <label key={index} className="checkbox-label">
            <input
              type="checkbox"
              checked={checked.includes(index)}
              onChange={() => handleCheckboxChange(index)}
            />
            {topic}
          </label>
        ))}
      </div>
    </div>
  );
}
