import React, { useEffect, useState } from "react";
import "./DigitalLogicTest.css";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const questions = [
  {
    question: "Which of the following is a correct statement about the ER model?",
    options: [
      "An entity set is a collection of related attributes",
      "A weak entity does not have a key attribute",
      "Relationships cannot have attributes",
      "Cardinality is not represented in ER diagrams",
    ],
    answer: "A weak entity does not have a key attribute",
  },
  {
    question: "Which of the following operations is used to retrieve tuples from two relations with common attributes?",
    options: [
      "Union",
      "Intersection",
      "Natural Join",
      "Cartesian Product",
    ],
    answer: "Natural Join",
  },
  {
    question: "Which normal form is based on the concept of transitive dependency?",
    options: [
      "1NF",
      "2NF",
      "3NF",
      "BCNF",
    ],
    answer: "3NF",
  },
  {
    question: "Which of the following protocols ensures serializability in transactions?",
    options: [
      "Two-phase locking",
      "Time-stamp ordering",
      "Validation-based",
      "All of the above",
    ],
    answer: "All of the above",
  },
  {
    question: "Which of the following schedules is **conflict serializable**?",
    options: [
      "Two transactions updating same data simultaneously",
      "A schedule following two-phase locking",
      "A schedule with cyclic precedence graph",
      "Non-overlapping transactions",
    ],
    answer: "A schedule following two-phase locking",
  },
  {
    question: "In SQL, which command is used to remove a relation from the database?",
    options: [
      "DELETE",
      "REMOVE",
      "DROP",
      "CLEAR",
    ],
    answer: "DROP",
  },
  {
    question: "Which of the following indexing methods is most suitable for range queries?",
    options: [
      "Hash Indexing",
      "B+ Tree Indexing",
      "Dense Indexing",
      "Sparse Indexing",
    ],
    answer: "B+ Tree Indexing",
  },
  {
    question: "Which of the following is **NOT** a valid isolation level in SQL?",
    options: [
      "Read Committed",
      "Read Uncommitted",
      "Serializable",
      "Repeatable Write",
    ],
    answer: "Repeatable Write", // Trick question: it's "Repeatable Read" in SQL standard
  },
];

export default function DBMSTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [status, setStatus] = useState("In Progress");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const uid = auth.currentUser?.uid;
  const testId = "DBMSTest";

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
      <h2>DBMS Test 🗃️</h2>
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
