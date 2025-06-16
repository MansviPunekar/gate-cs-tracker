// DigitalLogicTest.js
import React, { useEffect, useState } from "react";
import "./DigitalLogicTest.css";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const questions = [
  {
    question: "What is the output of a NAND gate if both inputs are 1?",
    options: ["0", "1", "Undefined", "Same as input"],
    answer: "0",
  },
  {
    question: "Which number system has base 16?",
    options: ["Decimal", "Binary", "Octal", "Hexadecimal"],
    answer: "Hexadecimal",
  },
  {
    question: "What does a flip-flop store?",
    options: ["Bit", "Byte", "Word", "Nibble"],
    answer: "Bit",
  },
];

export default function DigitalLogicTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [status, setStatus] = useState("In Progress");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const uid = auth.currentUser?.uid;
  const testId = "DigitalLogicTest";

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
      <h2>Digital Logic Test 🧠</h2>
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
