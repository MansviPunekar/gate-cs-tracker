import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./Aptitude.css";

const COLORS = ["#00C49F", "#f0f0f0"];

export default function Aptitude() {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState({
    "Verbal Ability": 0,
    "Numerical Ability": 0,
    "Logical Reasoning": 0,
  });

   useEffect(() => {
  const fetchProgress = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const topics = ["VerbalAbility", "NumericalAbility", "LogicalReasoning"];
    const updatedData = {};

    for (const topic of topics) {
      const ref = doc(db, "users", user.uid, "progress", topic);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        updatedData[topic.replace(/([A-Z])/g, ' $1').trim()] = snap.data().progress || 0;
      } else {
        updatedData[topic.replace(/([A-Z])/g, ' $1').trim()] = 0;
      }
    }

    setProgressData(updatedData);
  };

  fetchProgress();
}, []);


  const aptitudeTopics = [
    { name: "Verbal Ability", path: "/aptitude/verbal" },
    { name: "Numerical Ability", path: "/aptitude/numerical" },
    { name: "Logical Reasoning", path: "/aptitude/reasoning" },
  ];

  return (
    <div className="aptitude-wrapper">
      <h2 className="aptitude-header">Aptitude Section</h2>
      <div className="aptitude-grid">
        {aptitudeTopics.map((topic, index) => {
          const progress = progressData[topic.name] || 0;

          return (
            <div
              key={index}
              className="aptitude-card"
              onClick={() => navigate(topic.path)}
              style={{ cursor: "pointer" }}
            >
              <h3>{topic.name}</h3>
              <div className="pie-wrapper">
                <PieChart width={140} height={140}>
                  <Pie
                    dataKey="value"
                    data={[
                      { name: "Completed", value: progress },
                      { name: "Remaining", value: 100 - progress },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    fill="#8884d8"
                    paddingAngle={5}
                  >
                    <Cell key="completed" fill={COLORS[0]} />
                    <Cell key="remaining" fill={COLORS[1]} />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
              <p className="progress-text">{progress}% Completed</p>
            </div>
          );
        })}
      </div>

      <div className="animation-section">
        <DotLottieReact
          src="https://lottie.host/3c2d25b3-7866-4ee2-a88f-219a505faa0e/ouJOw5Rj8H.lottie"
          loop
          autoplay
          style={{ width: "400px", height: "200px", margin: "auto" }}
        />
      </div>
    </div>
  );
}
