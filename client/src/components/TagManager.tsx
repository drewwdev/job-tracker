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
    <div className="">
      <h2 className="">Tags</h2>

      <div className="">
        <input
          type="text"
          placeholder="New tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className=""
        />
        <button onClick={handleAddTag} className="">
          Add
        </button>
      </div>

      <div className="">
        {tags.map((tag) =>
          editingTagId === tag.id ? (
            <div key={tag.id} className="">
              <input
                value={editingTagValue}
                onChange={(e) => setEditingTagValue(e.target.value)}
                className=""
              />
              <button onClick={() => handleEditTag(tag.id)}>
                <Check size={16} />
              </button>
              <button onClick={() => setEditingTagId(null)}>
                <X size={16} />
              </button>
            </div>
          ) : (
            <div key={tag.id} className="">
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
    </div>
  );
}
