import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash, Check, X } from "lucide-react";

type Tag = { id: number; name: string };

interface TagManagerProps {
  jobApplicationId: number;
}

export default function TagManager({ jobApplicationId }: TagManagerProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState("");
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editingTagValue, setEditingTagValue] = useState("");

  useEffect(() => {
    fetchTags();
  }, [jobApplicationId]);

  const fetchTags = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/application-tags/job/${jobApplicationId}`
      );
      setTags(res.data.map((t: Tag) => ({ id: t.tag_id, name: t.name })));
    } catch (err) {
      console.error("Failed to fetch tags", err);
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;

    try {
      await axios.post("http://localhost:3000/application-tags/by-name", {
        job_application_id: jobApplicationId,
        tag_name: newTag.trim(),
      });
      setNewTag("");
      fetchTags();
    } catch (err) {
      console.error("Failed to add tag", err);
    }
  };

  const handleEditTag = async (tagId: number) => {
    try {
      await axios.patch(`http://localhost:3000/tags/${tagId}`, {
        name: editingTagValue.trim(),
      });
      setEditingTagId(null);
      fetchTags();
    } catch (err) {
      console.error("Failed to edit tag", err);
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    try {
      await axios.delete(
        `http://localhost:3000/application-tags/by-composite`,
        {
          data: {
            job_application_id: jobApplicationId,
            tag_id: tagId,
          },
        }
      );
      fetchTags();
    } catch (err) {
      console.error("Failed to delete tag", err);
    }
  };

  return (
    <>
      <h2 className="text-lg font-bold mb-2">Tags</h2>

      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="New tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <button
          onClick={handleAddTag}
          disabled={!newTag.trim()}
          className=" ml-2 bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {tags.map((tag) =>
          editingTagId === tag.id ? (
            <div key={tag.id} className="flex items-center gap-2">
              <input
                value={editingTagValue}
                onChange={(e) => setEditingTagValue(e.target.value)}
                className=" border rounded px-2 py-1"
              />
              <button onClick={() => handleEditTag(tag.id)}>
                <Check size={16} />
              </button>
              <button onClick={() => setEditingTagId(null)}>
                <X size={16} />
              </button>
            </div>
          ) : (
            <div key={tag.id} className="flex items-center gap-2">
              <span>{tag.name}</span>
              <button
                onClick={() => {
                  setEditingTagId(tag.id);
                  setEditingTagValue(tag.name);
                }}>
                <Pencil size={14} />
              </button>
              <button onClick={() => handleDeleteTag(tag.id)}>
                <Trash size={14} />
              </button>
            </div>
          )
        )}
      </div>
    </>
  );
}
