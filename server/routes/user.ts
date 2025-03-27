import express, { Request, Response } from "express";
import { z } from "zod";
import { createUser, getUserById, updateUser } from "../models/user";
import { createUserSchema, CreateUserInput } from "../../shared/schemas/user";

const router = express.Router();

// POST /users – Create a new user
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const result = createUserSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json(result.error.format());
    return;
  }

  try {
    const newUserId = await createUser(result.data);
    res.status(201).json({ userId: newUserId });
  } catch (err: any) {
    if (err.message === "EMAIL_TAKEN") {
      res.status(409).json({ error: "Email already in use" });
      return;
    }

    console.error("❌ POST /users error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /users/:id – Get user by ID
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.params.id);

  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:id", async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.params.id);

  const updateUserSchema = z
    .object({
      email: z.string().email().optional(),
      username: z.string().optional(),
      password: z.string().optional(),
    })
    .strict();

  const result = updateUserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.format());
    return;
  }

  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const updateData = result.data;

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ error: "No fields provided to update" });
      return;
    }

    const updatedUser = await updateUser(userId, updateData);

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /users/:id – Delete user by ID
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }
  try {
    const user = await getUserById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Delete user logic here (not implemented in this example)
    // await deleteUser(userId);

    res.status(204).send(); // No content
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
