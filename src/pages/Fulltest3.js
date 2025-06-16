import React, { useEffect, useState } from "react";
import "./FullGateTest.css";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// 10 aptitude Qs + 55 technical Qs = 65 questions (like GATE pattern)
const sections = [
 {
  title: "General Aptitude",
  key: "Aptitude",
  questions: [
    {
      id: "apt11",
      text: "The average of 4 numbers is 45. If one number is 60 and the other three are equal, what is that number?",
      options: [
        { id: "a", text: "40" },
        { id: "b", text: "45" },
        { id: "c", text: "50" },
        { id: "d", text: "42" }
      ],
      answer: "a",
      isMCQ: true
    },
    {
      id: "apt12",
      text: "Which of the following is closest in meaning to the word 'Candid'?",
      options: [
        { id: "a", text: "Secretive" },
        { id: "b", text: "Blunt" },
        { id: "c", text: "Honest" },
        { id: "d", text: "Diplomatic" }
      ],
      answer: "c",
      isMCQ: true
    },
    {
      id: "apt13",
      text: "If today is Friday, what will be the day of the week 45 days from now?",
      options: [
        { id: "a", text: "Sunday" },
        { id: "b", text: "Tuesday" },
        { id: "c", text: "Monday" },
        { id: "d", text: "Wednesday" }
      ],
      answer: "b",
      isMCQ: true
    },
    {
      id: "apt14",
      text: "Choose the correctly spelled word:",
      options: [
        { id: "a", text: "Definately" },
        { id: "b", text: "Definitely" },
        { id: "c", text: "Defanitely" },
        { id: "d", text: "Definitly" }
      ],
      answer: "b",
      isMCQ: true
    },
    {
      id: "apt15",
      text: "Find the missing number: 3, 8, 15, 24, ___?",
      options: [
        { id: "a", text: "33" },
        { id: "b", text: "34" },
        { id: "c", text: "35" },
        { id: "d", text: "36" }
      ],
      answer: "a",
      isMCQ: true
    },
    {
      id: "apt16",
      text: "All mangoes are fruits. Some fruits are sweet. What follows logically?",
      options: [
        { id: "a", text: "All mangoes are sweet" },
        { id: "b", text: "Some mangoes are not sweet" },
        { id: "c", text: "Some fruits may not be mangoes" },
        { id: "d", text: "No mango is sweet" }
      ],
      answer: "c",
      isMCQ: true
    },
    {
      id: "apt17",
      text: "Complete the analogy: Eye : Vision :: Ear : ___?",
      options: [
        { id: "a", text: "Sound" },
        { id: "b", text: "Noise" },
        { id: "c", text: "Hear" },
        { id: "d", text: "Listening" }
      ],
      answer: "a",
      isMCQ: true
    },
    {
      id: "apt18",
      text: "A man sells an item for ₹1800 at a loss of 10%. What is the cost price?",
      options: [
        { id: "a", text: "₹1900" },
        { id: "b", text: "₹2000" },
        { id: "c", text: "₹2100" },
        { id: "d", text: "₹2200" }
      ],
      answer: "b",
      isMCQ: true
    },
    {
      id: "apt19",
      text: "Choose the correct word: 'He is taller ___ his brother.'",
      options: [
        { id: "a", text: "than" },
        { id: "b", text: "then" },
        { id: "c", text: "to" },
        { id: "d", text: "with" }
      ],
      answer: "a",
      isMCQ: true
    },
    {
      id: "apt20",
      text: "In a 100-meter race, A beats B by 20 meters and B beats C by 10 meters. By how many meters does A beat C?",
      options: [
        { id: "a", text: "28" },
        { id: "b", text: "30" },
        { id: "c", text: "32" },
        { id: "d", text: "25" }
      ],
      answer: "b",
      isMCQ: true
    }
  ]
}
,
  // Other sections go here...
  
   {
  "title":  "Engineering Mathematics / Technical",
  "key": "Technical",
  "questions": [
    {"id":"q1","text":"In a bipartite graph, the size of maximum matching equals size of minimum vertex cover (Kőnig’s Theorem). True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Only for complete graphs"},{"id":"d","text":"Only for trees"}],"answer":"a"},
    {"id":"q2","text":"The number of relations on a set of size n is:","options":[{"id":"a","text":"2^{n²}"},{"id":"b","text":"2^n"},{"id":"c","text":"n!"},{"id":"d","text":"n²"}],"answer":"a"},
    {"id":"q3","text":"Which Boolean function is self-dual?","options":[{"id":"a","text":"XOR"},{"id":"b","text":"XNOR"},{"id":"c","text":"Majority"},{"id":"d","text":"AND"}],"answer":"c"},
    {"id":"q4","text":"A complete graph K₆ edge count is:","options":[{"id":"a","text":"15"},{"id":"b","text":"21"},{"id":"c","text":"30"},{"id":"d","text":"36"}],"answer":"b"},
    {"id":"q5","text":"Master theorem case for T(n)=T(n/2)+n/log n gives:","options":[{"id":"a","text":"O(n)"},{"id":"b","text":"O(n log log n)"},{"id":"c","text":"O(n log n)"},{"id":"d","text":"O(n / log n)"}],"answer":"b"},
    {"id":"q6","text":"K-map minimization reduces number of literals. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Only for 4 variables"},{"id":"d","text":"Only for SOP forms"}],"answer":"a"},
    {"id":"q7","text":"Propagation delay through 3 cascaded 2-input NAND gates (5 ns each) is:","options":[{"id":"a","text":"5 ns"},{"id":"b","text":"10 ns"},{"id":"c","text":"15 ns"},{"id":"d","text":"20 ns"}],"answer":"c"},
    {"id":"q8","text":"Parity check detects single-bit error only. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Detects double errors"},{"id":"d","text":"Detects odd errors"}],"answer":"a"},
    {"id":"q9","text":"Ideal pipeline speed-up equals number of stages if no hazards. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Only for super-scalar"},{"id":"d","text":"Only for VLIW"}],"answer":"a"},
    {"id":"q10","text":"Effective access time = 0.8*10 + 0.2*110 = ?","options":[{"id":"a","text":"30 ns"},{"id":"b","text":"32 ns"},{"id":"c","text":"40 ns"},{"id":"d","text":"50 ns"}],"answer":"b"},
    {"id":"q11","text":"For 64-bit virtual addresses and 4 KB pages, number of pages = ?","options":[{"id":"a","text":"2^{52}"},{"id":"b","text":"2^{64}"},{"id":"c","text":"2^{12}"},{"id":"d","text":"2^{48}"}],"answer":"a"},
    {"id":"q12","text":"Worst-case quicksort happens when pivot is smallest each time. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Only for sorted input"},{"id":"d","text":"Only for reverse-sorted"}],"answer":"a"},
    {"id":"q13","text":"Merging k sorted lists of total N elements takes:","options":[{"id":"a","text":"O(N log k)"},{"id":"b","text":"O(N)"},{"id":"c","text":"O(k log N)"},{"id":"d","text":"O(N k)"}],"answer":"a"},
    {"id":"q14","text":"Linked list insertion at tail is O(1) with tail pointer. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Only for singly-linked"},{"id":"d","text":"Only for doubly-linked"}],"answer":"a"},
    {"id":"q15","text":"BFS finds shortest path in unweighted graph. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Only for directed"},{"id":"d","text":"Only after DFS"}],"answer":"a"},
    {"id":"q16","text":"Open addressing resolves collision by probing. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Only for chaining"},{"id":"d","text":"Only for linear hashing"}],"answer":"a"},
    {"id":"q17","text":"Stable counting sort is possible. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Only for fixed range"},{"id":"d","text":"Only for integers"}],"answer":"a"},
    {"id":"q18","text":"Strassen’s algorithm multiplies matrices in < O(n³). True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Only for large n"},{"id":"d","text":"Only probabilistic"}],"answer":"a"},
    {"id":"q19","text":"Master theorem: T(n)=5T(n/2)+n gives ≈O(n^{log₂5}). True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"≈O(n²)"},{"id":"d","text":"≈O(n^{2.3})"}],"answer":"a"},
    {"id":"q20","text":"Recurrence T(n)=T(n/4)+T(3n/4)+n gives O(n log n). True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"O(n)"},{"id":"d","text":"O(n²)"}],"answer":"a"},
    {"id":"q21","text":"Bellman-Ford detects negative cycles. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Only in DAGs"},{"id":"d","text":"Only if no negative edges"}],"answer":"a"},
    {"id":"q22","text":"Dijkstra uses min-priority queue. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Uses simple queue"},{"id":"d","text":"Uses stack"}],"answer":"a"},
    {"id":"q23","text":"Tarjan’s algorithm uses DFS and low-link values. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Uses BFS"},{"id":"d","text":"Uses DP"}],"answer":"a"},
    {"id":"q24","text":"Regex (ab)* matches empty string. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Only ab"},{"id":"d","text":"Only a"}],"answer":"a"},
    {"id":"q25","text":"In-order traversal of BST gives sorted output. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Only for full trees"},{"id":"d","text":"Only for complete trees"}],"answer":"a"},
    {"id":"q26","text":"Height of B-tree with minimum degree t is O(log_t n). True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Base 2"},{"id":"d","text":"Only for binary trees"}],"answer":"a"},
    {"id":"q27","text":"Overflow detection uses XOR of carry-in and carry-out. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Uses AND"},{"id":"d","text":"Uses OR"}],"answer":"a"},
    {"id":"q28","text":"IEEE-754 has hidden bit in mantissa. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Only in double"},{"id":"d","text":"Only in extended"}],"answer":"a"},
    {"id":"q29","text":"IP checksum uses 16-bit one's complement sum. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Uses CRC-32"},{"id":"d","text":"Uses MD5"}],"answer":"a"},
    {"id":"q30","text":"UDP is connectionless, TCP is connection‑oriented. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Both are connectionless"},{"id":"d","text":"Both are oriented"}],"answer":"a"},
    {"id":"q31","text":"FCFS disk scheduling is starvation-free. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Only SSTF"},{"id":"d","text":"Only SCAN"}],"answer":"a"},
    {"id":"q32","text":"Three-phase commit is an improvement over two-phase. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Only in DBMS"},{"id":"d","text":"Only in OS"}],"answer":"a"},
    {"id":"q33","text":"Isolation in ACID avoids dirty reads. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Avoids phantom reads only"},{"id":"d","text":"Avoids deadlocks"}],"answer":"a"},
    {"id":"q34","text":"Durability ensures committed data survives crash. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Only on disk"},{"id":"d","text":"Only in memory"}],"answer":"a"},
    {"id":"q35","text":"Third normal form allows transitive dependency. True or False?","options":[{"id":"a","text":"False"},{"id":"b","text":"True"},{"id":"c","text":"Only BCNF"},{"id":"d","text":"Only 4NF"}],"answer":"a"},
    {"id":"q36","text":"Hash join builds hash on smaller relation. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Builds on larger"},{"id":"d","text":"Uses sort"}],"answer":"a"},
    {"id":"q37","text":"Redis is a NoSQL in-memory data store. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Disk-based only"},{"id":"d","text":"Relational"}],"answer":"a"},
    {"id":"q38","text":"B+-tree internal nodes store keys only. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Also pointers"},{"id":"d","text":"Also records"}],"answer":"a"},
    {"id":"q39","text":"Write-ahead log ensures DURABILITY. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Ensures CONSISTENCY"},{"id":"d","text":"Ensures ISOLATION"}],"answer":"a"},
    {"id":"q40","text":"Deadlock detection uses wait-for graph cycle. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Uses resource allocation table"},{"id":"d","text":"Uses timestamp ordering"}],"answer":"a"},
    {"id":"q41","text":"Single-level paging eliminates external fragmentation. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Only in segmentation"},{"id":"d","text":"Only with TLB"}],"answer":"a"},
    {"id":"q42","text":"LRU can be implemented using stack. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Only approximated"},{"id":"d","text":"Only FIFO"}],"answer":"a"},
    {"id":"q43","text":"Demand paging loads pages only when referenced. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Only pre-paging"},{"id":"d","text":"Only segmentation"}],"answer":"a"},
    {"id":"q44","text":"Context-free languages recognized by PDA with ϵ-moves. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Requires DFA"},{"id":"d","text":"Requires Turing machine"}],"answer":"a"},
    {"id":"q45","text":"DFA can simulate NFA in polynomial time. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Requires exponential time"},{"id":"d","text":"Cannot simulate"}],"answer":"a"},
    {"id":"q46","text":"Three-address code is a type of intermediate representation. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Only two-address"},{"id":"d","text":"Only postfix"}],"answer":"a"},
    {"id":"q47","text":"TCP provides flow control via sliding window. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Only congestion control"},{"id":"d","text":"Only error control"}],"answer":"a"},
    {"id":"q48","text":"ICMP handles network diagnostics (e.g., ping). True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Handled by TCP"},{"id":"d","text":"Handled by UDP"}],"answer":"a"},
    {"id":"q49","text":"DNS uses UDP port 53 by default. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Uses TCP only"},{"id":"d","text":"Uses ICMP"}],"answer":"a"},
    {"id":"q50","text":"A 7-layer OSI model is used in networking. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"It has 5 layers"},{"id":"d","text":"It has 8 layers"}],"answer":"a"},
    {"id":"q51","text":"Modular exponentiation is used in RSA crypto. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Uses discrete log"},{"id":"d","text":"Uses elliptic curves"}],"answer":"a"},
    {"id":"q52","text":"SHA‑256 produces a 256‑bit digest. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"Produces 512 bits"},{"id":"d","text":"Produces 128 bits"}],"answer":"a"},
    {"id":"q53","text":"Probability bit is 1 in random 64‑bit word is 1/2. True or False?","options":[{"id":"a","text":"True"},{"id":"b","text":"False"},{"id":"c","text":"1/64"},{"id":"d","text":"1/32"}],"answer":"a"},
    {"id":"q54","text":"Integral of cos(x) from 0 to π/2 is:","options":[{"id":"a","text":"1"},{"id":"b","text":"0"},{"id":"c","text":"π/2"},{"id":"d","text":"√2"}],"answer":"a"},
    {"id":"q55","text":"Eigenvalues of identity matrix I₃ are:","options":[{"id":"a","text":"1,1,1"},{"id":"b","text":"0 only"},{"id":"c","text":"2,2,2"},{"id":"d","text":"–1,–1,–1"}],"answer":"a"}
  ]
}


];


export default function FullGateTest() {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [responses, setResponses] = useState({});
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("In Progress");
  const [startTime, setStartTime] = useState(Date.now());

  const uid = auth.currentUser?.uid;
  const testId = "FullGateCSE";

  // Fetch saved progress
  useEffect(() => {
    if (!uid) return;
    const loadProgress = async () => {
      const snap = await getDoc(doc(db, "testResults", uid));
      const data = snap.data()?.[testId];
      if (data) {
        setSectionIndex(data.sectionIndex);
        setQIndex(data.qIndex);
        setResponses(data.responses);
        setScore(data.score);
        setStatus(data.status);
      }
    };
    loadProgress();
    window.addEventListener("beforeunload", () => saveProgress("Discontinued"));
    return () => window.removeEventListener("beforeunload", () => saveProgress("Discontinued"));
  }, [uid]);

  const saveProgress = async (st) => {
    if (!uid) return;
    await setDoc(doc(db, "testResults", uid), {
      [testId]: { sectionIndex, qIndex, responses, score, status: st }
    }, { merge: true });
  };

  const currentSection = sections[sectionIndex];
  const question = currentSection.questions[qIndex];

  const handleNext = () => {
    const isCorrect = (selected === question.answer);
    const newScore = isCorrect ? score + (question.isMCQ ? 1 : 2) : question.isMCQ ? score : score - (1 / 3);
    setScore(newScore);
    setResponses({ ...responses, [question.id]: selected });

    if (qIndex + 1 < currentSection.questions.length) {
      setQIndex(qIndex + 1);
      setSelected(responses[question.id] || "");
    } else if (sectionIndex + 1 < sections.length) {
      setSectionIndex(sectionIndex + 1);
      setQIndex(0);
      setSelected("");
    } else {
      setStatus("Completed");
      saveProgress("Completed");
    }
  };

  const formatTime = ms => {
    const s = Math.floor((Date.now() - ms) / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2,"0")}`;
  };

  if (!uid) return <div>Please login.</div>;

  return (
    <div className="full-gate-wrapper">
      <h2>GATE CSE Full Test</h2>
      <div className="timer">Elapsed: {formatTime(startTime)}</div>
      {status === "Discontinued" && (
        <div className="continue-box">
          <button onClick={() => setStatus("In Progress")}>Continue Test</button>
        </div>
      )}

      {status !== "Completed" && (
        <>
          <div className="section-title">
            {currentSection.title} ({sectionIndex + 1}/{sections.length})
          </div>
          <div className="question">
            <strong>Q{qIndex + 1}.</strong> {question.text}
          </div>
          <div className="options">
            {question.options.map(opt => (
              <label key={opt.id}>
                <input
                  type="radio"
                  name="option"
                  value={opt.id}
                  checked={selected === opt.id}
                  onChange={() => setSelected(opt.id)}
                />
                {opt.text}
              </label>
            ))}
          </div>
          <button disabled={!selected} onClick={handleNext}>
            {sectionIndex === sections.length - 1 && qIndex === currentSection.questions.length - 1
              ? "Finish Test" : "Next"}
          </button>
        </>
      )}

      {status === "Completed" && (
        <div className="score-section">
          <h3>Test Completed ✅</h3>
          <p>Your Score: {score}</p>
          <button onClick={() => saveProgress("Reviewed")}>Mark as Reviewed</button>
        </div>
      )}
    </div>
  );
}
