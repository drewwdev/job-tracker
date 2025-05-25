import { useEffect, useState } from "react";
import { jobApplicationListSchema } from "../../../shared/schemas/jobApplication.ts";
import axios from "axios";
import { Link } from "react-router-dom";

type JobApplication = z.infer<typeof jobApplicationListSchema>[number];

export default function JobApplicationList() {
  const [applications, setApplications] = useState<JobApplication[]>([]);

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

  return (
    <div className="max-w-5xl mx-auto flex flex-wrap gap-4 p-4">
      {applications.map((app) => (
        <Link
          key={app.id}
          to={`/application/${app.id}`}
          className="w-full sm:w-[calc(50%-0.5rem)] text-inherit no-underline">
          <div className="h-full bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
            <h2 className="text-lg font-semibold text-gray-900">
              {app.job_title}
            </h2>
            <p className="text-sm text-gray-700">{app.company_name}</p>
            <p className="text-sm text-gray-700">{app.location}</p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Status:</span>{" "}
              {app.application_status}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Applied on:</span>{" "}
              {new Date(app.applied_date).toLocaleDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
