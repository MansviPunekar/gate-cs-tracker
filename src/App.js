import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthForm from "./pages/AuthForm";
import PrivateRoute from "./PrivateRoute";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects"; // Import Subjects page
import Aptitude from "./pages/Aptitude";         // Import aptitude page
import MockTest from "./pages/MockTests";  
import Study from "./pages/Study";
import EngineeringMathPage from "./pages/EngineeringMathPage";
import AlgorithmsPage from "./pages/AlgorithmsPage";
import TOCPage from "./pages/TOCPage";
import CompilerDesignPage from "./pages/CompilerDesignPage";
import OperatingSystemPage from "./pages/OperatingSystemPage";
import DBMSPage from "./pages/DBMSPage"; 
import ComputerNetworksPage from "./pages/ComputerNetworksPage";
import SoftwareEngineeringPage from "./pages/SoftwareEngineeringPage";
import DigitalLogicPage from "./pages/DigitalLogicPage";
import COAPage from "./pages/COAPage";
import ProgrammingDSPage from "./pages/ProgrammingAndDSPage";
import VerbalAbility from "./pages/VerbalAbility"; 
import NumericalAbility from "./pages/NumericalAbility";
import LogicalReasoning from "./pages/LogicalReasoning";
import DigitalLogicTest from "./pages/DigitalLogicTest";
import COATest from "./pages/COATest";
import AlgorithmsTest from "./pages/AlgorithmsTest";
import TOCTest from "./pages/TOCTest";
import OSTest from "./pages/OSTest";
import DBMSTest from "./pages/DBMSTest";
import NetworksTest from "./pages/NetworksTest";
import EnggMathsTest from "./pages/EnggMathsTest";
import VerbalTest from "./pages/VerbalTest";
import NumericalTest from "./pages/NumericalTest";
import ReasoningTest from "./pages/ReasoningTest";
import FullGateTest from './pages/FullGateTest';
import Fulltest2 from './pages/Fulltest2';
import Fulltest3 from './pages/Fulltest3';


//const auth = getAuth(app);


function App() {
   
  
  return (
    <Router>
      <Routes>
        {/* Show AuthForm at root URL */}
        <Route path="/" element={<AuthForm />} />

        {/* Go to Landing after login/signup */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/dashboard" element={
             <PrivateRoute>
             <Dashboard />
             </PrivateRoute>
           } />

        {/* Main dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Subjects overview page */}
        <Route path="/subjects" element={<Subjects />} />

        <Route path="/aptitude" element={<Aptitude />} />
        <Route path="/mocktest" element={<MockTest />} />
        <Route path="/Study" element={<Study />} />
        <Route path="/subject/Engineering Mathematics" element={<EngineeringMathPage />} />
        <Route path="/subject/Algorithms" element={<AlgorithmsPage />} /> 
        <Route path="/subject/Theory of Computation (TOC)" element={<TOCPage />} />
        <Route path="/subject/Compiler Design" element={<CompilerDesignPage />} /> 
        <Route path="/subject/Operating System (OS)" element={<OperatingSystemPage />} />
        <Route path="/subject/Databases (DBMS)" element={<DBMSPage />} />
        <Route path="/subject/Computer Networks" element={<ComputerNetworksPage />} />
        <Route path="/subject/Software Engineering and Web Technologies" element={<SoftwareEngineeringPage />} />
        <Route path="/subject/Digital Logic" element={<DigitalLogicPage />} />
        <Route path="/subject/Computer Organization and Architecture (COA)" element={<COAPage />} />
        <Route path="/subject/Programming and Data Structures" element={<ProgrammingDSPage />} />
        <Route path="/aptitude/verbal" element={<VerbalAbility />} />
        <Route path="/aptitude/numerical" element={<NumericalAbility />} />
        <Route path="/aptitude/reasoning" element={<LogicalReasoning />} />
        <Route path="/mocktest/DigitalLogicTest" element={<DigitalLogicTest />} />
        <Route path="/mocktest/COATest" element={<COATest />} />
        <Route path="/mocktest/AlgorithmsTest" element={<AlgorithmsTest />} />
        <Route path="/mocktest/TOCTest" element={<TOCTest />} />
        <Route path="/mocktest/OSTest" element={<OSTest />} />
        <Route path="/mocktest/DBMSTest" element={<DBMSTest />} />
        <Route path="/mocktest/NetworksTest" element={<NetworksTest />} />
        <Route path="/mocktest/EnggMathsTest" element={<EnggMathsTest />} />
        <Route path="/mocktest/VerbalTest" element={<VerbalTest />} />
        <Route path="/mocktest/NumericalTest" element={<NumericalTest />} />
        <Route path="/mocktest/ReasoningTest" element={<ReasoningTest />} />
        <Route path="/mocktest/FullTest1" element={<FullGateTest />} />
        <Route path="/mocktest/FullTest2" element={<Fulltest2 />} />
        <Route path="/mocktest/FullTest3" element={<Fulltest3 />} />
      </Routes>
    </Router>
  );
}

export default App;


