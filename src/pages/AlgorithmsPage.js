import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./AlgorithmsPage.css";

const topics = [
  {
    name: "Introduction Of Algorithms",
     subtopics: [
      {
        name: "Part 01",
    video: "https://www.youtube.com/embed/sigOelXh5rs",
    notes: "Overview of algorithm concepts: problems, inputs/outputs, types of algorithms and performance factors."}]
  },
  {
    name: "Analysis Of Algorithms",
    subtopics: [
      {
        name: "Part 01",
        video: "https://www.youtube.com/embed/P8v2oTTmd4k",
        notes: "Big-O, Big-Θ, and Big-Ω notations explained with examples."
      },
      {
        name: "Part 02",
        video: "https://www.youtube.com/embed/2LPFyOVaSqk",
        notes: "Worst-case vs average-case time complexity discussions."
      },
      {
        name: "Part 03",
        video: "https://www.youtube.com/embed/RF3jT4JUuDs",
        notes: "Space complexity analysis and memory considerations."
      },
      {
        name: "Part 04",
        video: "https://www.youtube.com/embed/ffR4k3f9PiE",
        notes: "Time complexity of recursive algorithms and recurrence relations."
      },
    ]
  },
  {
    name: "Time and Space Complexity",
    subtopics: [
      {
        name: "Time Complexity Part 01",
        video: "https://www.youtube.com/embed/Ot0oJ1S9vOo",
        notes: "Linear and polynomial time complexities."
      },
      {
        name: "Time Complexity Part 02",
        video: "https://www.youtube.com/embed/r6A_KbRvzwA",
        notes: "Logarithmic and exponential time complexities."
      },
      {
        name: "Time Complexity Part 03",
        video: "https://www.youtube.com/embed/36cul9nlYPg",
        notes: "Amortized analysis explained."
      },
      {
        name: "Time Complexity Part 04",
        video: "https://www.youtube.com/embed/H5lsUdmRAUY",
        notes: "Use-cases: data structures performance (arrays, linked lists)."
      },
      {
        name: "Space Complexity",
        video: "https://www.youtube.com/embed/eS0bfGmsxdA",
        notes: "Auxiliary vs total space explained."
      }
    ]
  },
  {
    name: "Divide and Conquer",
    subtopics: [
      {
        name: "Part 01",
        video: "https://www.youtube.com/embed/x7V2rf16NRk",
        notes: "Divide-and-conquer concept & merging sorted lists."
      },
      {
        name: "Part 02",
        video: "https://www.youtube.com/embed/k1KA5fle7Rg",
        notes: "Master Theorem introduction for analyzing recurrences."
      },
      {
        name: "Part 03",
        video: "https://www.youtube.com/embed/1yDuoNVElOY",
        notes: "Example: Merge Sort divide/conquer/ combine."
      }
    ]
  },
  {
    name: "Sorting Algorithms",
    subtopics: [
      {
        name: "Part 01: Bubble Sort",
        video: "https://www.youtube.com/embed/S-9e-6Ya-Hg",
        notes: "Basic comparison-based sorting; worst-case O(n²)."
      },
      {
        name: "Part 02: Merge Sort",
        video: "https://www.youtube.com/embed/fX3ed4sRpV0",
        notes: "Stable, O(n log n) divide-and-conquer sort."
      },
      {
        name: "Part 03: Quick Sort",
        video: "https://www.youtube.com/embed/jMjabwSR_As",
        notes: "Partitioning technique; average O(n log n), worst O(n²)."
      },
      {
        name: "Part 04: Heap Sort",
        video: "https://www.youtube.com/embed/jMjabwSR_As",
        notes: "In-place O(n log n) sort using heap data structure."
      }
    ]
  },
  {
    name: "Greedy Algorithms",
    subtopics: [
      {
        name: "Part 01",
        video: "https://www.youtube.com/embed/xMzvRyVTwdY",
        notes: "Greedy choice property explained."
      },
      {
        name: "Part 03",
        video: "https://www.youtube.com/embed/rM1Da3xTUw4",
        notes: "Activity selection problem implementation."
      },
      {
        name: "Part 04",
        video: "https://www.youtube.com/embed/6URZled_57U",
        notes: "Huffman coding for optimal prefix codes."
      },
      {
        name: "Part 05",
        video: "https://www.youtube.com/embed/taVb3VErCic",
        notes: "Interval scheduling and greedy."
      },
      {
        name: "Part 06",
        video: "https://www.youtube.com/embed/S8PbTtdBIfA",
        notes: "Greedy strategy in coin change problem."
      }
    ]
  },
  {
    name: "Dynamic Programming",
    subtopics: [
      {
        name: "Part 01",
        video: "https://www.youtube.com/embed/H-voArKK56E",
        notes: "DP principle and memoization basics."
      },
      {
        name: "Part 02",
        video: "https://www.youtube.com/embed/m6Fqk9-B7Tw",
        notes: "Tabulation vs memoization in DP."
      },
      {
        name: "Part 03",
        video: "https://www.youtube.com/embed/PI0LHD9sA88",
        notes: "Classic example: Longest Increasing Subsequence."
      },
      {
        name: "Part 04",
        video: "https://www.youtube.com/embed/0BgamcCCLgk",
        notes: "DP matrix chain multiplication problem."
      },
      {
        name: "Part 05",
        video: "https://www.youtube.com/embed/pei9-icFMj4",
        notes: "0/1 Knapsack problem explained."
      }
    ]
  },
  {
    name: "Mini Marathon",
    subtopics: [
      {
        name: "Part 01",
        video: "https://www.youtube.com/embed/fjsWmbBWeYc",
        notes: "Quick problem-solving session—sorting and greedy."
      },
      {
        name: "Part 02",
        video: "https://www.youtube.com/embed/Llk1bAGAPR0",
        notes: "Mixed problems: DP + Greedy + Searching."
      },
      {
        name: "Most Expected Questions",
        video: "https://www.youtube.com/embed/dUw2hOF8MdE",
        notes: "GATE style algorithmic question walkthrough."
      }
    ]
  }
];


export default function AlgorithmsPage() {
  const [checked, setChecked] = useState({});
  const user = auth.currentUser;
  const uid = user?.uid;
  const userProgressRef = uid ? doc(db, "userProgress", uid) : null;

  const totalSubtopics = topics.reduce((acc, t) => acc + t.subtopics.length, 0);
  const completedSubtopics = Object.values(checked).filter(Boolean).length;
  const overallProgress = Math.round((completedSubtopics / totalSubtopics) * 100);

  useEffect(() => {
    const fetchData = async () => {
      if (userProgressRef) {
        const docSnap = await getDoc(userProgressRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.algorithmsChecked) {
            setChecked(data.algorithmsChecked);
          }
        }
      }
    };
    fetchData();
  }, [userProgressRef]);

  const handleCheckboxChange = async (topicIndex, subIndex) => {
    const key = `${topicIndex}-${subIndex}`;
    const updated = { ...checked, [key]: !checked[key] };
    setChecked(updated);

    const completedSubtopics = Object.values(updated).filter(Boolean).length;
    const overallProgress = Math.round((completedSubtopics / totalSubtopics) * 100);

    if (userProgressRef) {
      await setDoc(
        userProgressRef,
        {
          algorithmsChecked: updated,
          subjectProgress: {
            Algorithms: overallProgress,
          },
        },
        { merge: true }
      );
    }
  };

  const getProgress = (subtopics, topicIndex) => {
    const total = subtopics.length;
    const completed = subtopics.filter((_, i) => checked[`${topicIndex}-${i}`]).length;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="subject-wrapper">
      <h2>🧠 Algorithms</h2>
      <p className="progress-info">Overall Progress: {overallProgress}% Completed</p>

      {topics.map((topic, topicIndex) => (
        <div key={topicIndex} className="topic-section">
          <details>
            <summary className="topic-summary">
              {topic.name} – {getProgress(topic.subtopics, topicIndex)}% Completed
            </summary>
            <ul className="subtopic-list">
              {topic.subtopics.map((sub, subIndex) => (
                <li key={subIndex} className="subtopic-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={checked[`${topicIndex}-${subIndex}`] || false}
                      onChange={() => handleCheckboxChange(topicIndex, subIndex)}
                    />
                    {sub.name}
                  </label>
                  <div className="video-container">
                    <iframe
                      src={sub.video}
                      title={sub.name}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="revision-note">
                    <strong>Revision Note:</strong> <em>{sub.notes}</em>
                  </div>
                </li>
              ))}
            </ul>
          </details>
        </div>
      ))}
    </div>
  );
}
