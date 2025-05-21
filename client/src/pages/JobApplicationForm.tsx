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
    <form onSubmit={handleSubmit} className="">
      <div>
        <label className="">Job Title</label>
        <input
          type="text"
          name="job_title"
          value={formData.job_title}
          onChange={handleChange}
          className=""
          required
        />
      </div>

      <div>
        <label className="">Company Name</label>
        <input
          type="text"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          className=""
          required
        />
      </div>

      <div>
        <label className="">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className=""
        />
      </div>

      <div>
        <label className="">Status</label>
        <select
          name="application_status"
          value={formData.application_status}
          onChange={handleChange}
          className="">
          <option value="wishlist">Wishlist</option>
          <option value="applied">Applied</option>
          <option value="interviewing">Interviewing</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div>
        <label className="">Job Posting URL</label>
        <input
          type="url"
          name="job_posting_url"
          value={formData.job_posting_url}
          onChange={handleChange}
          className=""
        />
      </div>

      <div>
        <label className="">Applied Date</label>
        <input
          type="date"
          name="applied_date"
          value={formData.applied_date}
          onChange={handleChange}
          className=""
        />
      </div>

      <div>
        <label className="">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className=""
        />
      </div>

      {error && <p className="">{error}</p>}
      {success && <p className="">Application saved!</p>}

      <button type="submit" className="">
        Save Job Application
      </button>
    </form>
  );
}
