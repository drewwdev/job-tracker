import express, { Request, Response } from "express";
import { z } from "zod";
import {
  getTagById,
  createTag,
  getTagByNameAndUserId,
  updateTag,
  deleteTag,
  getTagsByUserId,
} from "../models/tag";
import {
  createTagSchema,
  addTagToApplicationSchema,
  CreateTagInput,
  AddTagToApplicationInput,
  updateTagSchema,
  UpdateTagInput,
} from "../../shared/schemas/tag";

const router = express.Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createTagSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors });
      return;
    }

    const { name, user_id } = parsed.data;

    const existingTag = await getTagByNameAndUserId(name, user_id);
    if (existingTag) {
      res.status(400).json({ error: "Tag already exists" });
      return;
    }

    const tagId = await createTag({ user_id, name });
    if (!tagId) {
      console.error("Failed to create tag");
      res.status(500).json({ error: "Failed to create tag" });
      return;
    }

    const createdTag = await getTagById(tagId);
    if (!createdTag) {
      console.error("Failed to fetch created tag");
      res.status(500).json({ error: "Failed to fetch created tag" });
      return;
    }
    res.status(201).json({ message: "Tag created", tag: createdTag });
  } catch (error) {
    console.error("Error creating tag:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const parsedId = z.number().int().safeParse(Number(id));
  if (!parsedId.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const tag = await getTagById(parsedId.data);
  if (!tag) {
    res.status(404).json({ error: "Tag not found" });
    return;
  }
  res.status(200).json(tag);
});

router.patch("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const parsedId = z.number().int().safeParse(Number(id));

  if (!parsedId.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const tag = await getTagById(parsedId.data);
  if (!tag) {
    res.status(404).json({ error: "Tag not found" });
    return;
  }

  const parsed = updateTagSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors });
    return;
  }

  const updatedTag = await updateTag(parsedId.data, parsed.data);
  res.status(200).json({ message: "Tag updated", tag: updatedTag });
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const parsedId = z.number().int().safeParse(Number(id));

  if (!parsedId.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const tag = await getTagById(parsedId.data);
  if (!tag) {
    res.status(404).json({ error: "Tag not found" });
    return;
  }

  await deleteTag(parsedId.data);
  res.status(200).json({ message: "Tag deleted" });
});

router.get("/", async (req: Request, res: Response): Promise<void> => {
  const userIdParam = req.query.user_id;

  const parsed = z.coerce.number().int().safeParse(userIdParam);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid user_id" });
    return;
  }

  const tags = await getTagsByUserId(parsed.data);
  res.status(200).json({ tags });
});

export default router;
