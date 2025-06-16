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
        id: "apt1",
        text: "The average of five consecutive odd numbers is 35. What is the smallest of these numbers?",
        options: [
          { id: "a", text: "31" },
          { id: "b", text: "33" },
          { id: "c", text: "35" },
          { id: "d", text: "37" }
        ],
        answer: "a",
        isMCQ: true
      },
      {
        id: "apt2",
        text: "Choose the word that is opposite in meaning to 'Mitigate':",
        options: [
          { id: "a", text: "Alleviate" },
          { id: "b", text: "Intensify" },
          { id: "c", text: "Soothe" },
          { id: "d", text: "Relieve" }
        ],
        answer: "b",
        isMCQ: true
      },
      {
        id: "apt3",
        text: "If the day before yesterday was Monday, what day will it be 3 days after tomorrow?",
        options: [
          { id: "a", text: "Sunday" },
          { id: "b", text: "Monday" },
          { id: "c", text: "Tuesday" },
          { id: "d", text: "Wednesday" }
        ],
        answer: "d",
        isMCQ: true
      },
      {
        id: "apt4",
        text: "Choose the correct spelling:",
        options: [
          { id: "a", text: "Accomodate" },
          { id: "b", text: "Acommodate" },
          { id: "c", text: "Accommodate" },
          { id: "d", text: "Acommoddate" }
        ],
        answer: "c",
        isMCQ: true
      },
      {
        id: "apt5",
        text: "Find the missing number in the series: 2, 6, 12, 20, __?",
        options: [
          { id: "a", text: "28" },
          { id: "b", text: "30" },
          { id: "c", text: "36" },
          { id: "d", text: "40" }
        ],
        answer: "b",
        isMCQ: true
      },
      {
        id: "apt6",
        text: "All roses are flowers. Some flowers fade quickly. Which of the following is valid?",
        options: [
          { id: "a", text: "Some roses fade quickly" },
          { id: "b", text: "All flowers are roses" },
          { id: "c", text: "Some roses are flowers that fade quickly" },
          { id: "d", text: "All roses may fade quickly" }
        ],
        answer: "d",
        isMCQ: true
      },
      {
        id: "apt7",
        text: "Complete the analogy: Pen : Write :: Knife : ___?",
        options: [
          { id: "a", text: "Cut" },
          { id: "b", text: "Sharp" },
          { id: "c", text: "Blade" },
          { id: "d", text: "Kitchen" }
        ],
        answer: "a",
        isMCQ: true
      },
      {
        id: "apt8",
        text: "A shopkeeper marks an item 20% above cost price and allows 10% discount. What is the profit percentage?",
        options: [
          { id: "a", text: "8%" },
          { id: "b", text: "10%" },
          { id: "c", text: "12%" },
          { id: "d", text: "15%" }
        ],
        answer: "a",
        isMCQ: true
      },
      {
        id: "apt9",
        text: "Choose the correct word to complete: 'I couldn’t find ___ to help me.'",
        options: [
          { id: "a", text: "someone" },
          { id: "b", text: "anyone" },
          { id: "c", text: "everyone" },
          { id: "d", text: "no one" }
        ],
        answer: "b",
        isMCQ: true
      },
      {
        id: "apt10",
        text: "In a race of 100 meters, A beats B by 10 meters. If B beats C by 10 meters, by how many meters does A beat C?",
        options: [
          { id: "a", text: "19" },
          { id: "b", text: "20" },
          { id: "c", text: "18" },
          { id: "d", text: "21" }
        ],
        answer: "a",
        isMCQ: true
      }
    ]
  },
  // Other sections go here...
  {
  "title": "GATE CSE – Expected Questions",
  "key": "GATE_CSE",
  "questions": [
    {"id":"q1","text":"Let G be a connected undirected graph with n vertices and n edges. How many cycles does it contain?","options":[{"id":"a","text":"0"},{"id":"b","text":"1"},{"id":"c","text":"n"},{"id":"d","text":"n−1"}],"answer":"b"},
    {"id":"q2","text":"Which of the following is NOT a valid CNF (Conjunctive Normal Form)?","options":[{"id":"a","text":"(¬p ∨ q) ∧ (r ∨ s)"},{"id":"b","text":"(p → q) ∧ r"},{"id":"c","text":"(p ∨ ¬q ∨ r)"},{"id":"d","text":"p ∧ (q ∨ r)"}],"answer":"b"},
    {"id":"q3","text":"Number of onto (surjective) functions from a set of size 5 to a set of size 3 is:","options":[{"id":"a","text":"150"},{"id":"b","text":"180"},{"id":"c","text":"75"},{"id":"d","text":"125"}],"answer":"a"},
    {"id":"q4","text":"Chromatic number of a cycle graph C₅ is:","options":[{"id":"a","text":"2"},{"id":"b","text":"3"},{"id":"c","text":"4"},{"id":"d","text":"5"}],"answer":"b"},
    {"id":"q5","text":"Solution of recurrence T(n)=T(n−1)+n is:","options":[{"id":"a","text":"O(n)"},{"id":"b","text":"O(n log n)"},{"id":"c","text":"O(n²)"},{"id":"d","text":"O(log n)"}],"answer":"c"},
    {"id":"q6","text":"Convert Boolean function F(a,b,c)=Σ(1,2,5) to minimal SOP form.","options":[{"id":"a","text":"a′b′c + ab′c′"},{"id":"b","text":"b′c"},{"id":"c","text":"a′b′c + a b′"},{"id":"d","text":"b′c + a b′c′"}],"answer":"b"},
    {"id":"q7","text":"A 4-bit ripple counter has a propagation delay of 10 ns per flip-flop. Worst-case delay is:","options":[{"id":"a","text":"10 ns"},{"id":"b","text":"40 ns"},{"id":"c","text":"4 ns"},{"id":"d","text":"100 ns"}],"answer":"b"},
    {"id":"q8","text":"Parity bit for even parity in bit string 1010110 is:","options":[{"id":"a","text":"0"},{"id":"b","text":"1"},{"id":"c","text":"It depends"},{"id":"d","text":"None"}],"answer":"a"},
    {"id":"q9","text":"In a pipeline with depth 5, throughput speed-up ideal is:","options":[{"id":"a","text":"1.0"},{"id":"b","text":"5.0"},{"id":"c","text":"4.0"},{"id":"d","text":"2.5"}],"answer":"b"},
    {"id":"q10","text":"Effective memory access time with 90% cache hit and 10 ns hit time, 100 ns miss penalty is:","options":[{"id":"a","text":"9 ns"},{"id":"b","text":"19 ns"},{"id":"c","text":"100 ns"},{"id":"d","text":"10 ns"}],"answer":"b"},
    {"id":"q11","text":"Page table size for 32-bit virtual address space with 4 KB pages and one-level table is:","options":[{"id":"a","text":"4 MB"},{"id":"b","text":"1 MB"},{"id":"c","text":"8 MB"},{"id":"d","text":"Depends on entries"}],"answer":"a"},
    {"id":"q12","text":"In quicksort worst-case partition gives sizes:","options":[{"id":"a","text":"balanced halves"},{"id":"b","text":"0 and n−1"},{"id":"c","text":"equal halves"},{"id":"d","text":"n/4 and 3n/4"}],"answer":"b"},
    {"id":"q13","text":"Time complexity of merging two sorted lists of sizes m and n is:","options":[{"id":"a","text":"O(m+n)"},{"id":"b","text":"O(m log n)"},{"id":"c","text":"O(n log n)"},{"id":"d","text":"O(max(m,n))"}],"answer":"a"},
    {"id":"q14","text":"Which data structure doesn't allow random access?","options":[{"id":"a","text":"Array"},{"id":"b","text":"Hash table"},{"id":"c","text":"Linked list"},{"id":"d","text":"Stack"}],"answer":"c"},
    {"id":"q15","text":"Time complexity of BFS in adjacency-list representation is:","options":[{"id":"a","text":"O(V+E)"},{"id":"b","text":"O(V²)"},{"id":"c","text":"O(E²)"},{"id":"d","text":"O(log V)"}],"answer":"a"},
    {"id":"q16","text":"Which hash avoids collision-handling methods?","options":[{"id":"a","text":"Chaining"},{"id":"b","text":"Open addressing"},{"id":"c","text":"Perfect hashing"},{"id":"d","text":"Double hashing"}],"answer":"c"},
    {"id":"q17","text":"Stable sorting algorithm among the following is:","options":[{"id":"a","text":"Quick Sort"},{"id":"b","text":"Selection Sort"},{"id":"c","text":"Merge Sort"},{"id":"d","text":"Heap Sort"}],"answer":"c"},
    {"id":"q18","text":"Time complexity of naive matrix multiplication is:","options":[{"id":"a","text":"O(n²)"},{"id":"b","text":"O(n³)"},{"id":"c","text":"O(n log n)"},{"id":"d","text":"O(n² log n)"}],"answer":"b"},
    {"id":"q19","text":"Master theorem: T(n)=2T(n/2)+n² gives:","options":[{"id":"a","text":"O(n²)"},{"id":"b","text":"O(n² log n)"},{"id":"c","text":"O(n³)"},{"id":"d","text":"O(n².5)"}],"answer":"a"},
    {"id":"q20","text":"Recurrence T(n)=3T(n/3)+n gives the solution:","options":[{"id":"a","text":"O(n)"},{"id":"b","text":"O(n log n)"},{"id":"c","text":"O(n¹·⁵)"},{"id":"d","text":"O(log n)"}],"answer":"b"},
    {"id":"q21","text":"Bellman–Ford algorithm handles:","options":[{"id":"a","text":"Negative weight edges"},{"id":"b","text":"Negative cycles"},{"id":"c","text":"Only positive edges"},{"id":"d","text":"Only DAGs"}],"answer":"a"},
    {"id":"q22","text":"Dijkstra’s algorithm fails on graphs with:","options":[{"id":"a","text":"Negative cycles"},{"id":"b","text":"Negative edges"},{"id":"c","text":"Positive weights"},{"id":"d","text":"Directed edges"}],"answer":"b"},
    {"id":"q23","text":"Which finds strongly connected components?","options":[{"id":"a","text":"Bellman–Ford"},{"id":"b","text":"Kosaraju"},{"id":"c","text":"Dijkstra"},{"id":"d","text":"Prim"}],"answer":"b"},
    {"id":"q24","text":"In automata theory, regex a* matches:","options":[{"id":"a","text":"Empty string"},{"id":"b","text":"Any number of a’s"},{"id":"c","text":"Exactly one a"},{"id":"d","text":"Zero or one a"}],"answer":"b"},
    {"id":"q25","text":"Post-order traversal visits root when?","options":[{"id":"a","text":"First"},{"id":"b","text":"Middle"},{"id":"c","text":"Last"},{"id":"d","text":"Second"}],"answer":"c"},
    {"id":"q26","text":"Height of AVL tree with n nodes is:","options":[{"id":"a","text":"O(log n)"},{"id":"b","text":"O(n)"},{"id":"c","text":"O(n log n)"},{"id":"d","text":"O(1)"}],"answer":"a"},
    {"id":"q27","text":"Which combinational circuit detects overflow in 2’s complement addition?","options":[{"id":"a","text":"XOR of carry into & out of MSB"},{"id":"b","text":"AND of MSB"},{"id":"c","text":"XNOR gate"},{"id":"d","text":"Half adder"}],"answer":"a"},
    {"id":"q28","text":"Floating-point IEEE-754 single precision has:","options":[{"id":"a","text":"8-bit exponent, 23-bit mantissa"},{"id":"b","text":"11-bit exponent, 52-bit mantissa"},{"id":"c","text":"5-bit exponent, 10-bit mantissa"},{"id":"d","text":"6-bit exponent, 17-bit mantissa"}],"answer":"a"},
    {"id":"q29","text":"IP checksum is computed using:","options":[{"id":"a","text":"CRC"},{"id":"b","text":"One’s complement sum"},{"id":"c","text":"MD5"},{"id":"d","text":"SHA"}],"answer":"b"},
    {"id":"q30","text":"TCP’s SYN flooding exploits:","options":[{"id":"a","text":"Incomplete 3-way handshake"},{"id":"b","text":"Slow start"},{"id":"c","text":"Delayed ACK"},{"id":"d","text":"Congestion control"}],"answer":"a"},
    {"id":"q31","text":"Which scheduling can cause starvation?","options":[{"id":"a","text":"FCFS"},{"id":"b","text":"Round Robin"},{"id":"c","text":"Shortest Seek Time First (SSTF)"},{"id":"d","text":"SCAN"}],"answer":"c"},
    {"id":"q32","text":"Two-phase commit ensures in distributed systems:","options":[{"id":"a","text":"Progress"},{"id":"b","text":"Consistency"},{"id":"c","text":"Availability"},{"id":"d","text":"Scalability"}],"answer":"b"},
    {"id":"q33","text":"ACID property 'I' stands for:","options":[{"id":"a","text":"Integrity"},{"id":"b","text":"Isolation"},{"id":"c","text":"Indexing"},{"id":"d","text":"Incrementality"}],"answer":"b"},
    {"id":"q34","text":"ACID property 'D' stands for:","options":[{"id":"a","text":"Durability"},{"id":"b","text":"Dependability"},{"id":"c","text":"Distribution"},{"id":"d","text":"Decoupling"}],"answer":"a"},
    {"id":"q35","text":"Normalization to 3NF removes:","options":[{"id":"a","text":"Partial dependencies"},{"id":"b","text":"Transitive dependencies"},{"id":"c","text":"Both"},{"id":"d","text":"Neither"}],"answer":"c"},
    {"id":"q36","text":"Which join requires scanning both tables?","options":[{"id":"a","text":"Nested loop"},{"id":"b","text":"Merge join"},{"id":"c","text":"Hash join"},{"id":"d","text":"Index join"}],"answer":"a"},
    {"id":"q37","text":"Which is a NoSQL database?","options":[{"id":"a","text":"MySQL"},{"id":"b","text":"MongoDB"},{"id":"c","text":"Oracle"},{"id":"d","text":"PostgreSQL"}],"answer":"b"},
    {"id":"q38","text":"Query complexity for B+ tree search is:","options":[{"id":"a","text":"O(log N)"},{"id":"b","text":"O(N)"},{"id":"c","text":"O(1)"},{"id":"d","text":"O(log log N)"}],"answer":"a"},
    {"id":"q39","text":"In DBMS, which guarantees durability after commit?","options":[{"id":"a","text":"Buffer cache flush"},{"id":"b","text":"Write-ahead log"},{"id":"c","text":"Checkpoint"},{"id":"d","text":"Rollback segment"}],"answer":"b"},
    {"id":"q40","text":"Deadlock can be prevented by:","options":[{"id":"a","text":"Hold and wait"},{"id":"b","text":"Circular wait"},{"id":"c","text":"Preemption"},{"id":"d","text":"Mutual exclusion"}],"answer":"c"},
    {"id":"q41","text":"Page fault occurs when:","options":[{"id":"a","text":"Page not in main memory"},{"id":"b","text":"TLB hit"},{"id":"c","text":"Cache miss"},{"id":"d","text":"Stack overflow"}],"answer":"a"},
    {"id":"q42","text":"LRU page replacement policy is:","options":[{"id":"a","text":"Stack algorithm"},{"id":"b","text":"Random"},{"id":"c","text":"Optimal"},{"id":"d","text":"FIFO"}],"answer":"a"},
    {"id":"q43","text":"Virtual memory primarily uses:","options":[{"id":"a","text":"Segmentation"},{"id":"b","text":"Demand paging"},{"id":"c","text":"DMA"},{"id":"d","text":"Time-sharing"}],"answer":"b"},
    {"id":"q44","text":"Which automaton recognizes context-free languages?","options":[{"id":"a","text":"DFA"},{"id":"b","text":"NFA"},{"id":"c","text":"PDA"},{"id":"d","text":"Turing Machine"}],"answer":"c"},
    {"id":"q45","text":"Lexical analyzer typically uses:","options":[{"id":"a","text":"PDA"},{"id":"b","text":"DFA"},{"id":"c","text":"Turing Machine"},{"id":"d","text":"NPDA"}],"answer":"b"},
    {"id":"q46","text":"Intermediate code generation better than high-level code because:","options":[{"id":"a","text":"It’s portable"},{"id":"b","text":"Faster execution"},{"id":"c","text":"Easier parsing"},{"id":"d","text":"Less optimization needed"}],"answer":"a"},
    {"id":"q47","text":"In TCP/IP, reliable host-to-host delivery is provided by:","options":[{"id":"a","text":"Transport layer"},{"id":"b","text":"Network layer"},{"id":"c","text":"Data link layer"},{"id":"d","text":"Application layer"}],"answer":"a"},
    {"id":"q48","text":"IPV4 header's TTL field is decremented by:","options":[{"id":"a","text":"Destination host"},{"id":"b","text":"Each router hop"},{"id":"c","text":"Source host"},{"id":"d","text":"Both hosts and routers"}],"answer":"b"},
    {"id":"q49","text":"Which number is prime?","options":[{"id":"a","text":"91"},{"id":"b","text":"89"},{"id":"c","text":"99"},{"id":"d","text":"121"}],"answer":"b"},
    {"id":"q50","text":"Integral of sin(x) from 0 to π is:","options":[{"id":"a","text":"0"},{"id":"b","text":"2"},{"id":"c","text":"π"},{"id":"d","text":"1"}],"answer":"b"},
    {"id":"q51","text":"Eigenvalues of [[2,1],[1,2]] are:","options":[{"id":"a","text":"1,3"},{"id":"b","text":"2,2"},{"id":"c","text":"0,? "},{"id":"d","text":"−1,5"}],"answer":"a"},
    {"id":"q52","text":"Permanent of a matrix differs from determinant by:","options":[{"id":"a","text":"Same except missing signs"},{"id":"b","text":"Always larger"},{"id":"c","text":"Only diagonal terms"},{"id":"d","text":"Has negative signs"}],"answer":"a"},
    {"id":"q53","text":"Probability that a random bit in 32-bit integer is 1 is:","options":[{"id":"a","text":"1/2"},{"id":"b","text":"1/32"},{"id":"c","text":"1/16"},{"id":"d","text":"Depends"}],"answer":"a"},
    {"id":"q54","text":"Schönhage–Strassen algorithm is for:","options":[{"id":"a","text":"Matrix multiplication"},{"id":"b","text":"Integer multiplication"},{"id":"c","text":"Convex hull"},{"id":"d","text":"Sorting"}],"answer":"b"},
    {"id":"q55","text":"Which scheduling algorithm is starvation-free?","options":[{"id":"a","text":"SSTF"},{"id":"b","text":"FCFS"},{"id":"c","text":"Priority without aging"},{"id":"d","text":"Shortest Job First"}],"answer":"b"}
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
