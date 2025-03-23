import express, { Request, Response } from "express";
import { z } from "zod";
import {
  createJobApplicationSchema,
  CreateJobApplicationInput,
} from "../../shared/schemas/jobApplication";
import {
  createJobApplication,
  getJobApplicationById,
} from "../models/jobApplication";

const router = express.Router();

// POST /job-applications – Create a new job application
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const result = createJobApplicationSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json(result.error.format());
    return;
  }

  try {
    const newJobApplicationId = await createJobApplication(result.data);
    res.status(201).json({ jobApplicationId: newJobApplicationId });
  } catch (err: any) {
    console.error("❌ POST /job-applications error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /job-applications/:id – Get a job application by ID
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const jobApplicationId = Number(req.params.id);

  if (isNaN(jobApplicationId)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  try {
    const jobApp = await getJobApplicationById(jobApplicationId);

    if (!jobApp) {
      res.status(404).json({ error: "Job application not found" });
      return;
    }

    res.json(jobApp);
  } catch (err) {
    console.error("❌ GET /job-applications/:id error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
