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
        text: "The ratio of boys to girls in a class is 7:3. Which total number of students is possible?",
        options: [
          { id: "a", text: "21" },
          { id: "b", text: "37" },
          { id: "c", text: "50" },
          { id: "d", text: "73" }
        ],
        answer: "a",
        isMCQ: true
      },
      {
        id: "apt2",
        text: "Find the next term: 7G, 11K, 13M, __?",
        options: [
          { id: "a", text: "15Q" },
          { id: "b", text: "17Q" },
          { id: "c", text: "15P" },
          { id: "d", text: "17P" }
        ],
        answer: "b",
        isMCQ: true
      },
      {
        id: "apt3",
        text: "'Do : Undo :: Trust : ___'",
        options: [
          { id: "a", text: "Entrust" },
          { id: "b", text: "Intrust" },
          { id: "c", text: "Distrust" },
          { id: "d", text: "Untrust" }
        ],
        answer: "c",
        isMCQ: true
      },
      {
        id: "apt4",
        text: "A polygon is convex if every line segment between two points lies inside. Which isn’t convex?",
        options: [
          { id: "a", text: "Star-shaped" },
          { id: "b", text: "L-shape" },
          { id: "c", text: "Rectangle" },
          { id: "d", text: "Triangle" }
        ],
        answer: "b",
        isMCQ: true
      },
      {
        id: "apt5",
        text: "If '→' means increasing intensity, then dry → arid → parched corresponds to fast → ___?",
        options: [
          { id: "a", text: "False" },
          { id: "b", text: "Faster" },
          { id: "c", text: "Fastest" },
          { id: "d", text: "Fastestly" }
        ],
        answer: "c",
        isMCQ: true
      },
      {
        id: "apt6",
        text: "Weighing 2 wizards combining 4 elements in all possible orders: how many attempts?",
        options: [
          { id: "a", text: "24" },
          { id: "b", text: "48" },
          { id: "c", text: "16" },
          { id: "d", text: "12" }
        ],
        answer: "a",
        isMCQ: true
      },
      {
        id: "apt7",
        text: "If ∑log|x_i| = 0 and |x_i| ≠ 1, what’s the minimum sum x₁ + x₂ + x₃?",
        options: [
          { id: "a", text: "-3" },
          { id: "b", text: "0" },
          { id: "c", text: "1" },
          { id: "d", text: "3" }
        ],
        answer: "a",
        isMCQ: true
      },
      {
        id: "apt8",
        text: "The words 'principle' and 'principal' fit best in: “Going by the ___ that many hands..., the school ___...”",
        options: [
          { id: "a", text: "principle, principal" },
          { id: "b", text: "principal, principle" },
          { id: "c", text: "principle, principle" },
          { id: "d", text: "principal, principal" }
        ],
        answer: "a",
        isMCQ: true
      },
      {
        id: "apt9",
        text: "Which statement can be inferred: Some people work for reasons besides money?",
        options: [
          { id: "a", text: "Money beside" },
          { id: "b", text: "Beside money" },
          { id: "c", text: "Money besides" },
          { id: "d", text: "Besides money" }
        ],
        answer: "d",
        isMCQ: true
      },
      {
        id: "apt10",
        text: "Smallest n leaves remainder 7 when divided by 20, 42, or 76?",
        options: [
          { id: "a", text: "7" },
          { id: "b", text: "155" },
          { id: "c", text: "147" },
          { id: "d", text: "331" }
        ],
        answer: "b",
        isMCQ: true
      }
    ]
  },
  {
    title: "Engineering Mathematics / Technical",
    key: "Technical",
    questions: [
      {
        id: "tech1",
        text: "Number of bits to address 64K memory?",
        options: [{id:"a",text:"8"},{id:"b",text:"16"},{id:"c",text:"32"},{id:"d",text:"24"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech2",
        text: "Trace(AB) = Trace(BA) holds for any two square matrices. True or False?",
        options: [{id:"a",text:"True"},{id:"b",text:"False"},{id:"c",text:"Only if A= B"},{id:"d",text:"Only if they commute"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech3",
        text: "In a 2‑way set‑associative cache, each set contains how many blocks?",
        options: [{id:"a",text:"1"},{id:"b",text:"2"},{id:"c",text:"4"},{id:"d",text:"8"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech4",
        text: "Number of real roots of x^3 – 3x + 2 = 0?",
        options: [{id:"a",text:"1"},{id:"b",text:"2"},{id:"c",text:"3"},{id:"d",text:"None"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech5",
        text: "If P(A)=0.3, P(B)=0.5, and A & B independent, P(A ∩ B) = ?",
        options: [{id:"a",text:"0.15"},{id:"b",text:"0.2"},{id:"c",text:"0.5"},{id:"d",text:"0.8"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech6",
        text: "The recurrence T(n)=2T(n/2)+n gives T(n)=?",
        options: [{id:"a",text:"O(n)"},{id:"b",text:"O(n log n)"},{id:"c",text:"O(n^2)"},{id:"d",text:"O(log n)"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech7",
        text: "In BFS on a graph, the time complexity is?",
        options: [{id:"a",text:"O(V+E)"},{id:"b",text:"O(V^2)"},{id:"c",text:"O(E^2)"},{id:"d",text:"O(log V)"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech8",
        text: "Which hashing avoids collision handling via chaining or open addressing?",
        options: [{id:"a",text:"Separate chaining"},{id:"b",text:"Perfect hashing"},{id:"c",text:"Linear probing"},{id:"d",text:"Double hashing"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech9",
        text: "Which sorting algorithm is stable?",
        options: [{id:"a",text:"Quick Sort"},{id:"b",text:"Selection Sort"},{id:"c",text:"Merge Sort"},{id:"d",text:"Heap Sort"}],
        answer: "c", isMCQ: true
      },
      {
        id: "tech10",
        text: "Context-free languages are recognized by?",
        options: [{id:"a",text:"DFA"},{id:"b",text:"NFA"},{id:"c",text:"Pushdown Automaton"},{id:"d",text:"Turing Machine"}],
        answer: "c", isMCQ: true
      },
      {
        id: "tech11",
        text: "Which is NP-complete?",
        options: [{id:"a",text:"Vertex Cover"},{id:"b",text:"Prim's MST"},{id:"c",text:"Dijkstra"},{id:"d",text:"Topological sort"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech12",
        text: "Disk scheduling with shortest seek time first = SSTF; it's?",
        options: [{id:"a",text:"Starvation-free"},{id:"b",text:"Subject to starvation"},{id:"c",text:"Optimal throughput"},{id:"d",text:"Identical to SCAN"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech13",
        text: "In DBMS, ACID property 'I' stands for?",
        options: [{id:"a",text:"Integrity"},{id:"b",text:"Isolation"},{id:"c",text:"Indexing"},{id:"d",text:"Incremental"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech14",
        text: "Which of these is a NoSQL database?",
        options: [{id:"a",text:"MySQL"},{id:"b",text:"MongoDB"},{id:"c",text:"Oracle"},{id:"d",text:"PostgreSQL"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech15",
        text: "IP checksum is computed using?",
        options: [{id:"a",text:"CRC"},{id:"b",text:"One’s complement sum"},{id:"c",text:"MD5"},{id:"d",text:"SHA"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech16",
        text: "Big‑O of matrix multiplication naive is?",
        options: [{id:"a",text:"O(n^2)"},{id:"b",text:"O(n^3)"},{id:"c",text:"O(n log n)"},{id:"d",text:"O(n^2 log n)"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech17",
        text: "Process state changed from running to ready signifies?",
        options: [{id:"a",text:"Interrupt"},{id:"b",text:"System call"},{id:"c",text:"Exception"},{id:"d",text:"Trap"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech18",
        text: "In OOP, loose coupling is achieved by?",
        options: [{id:"a",text:"Inheritance"},{id:"b",text:"Encapsulation"},{id:"c",text:"Polymorphism"},{id:"d",text:"Aggregation"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech19",
        text: "Which graph representation uses O(V + E) space?",
        options: [{id:"a",text:"Adjacency matrix"},{id:"b",text:"Adjacency list"},{id:"c",text:"Edge list"},{id:"d",text:"Incidence matrix"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech20",
        text: "Master theorem case: T(n)=aT(n/b)+f(n), a=4,b=2,f(n)=n^2 => T(n)=?",
        options: [{id:"a",text:"O(n^2 log n)"},{id:"b",text:"O(n^2)"},{id:"c",text:"O(n^(log_b a))"},{id:"d",text:"O(n^3)"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech21",
        text: "Mean of a continuous uniform distribution on [0,1]?",
        options: [{id:"a",text:"0.25"},{id:"b",text:"0.5"},{id:"c",text:"0.75"},{id:"d",text:"1"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech22",
        text: "Permanent of a matrix vs determinant: same except missing signs. True or False?",
        options: [{id:"a",text:"True"},{id:"b",text:"False"},{id:"c",text:"Only for diagonal"},{id:"d",text:"Only if invertible"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech23",
        text: "In TCP, SYN flooding attack exploits which behavior?",
        options: [{id:"a",text:"Incomplete 3-way handshake"},{id:"b",text:"Slow start"},{id:"c",text:"Congestion control"},{id:"d",text:"Delayed ACK"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech24",
        text: "Dijkstra's algorithm cannot handle?",
        options: [{id:"a",text:"Negative cycles"},{id:"b",text:"Negative edges"},{id:"c",text:"Positive weights"},{id:"d",text:"Directed graphs"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech25",
        text: "Minimum spanning tree is?",
        options: [{id:"a",text:"Unique"},{id:"b",text:"Maybe multiple"},{id:"c",text:"Always unique"},{id:"d",text:"Not defined for non-connected"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech26",
        text: "Which number is a prime?",
        options: [{id:"a",text:"91"},{id:"b",text:"89"},{id:"c",text:"99"},{id:"d",text:"121"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech27",
        text: "Integral of sin(x) dx from 0 to π?",
        options: [{id:"a",text:"0"},{id:"b",text:"2"},{id:"c",text:"π"},{id:"d",text:"1"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech28",
        text: "Eigenvalues of [[2,1],[1,2]] are?",
        options: [{id:"a",text:"1,3"},{id:"b",text:"0,?"},{id:"c",text:"2,2"},{id:"d",text:"-1,5"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech29",
        text: "Schönhage–Strassen algorithm is for?",
        options: [{id:"a",text:"Matrix mult."},{id:"b",text:"Integer mult."},{id:"c",text:"Convex hull"},{id:"d",text:"Sorting"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech30",
        text: "Two-phase commit is used in distributed systems to ensure?",
        options: [{id:"a",text:"Progress"},{id:"b",text:"Consistency"},{id:"c",text:"Scalability"},{id:"d",text:"Caching"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech31",
        text: "Access control in OS is typically implemented using?",
        options: [{id:"a",text:"User IDs"},{id:"b",text:"Process table"},{id:"c",text:"Page table"},{id:"d",text:"File descriptor"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech32",
        text: "Which combinational circuit detects overflow in 2’s complement add?",
        options: [{id:"a",text:"XOR of carry into and out of MSB"},{id:"b",text:"AND of MSB"},{id:"c",text:"XNOR gate"},{id:"d",text:"Half adder"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech33",
        text: "TCP’s sliding window field size controls?",
        options: [{id:"a",text:"Throughput"},{id:"b",text:"Delay"},{id:"c",text:"Error correction"},{id:"d",text:"Checksum"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech34",
        text: "Virtual memory implements which concept?",
        options: [{id:"a",text:"Time-sharing"},{id:"b",text:"Segmentation"},{id:"c",text:"Demand paging"},{id:"d",text:"DMA"}],
        answer: "c", isMCQ: true
      },
      {
        id: "tech35",
        text: "ACID property 'D' is for?",
        options: [{id:"a",text:"Durability"},{id:"b",text:"Dependability"},{id:"c",text:"Decoupling"},{id:"d",text:"Distribution"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech36",
        text: "Which algorithm finds shortest paths from a single source?",
        options: [{id:"a",text:"Bellman–Ford"},{id:"b",text:"Kruskal"},{id:"c",text:"Floyd–Warshall"},{id:"d",text:"Prim"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech37",
        text: "In OS, 'thrashing' refers to?",
        options: [{id:"a",text:"High disk I/O due to paging"},{id:"b",text:"CPU overheating"},{id:"c",text:"Memory corruption"},{id:"d",text:"Disk fragmentation"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech38",
        text: "Cost of swapping heavy process context is measured in?",
        options: [{id:"a",text:"Memory"},{id:"b",text:"CPU cycles"},{id:"c",text:"Time"},{id:"d",text:"Bandwidth"}],
        answer: "c", isMCQ: true
      },
      {
        id: "tech39",
        text: "In DBMS, normalization to 3NF ensures?",
        options: [{id:"a",text:"No partial dependency"},{id:"b",text:"No transitive dependency"},{id:"c",text:"Both a & b"},{id:"d",text:"No redundancy"}],
        answer: "c", isMCQ: true
      },
      {
        id: "tech40",
        text: "Which join is computed by scanning both tables?",
        options: [{id:"a",text:"Nested loop"},{id:"b",text:"Hash join"},{id:"c",text:"Merge join"},{id:"d",text:"Sort-merge join"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech41",
        text: "Layer responsible for reliable host-to-host delivery in TCP/IP?",
        options: [{id:"a",text:"Transport"},{id:"b",text:"Network"},{id:"c",text:"Data Link"},{id:"d",text:"Application"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech42",
        text: "RSA encryption uses which hard problem?",
        options: [{id:"a",text:"Discrete Log"},{id:"b",text:"Integer Factorization"},{id:"c",text:"Graph Isomorphism"},{id:"d",text:"Prime Membership"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech43",
        text: "Linear search on sorted array: time complexity =?",
        options: [{id:"a",text:"O(n)"},{id:"b",text:"O(log n)"},{id:"c",text:"O(1)"},{id:"d",text:"O(n log n)"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech44",
        text: "Binary search requires array to be?",
        options: [{id:"a",text:"Sorted"},{id:"b",text:"Unique elements"},{id:"c",text:"Integer indexed"},{id:"d",text:"Even-length"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech45",
        text: "Probability that a randomly picked bit in a 32-bit integer is 1 (assuming uniform distribution)?",
        options: [{id:"a",text:"1/2"},{id:"b",text:"1/32"},{id:"c",text:"1/16"},{id:"d",text:"Depends"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech46",
        text: "In automata theory, regex a* matches?",
        options: [{id:"a",text:"Empty"},{id:"b",text:"Any number of a's"},{id:"c",text:"Only one a"},{id:"d",text:"Zero or one a"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech47",
        text: "For undirected graph, sum of degrees = 2|E|. True or False?",
        options: [{id:"a",text:"True"},{id:"b",text:"False"},{id:"c",text:"If no loops"},{id:"d",text:"Half of that"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech48",
        text: "Which algorithm finds strongly connected components?",
        options: [{id:"a",text:"Bellman–Ford"},{id:"b",text:"Kosaraju"},{id:"c",text:"Dijkstra"},{id:"d",text:"Kahn’s"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech49",
        text: "A page fault occurs when?",
        options: [{id:"a",text:"Page not in main memory"},{id:"b",text:"TLB hit"},{id:"c",text:"Cache miss"},{id:"d",text:"Stack overflow"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech50",
        text: "Least recently used (LRU) is a page replacement policy. Contains?",
        options: [{id:"a",text:"Stack algorithm"},{id:"b",text:"Randomness"},{id:"c",text:"Optimal"},{id:"d",text:"FIFO"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech51",
        text: "In compiler, lexical analysis uses which automaton?",
        options: [{id:"a",text:"PDA"},{id:"b",text:"DFA"},{id:"c",text:"Turing Machine"},{id:"d",text:"NPDA"}],
        answer: "b", isMCQ: true
      },
      {
        id: "tech52",
        text: "Prim’s algorithm is greedy. True or False?",
        options: [{id:"a",text:"True"},{id:"b",text:"False"},{id:"c",text:"Only for weighted"},{id:"d",text:"Only for directed"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech53",
        text: "The height of AVL tree with n nodes is O(log n)? True or False?",
        options: [{id:"a",text:"True"},{id:"b",text:"False"},{id:"c",text:"O(n)"},{id:"d",text:"Depends"}],
        answer: "a", isMCQ: true
      },
      {
        id: "tech54",
        text: "Post-order traversal visits root when?",
        options: [{id:"a",text:"First"},{id:"b",text:"Second"},{id:"c",text:"Last"},{id:"d",text:"It depends"}],
        answer: "c", isMCQ: true
      },
      {
        id: "tech55",
        text: "Which of these is not a join dependency normalization form?",
        options: [{id:"a",text:"BCNF"},{id:"b",text:"4NF"},{id:"c",text:"5NF"},{id:"d",text:"6NF"}],
        answer: "d", isMCQ: true
      }
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
