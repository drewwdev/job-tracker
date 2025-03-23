import express from "express";
import { Request, Response } from "express";
import { z } from "zod";
import { createUser, getUserById } from "../models/user";
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

  try {
    const user = await getUserById(userId);
    if (!user) res.status(404).json({ error: "User not found" });
    return;

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
