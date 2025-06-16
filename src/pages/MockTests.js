import React, { useState, useEffect } from "react";
import "./MockTests.css";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const allSubjects = [
  "All",
  "Digital Logic",
  "COA",
  "Algorithms",
  "TOC",
  "OS",
  "DBMS",
  "Networks",
  "Engineering Mathematics",
  "Verbal Ability",
  "Numerical Ability",
  "Logical Reasoning",
  "Full Length",
];

export default function MockTest() {
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [testsData, setTestsData] = useState([]);
  const navigate = useNavigate();
  const uid = auth.currentUser?.uid;

  const allTests = [
    { name: "Digital Logic Test", subject: "Digital Logic" },
    { name: "COA Test", subject: "COA" },
    { name: "Algorithms Test", subject: "Algorithms" },
    { name: "TOC Test", subject: "TOC" },
    { name: "OS Test", subject: "OS" },
    { name: "DBMS Test", subject: "DBMS" },
    { name: "Networks Test", subject: "Networks" },
    { name: "Engg Maths Test", subject: "Engineering Mathematics" },
    { name: "Verbal Test", subject: "Verbal Ability" },
    { name: "Numerical Test", subject: "Numerical Ability" },
    { name: "Reasoning Test", subject: "Logical Reasoning" },
    { name: "Full Test 1", subject: "Full Length" },
    { name: "Full Test 2", subject: "Full Length" },
    { name: "Full Test 3", subject: "Full Length" },
  ];

  useEffect(() => {
    const fetchTestResults = async () => {
      if (!uid) return;

      const ref = doc(db, "testResults", uid);
      const snap = await getDoc(ref);
      const resultData = snap.exists() ? snap.data() : {};

      const mergedData = allTests.map(test => {
        const firebaseResult = resultData[test.name.replace(/\s+/g, "")];
        return {
          ...test,
          score: firebaseResult?.score ?? 0,
          status: firebaseResult?.status ?? "Not Started",
        };
      });

      setTestsData(mergedData);
    };

    fetchTestResults();
  }, [uid]);

  const filteredTests =
    selectedSubject === "All"
      ? testsData
      : testsData.filter((test) => test.subject === selectedSubject);

  return (
    <div className="mocktest-wrapper">
      <h2>Mock Test Overview📑</h2>

      <div className="stats-bar">
        <div>Total Tests: {filteredTests.length}</div>
        <div>Completed: {filteredTests.filter((t) => t.status === "Completed").length}</div>
        <div>
          Average Score:{" "}
            {filteredTests.length > 0
           ? Math.round(
              filteredTests.reduce((acc, t) => acc + t.score, 0) / filteredTests.length
             )
           : 0}

        </div>

      </div>

      <div className="filter-section">
        <label>Filter by Subject:</label>
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
          {allSubjects.map((subj) => (
            <option key={subj} value={subj}>
              {subj}
            </option>
          ))}
        </select>
      </div>

      <div className="mocktest-grid">
        {filteredTests.map((test, idx) => (
          <div
            key={idx}
            className="mocktest-card"
            onClick={() => navigate(`/mocktest/${test.name.replace(/\s+/g, "")}`)}
          >
            <h3>{test.name}</h3>
            <p><strong>Subject:</strong> {test.subject}</p>
            <p><strong>Score:</strong> {test.score}</p>
            <p><strong>Status:</strong> {test.status}</p>
          </div>
        ))}
      </div>

      <div className="tips-section">
        <h3>Tips for Improvement:</h3>
        <ul>
          <li>Take at least 1 full-length test every week.</li>
          <li>Analyze your mistakes thoroughly after every test.</li>
          <li>Revise weak subjects regularly.</li>
          <li>Focus more on time-bound practice.</li>
        </ul>
      </div>

      <div className="rocket-container">
        <div className="rocket">
          <DotLottieReact
            src="https://lottie.host/b76856a2-5df1-44a9-899b-8e93e3a5f9de/26nCK29x53.lottie"
            autoplay
            loop
            style={{ width: "100px", height: "100px" }}
          />
        </div>
      </div>
    </div>
  );
}
