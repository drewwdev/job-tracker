import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import JobApplicationForm from "./pages/JobApplicationForm";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new" element={<JobApplicationForm />} />
      </Routes>
    </Router>
  );
}

export default App;
