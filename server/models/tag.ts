import db from "../db";

export async function getAllTags() {
  const result = await db.query(
    `SELECT name, color_class FROM tags ORDER BY name ASC`
  );
  return result.rows;
}

export async function createTagIfNotExists(name: string, color_class: string) {
  const result = await db.query(
    `INSERT INTO tags (name, color_class)
     VALUES ($1, $2)
     ON CONFLICT (name) DO NOTHING
     RETURNING name, color_class`,
    [name, color_class]
  );

  if (result.rows.length > 0) {
    return result.rows[0];
  }

  // Already exists, return existing tag
  const existing = await db.query(
    `SELECT name, color_class FROM tags WHERE name = $1`,
    [name]
  );

  return existing.rows[0];
}
