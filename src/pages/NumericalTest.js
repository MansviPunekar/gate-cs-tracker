import React, { useEffect, useState } from "react";
import "./DigitalLogicTest.css"; // Reusing the same style
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const questions = [
  {
    question: "If a train travels 180 km in 3 hours, what is its average speed?",
    options: ["30 km/hr", "60 km/hr", "90 km/hr", "120 km/hr"],
    answer: "60 km/hr",
  },
  {
    question: "A man buys a watch for ₹500 and sells it for ₹600. What is the profit percentage?",
    options: ["10%", "20%", "25%", "50%"],
    answer: "20%",
  },
  {
    question: "What is the value of x if 2x + 3 = 11?",
    options: ["3", "4", "5", "6"],
    answer: "4",
  },
  {
    question: "The LCM of 12 and 18 is:",
    options: ["36", "72", "24", "48"],
    answer: "36",
  },
  {
    question: "If the simple interest on ₹2000 at 5% per annum for 2 years is:",
    options: ["₹100", "₹150", "₹200", "₹250"],
    answer: "₹200",
  },
  {
    question: "What comes next in the series: 2, 4, 8, 16, __?",
    options: ["18", "24", "30", "32"],
    answer: "32",
  },
  {
    question: "A can do a piece of work in 10 days, B in 15 days. In how many days can they complete the work together?",
    options: ["5", "6", "8", "9"],
    answer: "6",
  },
  {
    question: "If 3 pencils cost ₹15, how many pencils can be bought for ₹75?",
    options: ["10", "12", "15", "20"],
    answer: "15",
  },
];

export default function NumericalTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [status, setStatus] = useState("In Progress");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const uid = auth.currentUser?.uid;
  const testId = "NumericalTest";

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
      <h2>Numerical Aptitude Test 🔢</h2>
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
            <button disabled={!selectedOption} onClick={handleSubmit}>
              Submit
            </button>
          ) : (
            <div>
              <p className={isCorrect ? "feedback correct-text" : "feedback wrong-text"}>
                {isCorrect
                  ? "✅ Correct!"
                  : "❌ Wrong! Correct answer: " + questions[currentQuestion].answer}
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
