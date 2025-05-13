import { useState } from "react";
import axios from "axios";
import { createJobApplicationSchema } from "../../../shared/schemas/jobApplication";
import { z } from "zod";

type CreateJobAppInput = z.infer<typeof createJobApplicationSchema>;

export default function JobApplicationForm() {
  const [formData, setFormData] = useState<CreateJobAppInput>({
    job_title: "",
    company_name: "",
    location: "",
    application_status: "wishlist",
    job_posting_url: "",
    applied_date: "",
    notes: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = createJobApplicationSchema.safeParse(formData);

    if (!result.success) {
      setError("Invalid form data. Please check your inputs.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/job-applications", result.data);
      setSuccess(true);
      setError(null);
      setFormData({
        job_title: "",
        company_name: "",
        location: "",
        application_status: "wishlist",
        job_posting_url: "",
        applied_date: "",
        notes: "",
      });
    } catch (err) {
      console.error("Failed to save job application", err);
      setError("Failed to save job application. Please try again.");
      setSuccess(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded shadow">
      <div>
        <label className="block text-sm font-medium">Job Title</label>
        <input
          type="text"
          name="job_title"
          value={formData.job_title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Company Name</label>
        <input
          type="text"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          name="application_status"
          value={formData.application_status}
          onChange={handleChange}
          className="w-full border p-2 rounded">
          <option value="wishlist">Wishlist</option>
          <option value="applied">Applied</option>
          <option value="interviewing">Interviewing</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Job Posting URL</label>
        <input
          type="url"
          name="job_posting_url"
          value={formData.job_posting_url}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Applied Date</label>
        <input
          type="date"
          name="applied_date"
          value={formData.applied_date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">Application saved!</p>}

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded">
        Save Job Application
      </button>
    </form>
  );
}
