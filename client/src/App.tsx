import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import JobApplicationForm from "./pages/JobApplicationForm";
import Header from "./components/Header";
import JobApplicationDetail from "./components/JobApplicationDetail";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new" element={<JobApplicationForm />} />
        <Route path="/application/:id" element={<JobApplicationDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
