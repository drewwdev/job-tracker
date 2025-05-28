import { memo, useState, useEffect } from "react";
import axios from "axios";

type TagManagerProps = {
  tags: { name: string; color_class: string }[];
  setTags: (tags: { name: string; color_class: string }[]) => void;
  jobId: number;
};

const colorOptions = [
  { label: "Gray", value: "bg-gray-200 text-gray-800" },
  { label: "Red", value: "bg-red-200 text-red-800" },
  { label: "Yellow", value: "bg-yellow-200 text-yellow-800" },
  { label: "Green", value: "bg-green-200 text-green-800" },
  { label: "Blue", value: "bg-blue-200 text-blue-800" },
  { label: "Purple", value: "bg-purple-200 text-purple-800" },
  { label: "Pink", value: "bg-pink-200 text-pink-800" },
];

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
  const [suggestions, setSuggestions] = useState<
    { name: string; color_class: string }[]
  >([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/tags")
      .then((res) => setAllTags(res.data))
      .catch((err) => console.error("Failed to load tags", err));
  }, []);

  if (!Array.isArray(tags)) {
    console.error("TagManager received invalid tags:", tags);
    return null;
  }

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

      setTags(Array.isArray(updatedRes.data.tags) ? updatedRes.data.tags : []);
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

  const updateTagColor = async (tagName: string, newColorClass: string) => {
    try {
      await axios.patch(`http://localhost:3000/tags/${tagName}`, {
        color_class: newColorClass,
      });

      const updatedJob = await axios.get(
        `http://localhost:3000/job-applications/${jobId}`
      );

      setTags(updatedJob.data.tags);
    } catch (err) {
      console.error("Failed to update tag color", err);
    }
  };

  return (
    <div className="mb-5">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Tags
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <div key={tag.name} className="flex items-center gap-2">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full border ${tag.color_class} shadow-sm`}>
              {tag.name}
            </span>
            <select
              value={tag.color_class}
              onChange={(e) => updateTagColor(tag.name, e.target.value)}
              className="text-sm rounded border border-gray-300 p-1">
              {colorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => removeTag(tag.name)}
              className="ml-1 text-red-500 hover:text-red-700 text-xs">
              &times;
            </button>
          </div>
        ))}
      </div>

      <div className="relative w-full mt-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => {
            const value = e.target.value;
            setNewTag(value);
            const filtered = allTags.filter(
              (tag) =>
                tag.name.includes(value.toLowerCase()) &&
                !tags.some((t) => t.name === tag.name)
            );
            setSuggestions(filtered);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
              setSuggestions([]);
            }
          }}
          placeholder="Add tag..."
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto w-full">
            {suggestions.map((tag) => (
              <li
                key={tag.name}
                onClick={() => {
                  const updated = [...tags, tag];
                  updateTagsInDb(updated.map((t) => t.name));
                  setTags(updated);
                  setNewTag("");
                  setSuggestions([]);
                }}
                className="cursor-pointer px-3 py-1 hover:bg-blue-100">
                {tag.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});

export default TagManager;
