import db from "../db";
import bcrypt from "bcrypt";

export type User = {
  id: number;
  email: string;
  username?: string;
  provider: "local" | "google" | "github";
  provider_id?: string;
};

export type NewUserInput = {
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

async function createUser(userData: NewUserInput): Promise<User> {
  const { email, username, password, provider, provider_id } = userData;

  let hashedPassword: string | null = null;

  if (provider === "local") {
    if (!password) throw new Error("PASSWORD_REQUIRED");
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const result = await db.query(
    `INSERT INTO users (email, username, password_hash, provider, provider_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, username, provider, provider_id`,
    [email, username, hashedPassword, provider, provider_id]
  );

  return result.rows[0];
}

type UpdateUserInput = Partial<User> & { password?: string };

async function updateUser(userId: number, userData: UpdateUserInput) {
  const keys = Object.keys(userData) as (keyof UpdateUserInput)[];
  if (keys.length === 0) return null;

  const setClause = keys
    .map((key, index) => {
      const dbField = key === "password" ? "password_hash" : key;
      return `${dbField} = $${index + 1}`;
    })
    .join(", ");

  const values = keys.map((key) => {
    if (key === "password") {
      return bcrypt.hashSync(userData[key] as string, 10);
    }
    return userData[key];
  });

  const result = await db.query(
    `UPDATE users SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, userId]
  );

  return result.rows[0];
}

async function deleteUser(userId: number) {
  await db.query("DELETE FROM users WHERE id = $1", [userId]);
}

async function getUserByEmail(email: string) {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
}

export { getUserById, createUser, updateUser, deleteUser, getUserByEmail };
