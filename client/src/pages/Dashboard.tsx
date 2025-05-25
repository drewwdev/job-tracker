import React from "react";
import JobApplicationList from "../components/JobApplicationList";

export default function Dashboard() {
  return (
    <div className="">
      <h1 className="p-4">My Job Applications</h1>
      <JobApplicationList />
    </div>
  );
}
