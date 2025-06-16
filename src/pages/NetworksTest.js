import React, { useEffect, useState } from "react";
import "./DigitalLogicTest.css";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const questions = [
  {
    question: "Which layer of the OSI model is responsible for end-to-end delivery?",
    options: [
      "Network Layer",
      "Transport Layer",
      "Session Layer",
      "Data Link Layer",
    ],
    answer: "Transport Layer",
  },
  {
    question: "Which of the following protocols is **connectionless** and **unreliable**?",
    options: ["TCP", "UDP", "FTP", "SMTP"],
    answer: "UDP",
  },
  {
    question: "What is the **subnet mask** for a network with 64 hosts?",
    options: ["255.255.255.192", "255.255.255.224", "255.255.255.240", "255.255.255.128"],
    answer: "255.255.255.192", // → 64 hosts = 2^6 → 32-6 = /26
  },
  {
    question: "Which protocol is used to dynamically assign IP addresses to devices?",
    options: ["ARP", "ICMP", "DHCP", "DNS"],
    answer: "DHCP",
  },
  {
    question: "Which of the following is a **distance vector routing protocol**?",
    options: ["OSPF", "BGP", "RIP", "IS-IS"],
    answer: "RIP",
  },
  {
    question: "TCP uses which method to avoid congestion?",
    options: ["Go-Back-N", "Slow Start", "CSMA/CD", "Sliding Window"],
    answer: "Slow Start",
  },
  {
    question: "Which of the following is used for **error detection**?",
    options: ["CRC", "Hamming Code", "Sliding Window", "Stop and Wait"],
    answer: "CRC",
  },
  {
    question: "Which of the following **correctly maps** to the TCP/IP model?",
    options: [
      "Transport - Network layer",
      "Internet - Data link layer",
      "Application - Session, Presentation, Application",
      "Network Interface - Transport layer",
    ],
    answer: "Application - Session, Presentation, Application",
  },
];

export default function NetworksTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [status, setStatus] = useState("In Progress");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const uid = auth.currentUser?.uid;
  const testId = "NetworksTest";

  useEffect(() => {
    const fetchSavedTest = async () => {
      const ref = doc(db, "testResults", uid);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data()[testId]) {
        const saved = snap.data()[testId];
        setCurrentQuestion(saved.currentQuestion || 0);
        setScore(saved.score || 0);
        setStatus(saved.status);
        setIsCompleted(saved.status === "Completed");
      }
    };

    if (uid) fetchSavedTest();

    const handleBeforeUnload = () => {
      if (!isCompleted) saveProgress("Discontinued");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [uid, isCompleted]);

  const saveProgress = async (saveStatus) => {
    if (!uid) return;
    const ref = doc(db, "testResults", uid);
    await setDoc(ref, {
      [testId]: {
        currentQuestion,
        score,
        status: saveStatus,
      },
    }, { merge: true });
  };

  const handleSubmit = () => {
    const correct = selectedOption === questions[currentQuestion].answer;
    if (correct) setScore((prev) => prev + 1);
    setIsCorrect(correct);
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      setIsCompleted(true);
      setStatus("Completed");
      saveProgress("Completed");
    }
  };

  const handleContinue = () => setStatus("In Progress");

  const formatTime = () => {
    const totalSeconds = Math.floor((Date.now() - startTime) / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  if (!uid) return <div>Please log in to take the test.</div>;

  return (
    <div className="digital-test-wrapper">
      <h2>Computer Networks Test 🌐</h2>
      <div className="timer">Time Elapsed: {formatTime()}</div>

      {status === "Discontinued" && !isCompleted && (
        <div className="continue-box">
          <p>You left the test unfinished.</p>
          <button onClick={handleContinue}>Continue Test</button>
        </div>
      )}

      {!isCompleted ? (
        <div className="question-card">
          <h3>Q{currentQuestion + 1}: {questions[currentQuestion].question}</h3>
          <ul>
            {questions[currentQuestion].options.map((option, idx) => (
              <li key={idx}>
                <label className={showAnswer && option === questions[currentQuestion].answer ? "correct" : ""}>
                  <input
                    type="radio"
                    name="option"
                    value={option}
                    disabled={showAnswer}
                    checked={selectedOption === option}
                    onChange={() => setSelectedOption(option)}
                  />
                  {option}
                </label>
              </li>
            ))}
          </ul>

          {!showAnswer ? (
            <button disabled={!selectedOption} onClick={handleSubmit}>Submit</button>
          ) : (
            <div>
              <p className={isCorrect ? "feedback correct-text" : "feedback wrong-text"}>
                {isCorrect ? "✅ Correct!" : "❌ Wrong! Correct answer: " + questions[currentQuestion].answer}
              </p>
              <button onClick={handleNext}>Next Question</button>
            </div>
          )}
        </div>
      ) : (
        <div className="score-section">
          <h3>Test Completed ✅</h3>
          <p>Your Score: {score} / {questions.length}</p>
        </div>
      )}
    </div>
  );
}
