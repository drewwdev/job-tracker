import React from "react";
import JobApplicationList from "../components/JobApplicationList";

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">
        My Job Applications
      </h1>

      <JobApplicationList />
    </div>
  );
}
