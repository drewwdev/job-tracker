import express, { Request, Response } from "express";
import { createUserSchema, loginUserSchema } from "../../shared/schemas/user";
import { userPayloadSchema } from "../../shared/schemas/userPayload";
import { createUser, getUserByEmail, User } from "../models/user";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt";
import { z } from "zod";

const router = express.Router();

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const parsed = loginUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors });
    return;
  }

  const { email, password } = parsed.data;

  const user = await getUserByEmail(email);
  if (!user || user.provider !== "local") {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const payload = userPayloadSchema.parse({
    id: user.id.toString(),
    email: user.email,
    username: user.username,
    provider: user.provider,
    provider_id: user.provider_id || undefined,
  });

  const token = signToken(payload);
  res.status(200).json({ message: "Login successful", token });
});

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const parsed = createUserSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors });
    return;
  }

  const { username, email, password } = parsed.data;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    res.status(400).json({ error: "User with this email already exists" });
    return;
  }

  try {
    const newUser = await createUser({
      email,
      username,
      password,
      provider: "local",
    });

    const payload = userPayloadSchema.parse({
      id: newUser.id.toString(),
      email: newUser.email,
      username: newUser.username,
      provider: newUser.provider,
      provider_id: newUser.provider_id || undefined,
    });

    const token = signToken(payload);

    res.status(201).json({ message: "User created", token });
  } catch (err: any) {
    if (err.message === "PASSWORD_REQUIRED") {
      res.status(400).json({ error: "Password is required for local users" });
      return;
    }

    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
