import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import JobApplicationList from "../components/JobApplicationList";
import axios from "axios";
import { jobApplicationListSchema } from "../../../shared/schemas/jobApplication";
import { z } from "zod";
import { useShowDemo } from "../context/ShowDemoContext";

type JobApplication = z.infer<typeof jobApplicationListSchema>[number];

export default function Dashboard() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { showDemoJobs, setShowDemoJobs } = useShowDemo();

  useEffect(() => {
    axios
      .get("http://localhost:3000/job-applications")
      .then((res) => {
        const parsed = jobApplicationListSchema.safeParse(res.data);
        if (parsed.success) {
          setApplications(parsed.data);
        } else {
          console.error("Invalid data format", parsed.error);
        }
      })
      .catch((err) => console.error("Failed to fetch applications", err));
  }, []);

  const filteredApplications = applications
    .filter((app) =>
      showDemoJobs
        ? app.is_demo || (app.tags ?? []).includes("demo")
        : !app.is_demo && !(app.tags ?? []).includes("demo")
    )
    .filter((app) =>
      [
        app.job_title,
        app.company_name,
        app.location,
        app.application_status,
        ...(app.tags || []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  return (
    <div className="w-full px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 border-b pb-2">
          My Job Applications
        </h1>
        <button
          onClick={() => setShowDemoJobs((prev) => !prev)}
          className="text-sm px-3 py-1 border rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition">
          {showDemoJobs ? "Show Real Jobs" : "Show Demo Jobs"}
        </button>
      </div>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <JobApplicationList
        applications={filteredApplications}
        showDemo={showDemoJobs}
      />
    </div>
  );
}
