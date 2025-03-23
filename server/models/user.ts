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

async function updateUser(userId: number, userData: User) {
  const { email, username, password, provider, provider_id } = userData;
  await db.query(
    "UPDATE users SET email = $1, username = $2, password_hash = $3, provider = $4, provider_id = $5 WHERE id = $6",
    [email, username, password, provider, provider_id, userId]
  );
}

async function deleteUser(userId: number) {
  await db.query("DELETE FROM users WHERE id = $1", [userId]);
}

export { getUserById, createUser, updateUser, deleteUser };
