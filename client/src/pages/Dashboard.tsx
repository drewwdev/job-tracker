import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import JobApplicationList from "../components/JobApplicationList";
import axios from "axios";
import { jobApplicationListSchema } from "../../../shared/schemas/jobApplication";
import { z } from "zod";

type JobApplication = z.infer<typeof jobApplicationListSchema>[number];

export default function Dashboard() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredApplications = applications.filter((app) =>
    [app.job_title, app.company_name, app.location, app.application_status]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">
        My Job Applications
      </h1>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <JobApplicationList applications={filteredApplications} />
    </div>
  );
}
