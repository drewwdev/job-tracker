import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function JobApplicationDetail() {
  const { id } = useParams();
  const [job, setJob] = useState<{
    id: number;
    job_title: string;
    company_name: string;
    location: string;
    application_status: string;
    job_posting_url: string;
    notes: string;
  } | null>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/job-applications/${id}`)
      .then((res) => setJob(res.data))
      .catch((err) => console.error("Failed to load job", err));
  }, [id]);

  if (!job) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{job.job_title}</h1>
      <p className="text-gray-700">{job.company_name}</p>
      <p>Status: {job.application_status}</p>
      <p>Location: {job.location}</p>
      <p>URL: {job.job_posting_url}</p>
      <p>Notes: {job.notes}</p>

      {/* Tags and edit UI will go here next */}
    </div>
  );
}
