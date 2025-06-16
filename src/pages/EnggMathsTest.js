import React, { useEffect, useState } from "react";
import "./DigitalLogicTest.css";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const questions = [
  {
    question: "If A is a 3×3 matrix with |A| = 5, what is the value of |2A|?",
    options: ["10", "20", "40", "120"],
    answer: "40", // |kA| = k^n * |A| for n x n matrix
  },
  {
    question: "What is the Laplace transform of f(t) = t?",
    options: ["1/s", "1/s²", "s", "t/s"],
    answer: "1/s²",
  },
  {
    question: "A fair die is rolled twice. What is the probability that the sum is equal to 7?",
    options: ["1/6", "1/12", "1/36", "5/36"],
    answer: "1/6",
  },
  {
    question: "Which of the following is **not** a linear transformation?",
    options: [
      "T(x) = 2x",
      "T(x) = x + 1",
      "T(x) = 3x",
      "T(x) = -x",
    ],
    answer: "T(x) = x + 1",
  },
  {
    question: "What is the rank of the matrix [[1, 2], [2, 4]]?",
    options: ["0", "1", "2", "3"],
    answer: "1",
  },
  {
    question: "The solution to dy/dx + y = e^x is:",
    options: [
      "y = e^x + C",
      "y = x + C",
      "y = Ce^(-x) + e^x",
      "y = e^x - C",
    ],
    answer: "y = Ce^(-x) + e^x",
  },
  {
    question: "In a discrete probability distribution, sum of all probabilities is:",
    options: ["0", "1", "Depends on distribution", "Infinity"],
    answer: "1",
  },
  {
    question: "If f(x) = x³ – 3x² + 2x, then f′(x) is:",
    options: ["3x² – 6x + 2", "x² – 6x", "3x² – 6x + 1", "x³ – 6x"],
    answer: "3x² – 6x + 2",
  },
];

export default function EnggMathsTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [status, setStatus] = useState("In Progress");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const uid = auth.currentUser?.uid;
  const testId = "EnggMathsTest";

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
      <h2>Engineering Mathematics Test 📐</h2>
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
