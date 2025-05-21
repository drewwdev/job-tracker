import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import TagManager from "./TagManager";

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

  const [clickEdit, setClickEdit] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/job-applications/${id}`)
      .then((res) => setJob(res.data))
      .catch((err) => console.error("Failed to load job", err));
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/job-applications/${id}`);
      window.location.href = "/";
    } catch (err) {
      console.error("Failed to delete job application", err);
    }
  };

  const handleApplyChanges = async () => {
    try {
      if (!job) return;

      const payload = {
        job_title: job.job_title,
        company_name: job.company_name,
        location: job.location || undefined,
        application_status: job.application_status || undefined,
        job_posting_url: job.job_posting_url || undefined,
        applied_date: job.applied_date ?? undefined,
        notes: job.notes || undefined,
      };

      await axios.put(`http://localhost:3000/job-applications/${id}`, payload);
      setClickEdit(false);
    } catch (err) {
      console.error("Failed to apply changes", err);
    }
  };

  if (!job) return <p>Loading...</p>;

  if (clickEdit) {
    return (
      <div className="">
        <h1 className="">
          <input
            type="text"
            value={job.job_title || ""}
            onChange={(e) => setJob({ ...job, job_title: e.target.value })}
            className=""
            placeholder="Job Title"
          />
        </h1>
        <p className="">
          <input
            type="text"
            value={job.company_name || ""}
            onChange={(e) => setJob({ ...job, company_name: e.target.value })}
            className=""
            placeholder="Company Name"
          />
        </p>
        <p>
          Status:
          <select
            value={job.application_status || ""}
            onChange={(e) =>
              setJob({ ...job, application_status: e.target.value })
            }
            className="">
            <option value="wishlist">Wishlist</option>
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </p>
        <p>
          Location:
          <input
            type="text"
            value={job.location || ""}
            onChange={(e) => setJob({ ...job, location: e.target.value })}
            className=""
            placeholder="Location"
          />
        </p>
        <p>
          URL:
          <input
            type="text"
            value={job.job_posting_url || ""}
            onChange={(e) =>
              setJob({ ...job, job_posting_url: e.target.value })
            }
            className=""
            placeholder="Job Posting URL"
          />
        </p>
        <p>
          Notes:
          <textarea
            value={job.notes || ""}
            onChange={(e) => setJob({ ...job, notes: e.target.value })}
            className=""
            placeholder="Notes"
          />
        </p>

        <button
          onClick={() => {
            handleApplyChanges();
          }}
          className="">
          Apply Changes
        </button>
        <TagManager jobApplicationId={job.id} />
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="">{job.job_title}</h1>
      <p className="">{job.company_name}</p>
      <p>Status: {job.application_status}</p>
      <p>Location: {job.location}</p>
      <p>URL: {job.job_posting_url}</p>
      <p>Notes: {job.notes}</p>

      <div className="">
        <button
          onClick={() => {
            setClickEdit(true);
          }}
          className="">
          Edit
        </button>
        <button
          onClick={() => {
            handleDelete();
          }}
          className="">
          Delete
        </button>
      </div>
      <TagManager jobApplicationId={job.id} />
    </div>
  );
}
