// Subjects.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./Subjects.css";


const COLORS = ["#00C49F", "#f0f0f0"];

const staticSubjects = [
  {
    name: "Engineering Mathematics",
    subtopics: ["Discrete Mathematics", "Linear Algebra", "Calculus", "Probability"],
    progress: 0, // default until fetched from Firestore
  },
  { name: "Algorithms", progress: 0 },
  { name: "Theory of Computation (TOC)", progress: 0 },
  { name: "Compiler Design", progress: 0 },
  { name: "Operating System (OS)", progress: 0 },
  { name: "Databases (DBMS)", progress: 0 },
  { name: "Computer Networks", progress: 0 },
  { name: "Software Engineering and Web Technologies", progress: 0 },
  { name: "Digital Logic", progress: 0 },
  { name: "Computer Organization and Architecture (COA)", progress: 0 },
  {
    name: "Programming and Data Structures",
    subtopics: ["C Programming", "Data Structures (Stacks, Queues, Trees, Graphs, etc.)"],
    progress: 0,
  },
];

export default function Subjects() {
  const [subjects, setSubjects] = useState(staticSubjects);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchProgress = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "userProgress", user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // Map UI subject names to Firestore keys
      const firestoreNameMap = {
         "Engineering Mathematics": "EngineeringMathematics",
         "Algorithms": "Algorithms",
         "Theory of Computation (TOC)": "TOC",
         "Compiler Design": "CompilerDesign",
         "Operating System (OS)": "OperatingSystem",
         "Databases (DBMS)": "DBMS",
         "Computer Networks": "ComputerNetworks",
         "Software Engineering and Web Technologies": "SoftwareEngineering",
         "Digital Logic": "DigitalLogic",
         "Computer Organization and Architecture (COA)": "COA",
         "Programming and Data Structures": "PDS",
};


      const updatedSubjects = subjects.map((subj) => {
        const key = firestoreNameMap[subj.name];
        if (key) {
          return {
            ...subj,
            progress: data.subjectProgress?.[key] || 0,
          };
        }
        return subj;
      });

      setSubjects(updatedSubjects);
    }
  };

  fetchProgress();
}, []);


  function openSubject(name) {
    navigate(`/subject/${encodeURIComponent(name)}`);
  }

  return (
    <div className="subjects-wrapper">
      <h2 className="subjects-header">Core Subjects📚</h2>
      <div className="subjects-grid">
        {subjects.map((subject, index) => (
          <div
            key={index}
            className="subject-card"
            onClick={() => openSubject(subject.name)}
          >
            <h3>{subject.name}</h3>
            {subject.subtopics && (
              <ul>
                {subject.subtopics.map((topic, i) => (
                  <li key={i}>{topic}</li>
                ))}
              </ul>
            )}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <PieChart width={120} height={120}>
                <Pie
                  dataKey="value"
                  data={[
                    { name: "Completed", value: subject.progress },
                    { name: "Remaining", value: 100 - subject.progress },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  fill="#8884d8"
                  paddingAngle={5}
                  label
                >
                  <Cell key="completed" fill={COLORS[0]} />
                  <Cell key="remaining" fill={COLORS[1]} />
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
            <p className="progress-text">{subject.progress}% Completed</p>
          </div>
        ))}
      </div>
    </div>
  );
}
