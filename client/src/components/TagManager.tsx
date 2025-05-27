import { memo, useState, useEffect } from "react";
import axios from "axios";

type TagManagerProps = {
  tags: { name: string; color_class: string }[];
  setTags: (tags: { name: string; color_class: string }[]) => void;
  jobId: number;
};

const TagManager = memo(function TagManager({
  tags,
  setTags,
  jobId,
}: TagManagerProps) {
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [allTags, setAllTags] = useState<
    { name: string; color_class: string }[]
  >([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/tags")
      .then((res) => setAllTags(res.data))
      .catch((err) => console.error("Failed to load tags", err));
  }, []);

  const updateTagsInDb = async (updatedNames: string[]) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/job-applications/${jobId}`
      );
      const fullJob = res.data;

      const { applied_date, job_posting_url, notes, ...rest } = fullJob;

      const updatedJob = {
        ...rest,
        job_posting_url: job_posting_url ?? undefined,
        notes: notes ?? undefined,
        applied_date: applied_date ? new Date(applied_date) : undefined,
        tags: updatedNames,
      };

      const updatedRes = await axios.put(
        `http://localhost:3000/job-applications/${jobId}`,
        updatedJob
      );

      setTags(updatedRes.data.tags);
    } catch (err) {
      console.error("Failed to update tags", err);
    } finally {
      setLoading(false);
    }
  };
  const addTag = () => {
    const trimmed = newTag.trim().toLowerCase();
    if (!trimmed || tags.some((tag) => tag.name === trimmed)) return;

    const tagExists = allTags.find((t) => t.name === trimmed);
    const updated = [
      ...tags,
      {
        name: trimmed,
        color_class: tagExists
          ? tagExists.color_class
          : "bg-gray-200 text-gray-800",
      },
    ];

    updateTagsInDb(updated.map((t) => t.name));
    setNewTag("");
  };

  const removeTag = (tagToRemove: string) => {
    const updated = tags.filter((tag) => tag.name !== tagToRemove);
    updateTagsInDb(updated.map((t) => t.name));
  };

  return (
    <div className="mb-5">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Tags
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span
            key={tag.name}
            className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${tag.color_class}`}>
            {tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag.name)}
              className="ml-2 text-black hover:text-red-600">
              &times;
            </button>
          </span>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder="Add tag..."
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        />
        <button
          type="button"
          onClick={addTag}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
          Add
        </button>
      </div>
    </div>
  );
});

export default TagManager;
