// Study.js
import React, { useState, useEffect } from 'react';
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import './Study.css';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';



export default function Study() {
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [todaySeconds, setTodaySeconds] = useState(0);
  const [studyLogs, setStudyLogs] = useState([
    { activity: 'Completed: TOC Regular Languages', date: '6 June' },
    { activity: 'Watched: Network Layer Video', date: '5 June' },
  ]);

  const tips = [
    'Revise within 24 hours to retain better!',
    'Use active recall, not passive reading.',
    'Short breaks improve long-term focus.',
  ];
 

  const motivationalQuotes = [
    'Push yourself, because no one else is going to do it for you.',
    'Great things never come from comfort zones.',
    'Don’t stop until you’re proud.',
    'You don’t have to be great to start, but you have to start to be great.',
    'One year of focused effort can change your entire life.',
    'Success in GATE is not about intelligence; it’s about consistency.',
    'Every mock test, every revision, every solved problem is building your success story.'
  ];

  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionStart, setSessionStart] = useState(null);
  const [studySessions, setStudySessions] = useState([]);
  const [subjectProgress, setSubjectProgress] = useState([]); 
  



  const [consistencyMap, setConsistencyMap] = useState({
    '2025-06-06': 120,
    '2025-06-05': 90,
    '2025-06-04': 45,
  });

  const [currentTip, setCurrentTip] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 30000); // Change every 30 seconds
    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
        setTodaySeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

        useEffect(() => {
  const fetchSubjectProgress = async () => {
    const authInstance = getAuth();
    const user = authInstance.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "userProgress", user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const subjectData = data.subjectProgress || {};

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
        progress: subjectData[key] || 0,
      }));

      setSubjectProgress(updatedSubjects);

      
    }
  };

  fetchSubjectProgress();
}, []);



  const toggleTimer = () => {
    if (!isTimerRunning) {
      setSessionStart(new Date());
    } else {
      const sessionEnd = new Date();
      const durationMin = Math.floor((sessionEnd - sessionStart) / 60000);
      if (durationMin > 0) {
        const newSession = {
          start: sessionStart.toLocaleTimeString(),
          end: sessionEnd.toLocaleTimeString(),
          duration: durationMin
        };
        setStudySessions((prev) => [...prev, newSession]);

        const today = new Date().toISOString().split('T')[0];
        setConsistencyMap((prev) => ({
          ...prev,
          [today]: (prev[today] || 0) + durationMin
        }));
      }
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const handleAddTodo = () => {
    if (todo.trim()) {
      setTodoList([...todoList, { text: todo, completed: false }]);
      setTodo('');
    }
  };

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${h} hrs ${m} min`;
  };

  const today = new Date().toISOString().split('T')[0];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - startDate.getDay()); // start from Sunday
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="study-wrapper">
      <h2 className="study-header">📚 Study Section</h2>
      <div className="study-grid">
        {/* Daily To-Do */}
        <div className="study-card">
         <h3>✅ Daily To-Do</h3>
            <input value={todo} onChange={(e) => setTodo(e.target.value)} placeholder="New task" />
            <button onClick={handleAddTodo}>Add</button>

              <div className="todo-scroll">
               <ul className="todo-list">
                   {todoList.map((item, idx) => (
                   <li key={idx} className="todo-item">
                     <label>
                     <input
                          type="checkbox"
                        checked={item.completed}
                       onChange={() => {
                         const updated = [...todoList];
                         updated[idx].completed = !updated[idx].completed;
                           setTodoList(updated);
                           }}
                     />
                      <span className={item.completed ? "task-done" : ""}>{item.text}</span>
                      </label>
                   </li>
                ))}
               </ul>
             </div>
            </div>


            <div className="study-card">
          <h3>📅 Weekly Planner</h3>
          <ul>
            <li>Mon - DBMS</li>
            <li>Tue - Algorithms</li>
            <li>Wed - OS</li>
            <li>Thu - Aptitude</li>
            <li>Fri - COA</li>
            <li>Sat - Mock Test</li>
            <li>Sun - Revision</li>
          </ul>
        </div>

          {/* Subject-wise Progress from Firebase */}
           <div className="study-card">
                <h3>Subject Wise Level📚</h3>
                  <div className="subject-scroll">
                 {subjectProgress.map((subject, index) => (
                  <div className="subject-item" key={index}>
                 <span>{subject.name}</span>
                   <div className="progress-bar">
                    <div
                      className="progress-fill"
                     style={{ width: `${subject.progress}%` }}
                     ></div>
                   <span className="progress-text">{subject.progress}%</span>
                  </div>
                    </div>
                ))}
              </div>
            </div>


        {/* Focus Timer */}
        <div className="study-card">
          <h3>⏱ Focus Timer</h3>
          <p>{formatTime(timerSeconds)} focused</p>
          <button onClick={toggleTimer}>{isTimerRunning ? 'Pause' : 'Start'} Timer</button>
          <div className="session-log">
            <h4>Today's Sessions</h4>
            <ul>
              {studySessions.map((s, idx) => (
                <li key={idx}>{s.start} → {s.end} ({s.duration} min)</li>
              ))}
            </ul>
          </div>
        </div>

        

        {/* Logs and Goals */}
        

        <div className="study-card">
          <h3>💬 Tips & Motivation</h3>
          <p><em>{tips[currentTip]}</em></p>
          <p><strong>{motivationalQuotes[currentQuote]}</strong></p>
        </div>

        <div className="study-card">
          <h3>📌 Pinned Resources</h3>
          <ul>
            <li><a href="https://www.dbvis.com/wp-content/uploads/2024/04/SQL-Cheat-Sheet.pdf">DBMS Cheatsheet</a></li>
            <li><a href="https://sriindu.ac.in/wp-content/uploads/2023/10/R20CSE2202-OPERATING-SYSTEMS.pdf">OS PDF</a></li>
            <li><a href="https://www.youtube.com/watch?v=edYU2sksPSs">Aptitude Tricks Video</a></li>
          </ul>
        </div>

            <div className="study-card">
          <h3>🧪 Mock Test Suggestion</h3>
          <p>Try Full-Length Test 2 </p>
        </div>

            <div className="study-card">
          <h3>🎯 This Week’s Goal</h3>
          <p> Complete 5 topics| <strong>0/5 Completed ✅</strong></p>
        </div>



           <div className="study-card">
            <h3>🕐 Hours Studied Today</h3>
            <div className="hours-content">
               <div className="lottie-box">
                    <DotLottieReact
                     src="https://lottie.host/39752153-661b-4a83-b6c3-d19751e63ac9/rcjRnzbDk5.lottie"
                      loop
                      autoplay
                 />
                 </div>
               <div className="hours-text">
                  <p><strong>{formatTime(todaySeconds)}</strong></p>

              <p><em>Keep it up!</em></p>
              </div>
            </div>
             </div>

      </div>
    </div>
  );
}
