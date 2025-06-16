import React, { useEffect, useState } from "react";
import "./DigitalLogicTest.css"; // Reusing same style
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const questions = [
  {
    question: "What is the worst-case time complexity of Quick Sort?",
    options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
    answer: "O(n^2)",
  },
  {
    question: "Which data structure is used in a recursive algorithm call stack?",
    options: ["Queue", "Heap", "Stack", "Tree"],
    answer: "Stack",
  },
  {
    question: "Which of the following algorithms uses a divide-and-conquer approach?",
    options: ["Bubble Sort", "Merge Sort", "Selection Sort", "Insertion Sort"],
    answer: "Merge Sort",
  },
  {
    question: "Which traversal order is used in Depth First Search (DFS)?",
    options: [
      "Level by level",
      "Breadth-wise",
      "Preorder traversal",
      "Postorder traversal",
    ],
    answer: "Preorder traversal",
  },
  {
    question: "If an algorithm has time complexity O(2^n), it is considered:",
    options: ["Linear", "Polynomial", "Logarithmic", "Exponential"],
    answer: "Exponential",
  },
  {
    question: "Which of the following is NOT a stable sorting algorithm?",
    options: ["Merge Sort", "Bubble Sort", "Quick Sort", "Insertion Sort"],
    answer: "Quick Sort",
  },
  {
    question: "Dijkstra’s algorithm solves which of the following problems?",
    options: [
      "Minimum spanning tree",
      "Single-source shortest path",
      "Topological sorting",
      "Maximum flow",
    ],
    answer: "Single-source shortest path",
  },
];

export default function AlgorithmsTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [status, setStatus] = useState("In Progress");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const uid = auth.currentUser?.uid;
  const testId = "AlgorithmsTest";

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
    await setDoc(
      ref,
      {
        [testId]: {
          currentQuestion,
          score,
          status: saveStatus,
        },
      },
      { merge: true }
    );
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
      <h2>Algorithms Test 🧠</h2>
      <div className="timer">Time Elapsed: {formatTime()}</div>

      {status === "Discontinued" && !isCompleted && (
        <div className="continue-box">
          <p>You left the test unfinished.</p>
          <button onClick={handleContinue}>Continue Test</button>
        </div>
      )}

      {!isCompleted ? (
        <div className="question-card">
          <h3>
            Q{currentQuestion + 1}: {questions[currentQuestion].question}
          </h3>
          <ul>
            {questions[currentQuestion].options.map((option, idx) => (
              <li key={idx}>
                <label
                  className={
                    showAnswer &&
                    option === questions[currentQuestion].answer
                      ? "correct"
                      : ""
                  }
                >
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
            <button disabled={!selectedOption} onClick={handleSubmit}>
              Submit
            </button>
          ) : (
            <div>
              <p
                className={
                  isCorrect ? "feedback correct-text" : "feedback wrong-text"
                }
              >
                {isCorrect
                  ? "✅ Correct!"
                  : "❌ Wrong! Correct answer: " +
                    questions[currentQuestion].answer}
              </p>
              <button onClick={handleNext}>Next Question</button>
            </div>
          )}
        </div>
      ) : (
        <div className="score-section">
          <h3>Test Completed ✅</h3>
          <p>
            Your Score: {score} / {questions.length}
          </p>
        </div>
      )}
    </div>
  );
}
