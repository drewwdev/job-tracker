import db from "../db";

type Tag = {
  name: string;
};

async function createTag(tagData: Tag): Promise<number> {
  const { name } = tagData;

  try {
    const result = await db.query(
      "INSERT INTO tags (name) VALUES ($1) RETURNING id",
      [name]
    );

    return result.rows[0].id;
  } catch (err: any) {
    if (err.code === "23505") {
      throw new Error("TAG_EXISTS");
    }
    throw err;
  }
}

async function getTagByName(name: string) {
  const result = await db.query("SELECT * FROM tags WHERE name = $1", [name]);
  return result.rows[0];
}

async function getTagById(id: number) {
  const result = await db.query("SELECT * FROM tags WHERE id = $1", [id]);
  return result.rows[0];
}

async function updateTag(id: number, updates: { name?: string }) {
  const fields: string[] = [];
  const values: any[] = [];
  let index = 1;

  if (updates.name) {
    fields.push(`name = $${index++}`);
    values.push(updates.name);
  }

  if (fields.length === 0) return null;

  values.push(id);

  const result = await db.query(
    `UPDATE tags SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`,
    values
  );

  return result.rows[0];
}

async function deleteTag(id: number) {
  const result = await db.query("DELETE FROM tags WHERE id = $1 RETURNING *", [
    id,
  ]);
  return result.rows[0];
}

async function getAllTags() {
  const result = await db.query("SELECT * FROM tags ORDER BY name ASC");
  return result.rows;
}

export {
  createTag,
  getTagById,
  getTagByName,
  updateTag,
  deleteTag,
  getAllTags,
};
