import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./VerbalAbility.css";

const subtopics = [
  "Number Systems",
  "Percentages",
  "Profit and Loss",
  "Time and Work",
  "Time, Speed and Distance",
  "Averages",
  "Ratio and Proportion",
  "Simple and Compound Interest",
  "Mixtures and Alligations",
  "Mensuration",
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
     doc(db, "users", user.uid, "progress", "NumericalAbility"),
      {
        progress: updatedProgress,
        checked: updatedChecked,
      },
      { merge: true }
    );
  };

  return (
    <div className="subject-wrapper">
      <h2 className="subject-header">Numerical Ability</h2>
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
