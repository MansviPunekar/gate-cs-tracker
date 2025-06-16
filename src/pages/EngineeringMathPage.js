// EngineeringMathPage.js
import React, { useState, useEffect } from "react";
import { ref, set } from "firebase/database";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./EngineeringMathPage.css";

const topics = [
  {
    name: "Discrete Mathematics",
    subtopics: [
      { name: "Graph Theory", video: "https://www.youtube.com/embed/videoseries?list=PL3eEXnCBViH-T76wHeHTlp6hoD-inQLPp", notes: "Graph theory helps in modeling networks like social media, transport, etc." },
      { name: "Proposition Logic", video: "https://www.youtube.com/embed/7zjhic8uTR4", notes: "Focus on truth tables and logical equivalences." },
      { name: "Inference Rule", video: "https://www.youtube.com/embed/a5HbV3AKE9I", notes: "Understand Modus Ponens and Modus Tollens thoroughly." },
      { name: "Predicate Logic", video: "https://www.youtube.com/embed/VA_5ho3BSyw", notes: "Quantifiers are crucial here." },
      { name: "Quantifier", video: "https://www.youtube.com/embed/fjgo2FEBJRY", notes: "Practice translating English statements to logic." },
      { name: "Set Theory", video: "https://www.youtube.com/embed/TfF9tK_xzKM", notes: "Venn diagrams help a lot!" },
      { name: "Combinatorics", video: "https://www.youtube.com/embed/kEU18I-WTWI", notes: "Permutations vs combinations is a key topic." }
    ]
  },
  {
    name: "Linear Algebra",
    subtopics: [
      {
        name: "Matrix Operations",
        video: "https://www.youtube.com/embed/videoseries?list=PLU6SqdYcYsfKV1QmzQNtzMuIH7mq5qb62",
        notes: "Revise matrix addition, subtraction, and multiplication rules."
      },
      {
        name: "Types of matrix and transpose",
        video: "https://www.youtube.com/embed/oWtoDPiZQJg",
        notes: "Understand different types like diagonal, symmetric, and skew-symmetric matrices."
      },
      {
        name: "Trace and determinant of matrix",
        video: "https://www.youtube.com/embed/heGf81kVM8s",
        notes: "Practice calculating trace and determinant with 2x2 and 3x3 matrices."
      },
      {
        name: "Eigen values and eigen vectors",
        video: "https://www.youtube.com/embed/cHLN0Pqt_7U",
        notes: "Focus on the process of finding eigenvalues and corresponding eigenvectors."
      },
      {
        name: "Properties of eigen values",
        video: "https://www.youtube.com/embed/o36hfDFq0yU",
        notes: "Revise key properties like the sum and product of eigenvalues."
      },
      {
        name: "Rank of matrix",
        video: "https://www.youtube.com/embed/q0P5j1ti3tg",
        notes: "Learn how to calculate rank using echelon form."
      },
      {
        name: "Homogeneous system of Linear Equation",
        video: "https://www.youtube.com/embed/tC4PsuzFdDI",
        notes: "Understand how to determine trivial and non-trivial solutions."
      },
      {
        name: "Non Homogeneous system of Linear Equation",
        video: "https://www.youtube.com/embed/7gY8RIyFK9w",
        notes: "Apply row reduction techniques to find unique or infinite solutions."
      },
      {
        name: "Basic and Dimension concept LI and LD",
        video: "https://www.youtube.com/embed/G18Xffee7go",
        notes: "Differentiate between linearly independent and dependent sets."
      },
      {
        name: "Gate PYQ's",
        video: "https://www.youtube.com/embed/WnGFr87B91I",
        notes: "Solve previous year GATE questions to understand exam pattern."
      },
      {
        name: "Tricks to Solve GATE PYQ",
        video: "https://www.youtube.com/embed/eF4XyTfNbJY",
        notes: "Learn shortcut techniques to improve problem-solving speed."
      }
    ]
  },
  {
    name: "Calculus",
    subtopics: [
      {
        name: "Limits & Continuity",
        video: "https://www.youtube.com/embed/videoseries?list=PLMaNnDEjr-rVge4AwyNE8sVhfr-UD2b1g",
        notes: "Focus on epsilon-delta definition and L'Hôpital's Rule."
      },
      {
        name: "Maxima and Minima",
        video: "https://www.youtube.com/embed/zSxjnhH-H9o",
        notes: "Understand critical points and second derivative test."
      },
      {
        name: "Maxima and minima for single variable",
        video: "https://www.youtube.com/embed/MJXDwT2B0Ko",
        notes: "Learn to find turning points using first and second derivatives."
      },
      {
        name: "Integral Calculus part 1",
        video: "https://www.youtube.com/embed/CwkwvYJ3eQw",
        notes: "Revise indefinite integrals and standard formulas."
      },
      {
        name: "Integral Calculus part 2",
        video: "https://www.youtube.com/embed/CnLfO5Io6bI",
        notes: "Practice definite integrals and properties of integrals."
      },
      {
        name: "Gradient Divergence",
        video: "https://www.youtube.com/embed/mrbQXm8SnM0",
        notes: "Understand geometric meaning and directional derivatives."
      },
      {
        name: "Double and triple Integrals",
        video: "https://www.youtube.com/embed/bYzsHw6rmnI",
        notes: "Practice changing order of integration and coordinate transformations."
      },
      {
        name: "Green Gauss and Stokes Theorem",
        video: "https://www.youtube.com/embed/4SzRJqFvuGw",
        notes: "Focus on vector field interpretation and theorem conditions."
      },
      {
        name: "GATE 2019 Exam solution (Part 1)",
        video: "https://www.youtube.com/embed/nk0hskA7Igc",
        notes: "Analyze how to apply calculus concepts to solve real GATE questions."
      },
      {
        name: "GATE 2019 Exam solution (Part 2)",
        video: "https://www.youtube.com/embed/UIimQGag6Gg",
        notes: "Review tricky GATE calculus problems with shortcuts."
      }
    ]
  },
  {
    name: "Probability",
    subtopics: [
      { name: "Basic Probability", video: "https://www.youtube.com/embed/videoseries?list=PLC36xJgs4dxEkYU5dl5n8rWO-2WFoF43-", notes: "Work through sample space examples." },
      { name: "Random Variables", video: "https://www.youtube.com/embed/BRRolKTlF6Q", notes: "Discrete vs Continuous understanding is key." }
    ]
  }
];

export default function EngineeringMathPage() {
  const [checked, setChecked] = useState({});
  const user = auth.currentUser;
  
  const uid = user?.uid;
  const userProgressRef = uid ? doc(db, "userProgress", uid) : null;

  // ✅ These are moved below state so no ReferenceError
  const totalSubtopics = topics.reduce((acc, t) => acc + t.subtopics.length, 0);
  const completedSubtopics = Object.values(checked).filter(Boolean).length;
  const overallProgress = Math.round((completedSubtopics / totalSubtopics) * 100);

  useEffect(() => {
  const fetchData = async () => {
    if (userProgressRef) {
      const docSnap = await getDoc(userProgressRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.engineeringMathChecked) {
          setChecked(data.engineeringMathChecked);
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

    const totalSubtopics = topics.reduce((acc, t) => acc + t.subtopics.length, 0);
    const completedSubtopics = Object.values(updated).filter(Boolean).length;
    const overallProgress = Math.round((completedSubtopics / totalSubtopics) * 100);

    if (userProgressRef) {
      await setDoc(
        userProgressRef,
        {
          engineeringMathChecked: updated,
          subjectProgress: {
            EngineeringMathematics: overallProgress,
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
      <h2>📘 Engineering Mathematics</h2>
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
