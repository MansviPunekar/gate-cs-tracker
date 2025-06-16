import React, { useEffect, useState } from "react";
import "./DigitalLogicTest.css";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const questions = [
  {
    question: "Choose the correct antonym for the word 'benevolent':",
    options: ["Kind", "Cruel", "Generous", "Charitable"],
    answer: "Cruel",
  },
  {
    question: "Fill in the blank: She is known for her _____ behavior in public.",
    options: ["eccentric", "suspicious", "courteous", "insolent"],
    answer: "courteous",
  },
  {
    question: "Choose the correctly spelled word:",
    options: ["Reccommendation", "Recommendation", "Recomendation", "Recommandation"],
    answer: "Recommendation",
  },
  {
    question: "What is the meaning of the idiom: 'Hit the nail on the head'?",
    options: [
      "To hurt someone",
      "To say something precisely right",
      "To make a mistake",
      "To start a task",
    ],
    answer: "To say something precisely right",
  },
  {
    question: "Identify the grammatically correct sentence:",
    options: [
      "He don't know the answer.",
      "She doesn’t likes coffee.",
      "They goes to school.",
      "She doesn’t know the answer.",
    ],
    answer: "She doesn’t know the answer.",
  },
  {
    question: "Choose the best word to complete the sentence: The scientist was awarded for his _____ in physics.",
    options: ["contribution", "participation", "exploration", "appreciation"],
    answer: "contribution",
  },
  {
    question: "Choose the word which is most similar in meaning to 'lucid':",
    options: ["Confusing", "Clear", "Dull", "Complex"],
    answer: "Clear",
  },
  {
    question: "Find the odd one out:",
    options: ["Run", "Walk", "Fly", "Dance"],
    answer: "Dance",
  },
];

export default function VerbalTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [status, setStatus] = useState("In Progress");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(Date.now());

  const uid = auth.currentUser?.uid;
  const testId = "VerbalTest";

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
      <h2>Verbal Ability Test 📘</h2>
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
