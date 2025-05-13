import { useEffect, useState } from "react";
import { jobApplicationListSchema } from "../../../shared/schemas/jobApplication.ts";
import axios from "axios";

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
    <div className="space-y-4">
      {applications.map((app) => (
        <div
          key={app.id}
          className="p-4 border rounded shadow hover:bg-gray-50 transition">
          <h2 className="text-lg font-semibold">{app.title}</h2>
          <p className="text-sm text-gray-600">{app.company_name}</p>
          <p className="text-sm text-gray-500">{app.location}</p>
          <p className="text-sm">Status: {app.application_status}</p>
          <p className="text-sm">URL: {app.job_posting_url}</p>
          <p className="text-sm text-gray-500">
            Applied on: {new Date(app.applied_date).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500">Notes: {app.notes}</p>
        </div>
      ))}
    </div>
  );
}
