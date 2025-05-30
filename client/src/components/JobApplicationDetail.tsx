import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import TagManager from "./TagManager";

export default function JobApplicationDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [job, setJob] = useState<{
    id: number;
    job_title: string;
    company_name: string;
    location: string;
    application_status: string;
    job_posting_url: string;
    notes: string;
    tags?: { name: string; color_class: string }[];
    applied_date?: string;
  } | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(
    location.state?.success || false
  );
  const [clickEdit, setClickEdit] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/job-applications/${id}`)
      .then((res) => setJob(res.data))
      .catch((err) => console.error("Failed to load job", err));
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/job-applications/${id}`);
      navigate("/", { state: { source: "real" } });
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
        tags: (job.tags || []).map((t) => t.name),
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
      <div className="max-w-sm mx-auto bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Job Title
          </label>
          <input
            type="text"
            value={job.job_title || ""}
            onChange={(e) => setJob({ ...job, job_title: e.target.value })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Job Title"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Company Name
          </label>
          <input
            type="text"
            value={job.company_name || ""}
            onChange={(e) => setJob({ ...job, company_name: e.target.value })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Company Name"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Location
          </label>
          <input
            type="text"
            value={job.location || ""}
            onChange={(e) => setJob({ ...job, location: e.target.value })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Location"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Status
          </label>
          <select
            value={job.application_status || ""}
            onChange={(e) =>
              setJob({ ...job, application_status: e.target.value })
            }
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none 
                 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                 inline-flex items-center w-full dark:bg-blue-600 dark:hover:bg-blue-700 
                 dark:focus:ring-blue-800">
            <option value="wishlist">Wishlist</option>
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Job Posting URL
          </label>
          <input
            type="text"
            value={job.job_posting_url || ""}
            onChange={(e) =>
              setJob({ ...job, job_posting_url: e.target.value })
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Job Posting URL"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Notes
          </label>
          <textarea
            value={job.notes || ""}
            onChange={(e) => setJob({ ...job, notes: e.target.value })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Notes"
          />
        </div>

        <TagManager
          jobId={job.id}
          tags={Array.isArray(job.tags) ? job.tags : []}
          setTags={(tags) => setJob({ ...job, tags })}
        />

        <button
          onClick={handleApplyChanges}
          className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-green-600 
               rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none 
               focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 
               dark:focus:ring-green-800">
          Apply Changes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      {showSuccess && (
        <div className="mb-4 rounded-md bg-green-100 p-3 text-sm text-green-800 border border-green-300">
          Job successfully created! You can now add tags.
        </div>
      )}

      <div className="mb-5">
        <h1 className="text-lg font-semibold text-gray-900">{job.job_title}</h1>
      </div>

      <div className="mb-5">
        <p className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
          Company Name
        </p>
        <p className="text-sm text-gray-700">{job.company_name}</p>
      </div>

      <div className="mb-5">
        <p className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
          Status
        </p>
        <p className="text-sm text-gray-700">{job.application_status}</p>
      </div>

      <div className="mb-5">
        <p className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
          Location
        </p>
        <p className="text-sm text-gray-700">{job.location}</p>
      </div>

      <div className="mb-5">
        <p className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
          Job Posting URL
        </p>
        <a
          href={job.job_posting_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline break-words">
          {job.job_posting_url}
        </a>
      </div>

      <div className="mb-5">
        <p className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
          Applied Date
        </p>
        <p className="text-sm text-gray-700">
          {job.applied_date
            ? new Date(job.applied_date).toLocaleDateString()
            : "Not specified"}
        </p>
      </div>

      <div className="mb-5">
        <p className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
          Notes
        </p>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{job.notes}</p>
      </div>

      <div className="mb-5">
        <p className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
          Tags
        </p>
        <div className="flex flex-wrap gap-2">
          {job.tags?.map((tag) => (
            <span
              key={tag.name}
              className={`px-2 py-1 text-xs rounded-full font-semibold ${tag.color_class}`}>
              {tag.name}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={() => setClickEdit(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
          Delete
        </button>
      </div>
    </div>
  );
}
