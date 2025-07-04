import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createJobApplicationSchema } from "../../../shared/schemas/jobApplication";
import { z } from "zod";

type CreateJobAppInput = z.infer<typeof createJobApplicationSchema>;

type Tag = {
  name: string;
  color_class: string;
};

export default function JobApplicationForm() {
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<CreateJobAppInput>({
    job_title: "",
    company_name: "",
    location: "",
    application_status: "wishlist",
    job_posting_url: "",
    applied_date: today,
    notes: "",
    tags: [],
  });

  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/tags")
      .then((res) => setAvailableTags(res.data))
      .catch((err) => console.error("Failed to load tags", err));
  }, []);

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
      const response = await axios.post(
        "http://localhost:3000/job-applications",
        result.data
      );
      const newId = response.data.id;

      setSuccess(true);
      setError(null);

      navigate(`/application/${newId}`, { state: { success: true } });
    } catch (err) {
      console.error("Failed to save job application", err);
      setError("Failed to save job application. Please try again.");
      setSuccess(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Job Title
        </label>
        <input
          type="text"
          name="job_title"
          value={formData.job_title}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Company Name
        </label>
        <input
          type="text"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Status
        </label>
        <select
          name="application_status"
          value={formData.application_status}
          onChange={handleChange}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
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
          type="url"
          name="job_posting_url"
          value={formData.job_posting_url}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Applied Date
        </label>
        <input
          type="date"
          name="applied_date"
          value={formData.applied_date}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => {
            const isSelected = formData.tags.includes(tag.name);
            return (
              <label
                key={tag.name}
                className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium border 
            ${
              isSelected
                ? tag.color_class
                : "bg-white text-gray-700 border-gray-300"
            }`}>
                <input
                  type="checkbox"
                  value={tag.name}
                  checked={isSelected}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData((prev) => ({
                      ...prev,
                      tags: checked
                        ? [...prev.tags, tag.name]
                        : prev.tags.filter((t) => t !== tag.name),
                    }));
                  }}
                  className="hidden"
                />
                {tag.name}
              </label>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-800 border border-red-300">
          {error}
        </div>
      )}
      {success && <p className="py-4">Application saved!</p>}

      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Save Job Application
      </button>
    </form>
  );
}
