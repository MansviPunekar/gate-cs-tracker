// Dashboard.js
import React, { useState, useEffect } from "react";
//import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDatabase, ref, get } from "firebase/database";


import { db } from "../firebase";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6492"];


const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

  function generateCalendarDays(month, year, studyDaysSet) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const isoDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

    days.push({
      date: date.toDateString(),
      day: i,
      active: studyDaysSet.has(isoDate),
    });
  }
  return days;
  }




export default function Dashboard() {
  const [coreSubjects, setCoreSubjects] = useState([]);
  const [aptitudeSubjects, setAptitudeSubjects] = useState([]);
  const [mockStats, setMockStats] = useState({
  completed: 0,
  total: 0,
  percentage: 0,
  lastDate: null,
  chartData: [],
   });

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const navigate = useNavigate();

  
  const [calendarDays, setCalendarDays] = useState([]);
  const [username, setUsername] = useState("User");
  

    useEffect(() => {
  const fetchUsername = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const db = getDatabase();
    const userRef = ref(db, "users/" + user.uid);

    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUsername(data.username || "User");
      }
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  fetchUsername();
}, []);



  useEffect(() => {
    const fetchProgress = async () => {
      const authInstance = getAuth();
      const user = authInstance.currentUser;
      if (!user) return;

      const userDocRef = doc(db, "userProgress", user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const subjectProgress = data.subjectProgress || {};

        const mappedSubjects = [
          { name: "Engineering Mathematics", key: "EngineeringMathematics" },
          { name: "Digital Logic", key: "DigitalLogic" },
          { name: "COA", key: "COA" },
          { name: "Algorithms", key: "Algorithms" },
          { name: "TOC", key: "TOC" },
          { name: "OS", key: "OperatingSystem" },
          { name: "DBMS", key: "DBMS" },
          { name: "Networks", key: "ComputerNetworks" },
          { name: "Compiler Design", key: "CompilerDesign" },
          { name: "SoftwareEng. & Web Technologies", key: "SoftwareEngineering" },
          { name: "PDS", key: "PDS" },
        ];

        const updatedSubjects = mappedSubjects.map(({ name, key }) => ({
          name,
          progress: subjectProgress[key] || 0.0,
        }));

        setCoreSubjects(updatedSubjects);
      }
    };

    fetchProgress();
  }, []);

   useEffect(() => {
  const fetchAptitudeProgress = async () => {
    const authInstance = getAuth();
    const user = authInstance.currentUser;
    if (!user) return;

    const topics = ["VerbalAbility", "NumericalAbility", "LogicalReasoning"];
    const updatedData = [];

    for (const topic of topics) {
      const ref = doc(db, "users", user.uid, "progress", topic);
      const snap = await getDoc(ref);
      const readableName = topic.replace(/([A-Z])/g, " $1").trim();

      if (snap.exists()) {
        updatedData.push({
          name: readableName,
          progress: snap.data().progress || 0.0,
        });
      } else {
        updatedData.push({
          name: readableName,
          progress: 0.0,
        });
      }
    }

    setAptitudeSubjects(updatedData);
  };

     fetchAptitudeProgress();
   }, []);
  
     useEffect(() => {
     const fetchMockProgress = async () => {
    const authInstance = getAuth();
    const user = authInstance.currentUser;
    if (!user) return;

    const ref = doc(db, "testResults", user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const tests = snap.data(); // keyed by testName
    const testNames = Object.keys(tests);
    const completed = testNames.filter(name => tests[name].status === "Completed").length;
    const total = 12; // adjust if you have 12 mock tests
    const percentage = total ? Math.round((completed / total) * 100) : 0;

    // Build chart data (only scores shown, no timestamp needed)
    const chartData = testNames
      .filter(name => tests[name].score !== undefined)
      .map((name, idx) => ({
        name: `Test ${idx + 1}`,
        score: tests[name].score,
      }));

    setMockStats({ completed, total, percentage, lastDate: null, chartData });
  };

  fetchMockProgress();
}, []);


useEffect(() => {
  const trackAndFetchStudyDays = async () => {
    const authInstance = getAuth();
    const user = authInstance.currentUser;
    if (!user) return;

    const userRef = doc(db, "studyLog", user.uid);
    const snap = await getDoc(userRef);

    const today = new Date();
    const todayISO = today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");

    let existingDays = [];

    if (snap.exists()) {
      existingDays = snap.data().days || [];
    }

    // Add today's date if not already present
    if (!existingDays.includes(todayISO)) {
      existingDays.push(todayISO);
      await setDoc(userRef, { days: existingDays }, { merge: true });
    }

    const daysThisMonth = new Set(
      existingDays.filter(d => {
        const dt = new Date(d);
        return dt.getMonth() === month && dt.getFullYear() === year;
      })
    );

    const cal = generateCalendarDays(month, year, daysThisMonth);
    setCalendarDays(cal);
  };

  trackAndFetchStudyDays();
}, [month, year]);




  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <h2 className="dashboard-header">Welcome, {username} 😁</h2>

      <div className="dashboard-grid">
        {/* Core Subjects Progress */}
        <div
          className="dashboard-card"
          onClick={() => navigate("/subjects")}
        >
          <h3>Core Subjects Progress</h3>
          <PieChart width={200} height={200}>
            <Pie
              data={coreSubjects}
              cx={100}
              cy={100}
              outerRadius={80}
              fill="#8884d8"
              dataKey="progress"
              nameKey="name"
              label
            >
              {coreSubjects.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <ul className="subject-labels">
            {coreSubjects.map((s, idx) => (
              <li key={s.name} style={{ color: COLORS[idx % COLORS.length] }}>
                • {s.name}
              </li>
            ))}
          </ul>
        </div>

        {/* General Aptitude Progress */}
        <div className="dashboard-card" onClick={() => navigate("/aptitude")}>
          <h3>General Aptitude Progress</h3>
          <PieChart width={200} height={200}>
            <Pie
              data={aptitudeSubjects}
              cx={100}
              cy={100}
              outerRadius={80}
              fill="#8884d8"
              dataKey="progress"
              nameKey="name"
              label
            >
              {aptitudeSubjects.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <ul className="subject-labels">
            {aptitudeSubjects.map((s, idx) => (
              <li key={s.name} style={{ color: COLORS[idx % COLORS.length] }}>
                • {s.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Mock Test Summary */}
        <div className="dashboard-card" onClick={() => navigate("/mocktest")}>
            <h3>Mock Test Progress</h3>
           <p>
              You have completed <strong>{mockStats.completed}</strong> out of <strong>{mockStats.total}</strong> mock tests.
           </p>
            <p>Completion: <strong>{mockStats.percentage}%</strong></p>
            {mockStats.lastDate && (
              <>
                     <p>Last test taken on: <strong>{mockStats.lastDate.toLocaleDateString()}</strong></p>
                  <p>
                     Next scheduled test: <strong>
                     {new Date(mockStats.lastDate.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                   </strong>
                  </p>
               </>
            )}
            <p style={{ color: "#00c49f" }}>
              Keep up the good work! Consistency is key to cracking GATE.
           </p>
             <LineChart width={250} height={150} data={mockStats.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#8884d8" />
             </LineChart>

        </div>


        {/* Study Calendar */}
        <div
          className="dashboard-card calendar-section small-calendar"
          onClick={() => navigate("/Study")}
        >
          <h3>Study days</h3>
          <div className="calendar-header">
            <br />
            <button onClick={handlePrevMonth}>←</button>
            <span>
              {new Date(year, month).toLocaleString("default", {
                month: "long",
              })}{" "}
              {year}
            </span>
            <button onClick={handleNextMonth}>→</button>
          </div>
          <div className="calendar-grid">
            {calendarDays.map((d, idx) => (
              <div
                key={idx}
                className={`calendar-day ${d.active ? "active" : ""}`}
                title={d.date}
              >
                {d.day}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="dashboard-footer">© 2025 GATE CS Tracker</div>
    </div>
  );
}
