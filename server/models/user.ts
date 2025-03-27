import db from "../db";

type User = {
  email: string;
  username?: string;
  password?: string;
  provider: "local" | "google" | "github";
  provider_id?: string;
};

async function getUserById(userId: number) {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
  return result.rows[0];
}

async function createUser(userData: User): Promise<number> {
  const { email, username, password, provider, provider_id } = userData;

  try {
    const result = await db.query(
      "INSERT INTO users (email, username, password_hash, provider, provider_id) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [email, username, password, provider, provider_id]
    );

    return result.rows[0].id;
  } catch (err: any) {
    if (err.code === "23505") {
      throw new Error("EMAIL_TAKEN");
    }
    throw err;
  }
}

async function updateUser(userId: number, userData: Partial<User>) {
  const keys = Object.keys(userData) as (keyof User)[];
  if (keys.length === 0) return null;

  const setClause = keys
    .map((key, index) => {
      const dbField = key === "password" ? "password_hash" : key;
      return `${dbField} = $${index + 1}`;
    })
    .join(", ");

  const values = keys.map((key) => userData[key]);

  const result = await db.query(
    `UPDATE users SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, userId]
  );

  return result.rows[0];
}

async function deleteUser(userId: number) {
  await db.query("DELETE FROM users WHERE id = $1", [userId]);
}

export { getUserById, createUser, updateUser, deleteUser };
