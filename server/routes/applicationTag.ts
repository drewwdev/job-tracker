import express, { Request, Response } from "express";
import { z } from "zod";
import {
  createApplicationTag,
  getApplicationTagsByJobId,
  deleteApplicationTag,
  deleteApplicationTagByJobAndTag,
} from "../models/applicationTag";
import { findOrCreateTagByName } from "../models/tag";
import {
  createApplicationTagSchema,
  createApplicationTagByNameSchema,
} from "../../shared/schemas/applicationTag";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const result = createApplicationTagSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json(result.error.format());
    return;
  }

  try {
    const newId = await createApplicationTag(result.data);
    res.status(201).json({ applicationTagId: newId });
  } catch (err: any) {
    if (err.message === "APPLICATION_TAG_EXISTS") {
      res
        .status(409)
        .json({ error: "This tag is already assigned to the application." });
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
});

router.post("/by-name", async (req: Request, res: Response) => {
  const result = createApplicationTagByNameSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json(result.error.format());
    return;
  }

  const { job_application_id, tag_name } = result.data;

  try {
    const tag = await findOrCreateTagByName(tag_name.trim());

    const newId = await createApplicationTag({
      job_application_id,
      tag_id: tag.id,
    });

    res.status(201).json({ applicationTagId: newId, tag });
  } catch (err: any) {
    if (err.message === "APPLICATION_TAG_EXISTS") {
      res
        .status(409)
        .json({ error: "This tag is already assigned to the application." });
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
});

router.get("/job/:jobId", async (req: Request, res: Response) => {
  const jobId = Number(req.params.jobId);

  if (isNaN(jobId)) {
    res.status(400).json({ error: "Invalid job application ID" });
    return;
  }

  try {
    const tags = await getApplicationTagsByJobId(jobId);
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const tagId = Number(req.params.id);

  if (isNaN(tagId)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  try {
    const deleted = await deleteApplicationTag(tagId);
    if (!deleted) {
      res.status(404).json({ error: "Application tag not found" });
      return;
    }
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.delete("/by-composite", async (req: Request, res: Response) => {
  const schema = z.object({
    job_application_id: z.number(),
    tag_id: z.number(),
  });
  const result = schema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json(result.error.format());
    return;
  }

  try {
    const deleted = await deleteApplicationTagByJobAndTag(
      result.data.job_application_id,
      result.data.tag_id
    );
    if (!deleted) {
      res.status(404).json({ error: "Application tag not found" });
      return;
    }
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
