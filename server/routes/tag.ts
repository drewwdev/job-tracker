import express, { Request, Response } from "express";
import { z } from "zod";
import { getAllTags, createTagIfNotExists } from "../models/tag";

const router = express.Router();

// GET /tags - List all tags
router.get("/", async (_req: Request, res: Response) => {
  try {
    const tags = await getAllTags();
    res.json(tags);
  } catch (err) {
    console.error("Error fetching tags:", err);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
});

// POST /tags - Add new tag (or ensure it exists)
const createTagSchema = z.object({
  name: z.string().min(1),
  color_class: z.string().min(1),
});

router.post("/", async (req: Request, res: Response) => {
  const result = createTagSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json(result.error.format());
    return;
  }

  const { name, color_class } = result.data;

  try {
    const tag = await createTagIfNotExists(name, color_class);
    res.status(201).json(tag);
  } catch (err) {
    console.error("Error creating tag:", err);
    res.status(500).json({ error: "Failed to create tag" });
  }
});

export default router;
