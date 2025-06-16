import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./OperatingSystemPage.css";

const topics = [
  {
    name: "Introduction to Operating Systems",
    subtopics: [
      {
        name: "What is an OS?",
        video: "https://www.youtube.com/embed/a3YDvmKbGrA",
        notes: "Overview of OS roles: manages hardware, apps, and serves as user interface."
      },
      {
        name: "Process and Program Concept ",
        video: "https://www.youtube.com/embed/9XGbBuhO3zs",
        notes: "Learn batch, time-sharing, distributed, and real-time OS differences."
      }
    ],
  },
  {
    name: "CPU scheduling",
    subtopics: [
      {
        name: "FCFS,SJF,R.R",
        video: "https://www.youtube.com/embed/rXMcUE49Huc",
        notes: "Understand process states, PCB structure, and life cycle."
      },
      {
        name: "Synchronisation",
        video: "https://www.youtube.com/embed/KQ3ANBtG6yk",
        notes: "Know thread types, context-switching, and benefits over processes."
      }
    ],
  },
  {
    name: "CPU Scheduling",
    subtopics: [
      {
        name: "Process synchronisation",
        video: "https://www.youtube.com/embed/BK9OYVHnsHg",
        notes: "Intro to schedulers, criteria like turnaround & waiting time."
      },
      {
        name: "Classical IPC problem",
        video: "https://www.youtube.com/embed/3YoiwgjdddE",
        notes: "Dive into FCFS, SJF, Priority, and Round Robin algorithm trade-offs."
      }
    ],
  },
  {
    name: "Memory Management",
    subtopics: [
      {
        name: "Concurrency",
        video: "https://www.youtube.com/embed/mGRv34e7G04",
        notes: "Explore partitioning with internal/external fragmentation issues."
      },
      {
        name: "Deadlocks:nec conditions",
        video: "https://www.youtube.com/embed/roDt7p0A4Qg",
        notes: "Details on page tables, segments, and how addresses map."
      }
    ],
  },
  {
    name: "File Systems",
    subtopics: [
      {
        name: "Deadlocs :continued",
        video: "https://www.youtube.com/embed/64DbX6OMMvs",
        notes: "Learn file attributes, operations, and types."
      },
      {
        name: "Memory Subsystem",
        video: "https://www.youtube.com/embed/AwTFXvKqD_M",
        notes: "Comparison: contiguous, linked, indexed allocation techniques."
      },
      {
        name: "Paging and segmentation",
        video: "https://www.youtube.com/embed/xBoqqLjCGb0",
        notes: "Covers file structure, metadata, and directory types."
      },
      {
        name: "Virtual memory:implementation",
        video: "https://www.youtube.com/embed/8wpWj89mu4Y",
        notes: "Advanced allocation discussion – extent-based & FAT."
      },
      {
        name: "virtual memor: continued",
        video: "https://www.youtube.com/embed/yT_ZaFhmhig",
        notes: "Reinforces file attributes and hierarchical structure."
      },
      {
        name: "Filesystem",
        video: "https://www.youtube.com/embed/b3tT2JnQemY",
        notes: "Indexed vs linked: advantages in performance & fragmentation."
      },
      {
        name: "Disk scheduling ",
        video: "https://www.youtube.com/embed/u6P7RiP9yeM",
        notes: "Examines multi-level indexed and inode-based systems."
      }
    ]
  }
];


export default function OperatingSystemPage() {
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
          if (data.osChecked) {
            setChecked(data.osChecked);
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
          osChecked: updated,
          subjectProgress: {
            OperatingSystem: overallProgress,
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
      <h2>🖥️ Operating Systems</h2>
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
