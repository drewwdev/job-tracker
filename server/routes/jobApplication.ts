import express, { Request, Response } from "express";
import {
  createJobApplicationSchema,
  CreateJobApplicationInput,
} from "../../shared/schemas/jobApplication";
import {
  createJobApplication,
  getJobApplicationById,
  updateJobApplication,
  deleteJobApplication,
  getJobApplications,
} from "../models/jobApplication";

const router = express.Router();

// GET all job applications
router.get("/", async (_req: Request, res: Response) => {
  try {
    const jobApplications = await getJobApplications();
    res.json(jobApplications);
  } catch (err) {
    console.error("Failed to fetch job applications", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST a new job application
router.post("/", async (req: Request, res: Response) => {
  const result = createJobApplicationSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json(result.error.format());
    return;
  }

  try {
    const newJobApp = await createJobApplication(result.data);
    res.status(201).json(newJobApp);
  } catch (err) {
    console.error("Failed to create job application", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET a single job application by ID
router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  try {
    const jobApp = await getJobApplicationById(id);

    if (!jobApp) {
      res.status(404).json({ error: "Job application not found" });
      return;
    }

    res.json(jobApp);
  } catch (err) {
    console.error("Failed to fetch job application", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT (update) a job application
router.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = createJobApplicationSchema.safeParse(req.body);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  if (!result.success) {
    res.status(400).json(result.error.format());
    return;
  }

  try {
    await updateJobApplication(id, result.data);
    const fullJob = await getJobApplicationById(id);

    if (!fullJob) {
      res.status(404).json({ error: "Job application not found" });
      return;
    }

    res.json(fullJob);
  } catch (err) {
    console.error("Failed to update job application", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE a job application
router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  try {
    const deletedJobApp = await deleteJobApplication(id);

    if (!deletedJobApp) {
      res.status(404).json({ error: "Job application not found" });
      return;
    }

    res.json(deletedJobApp);
  } catch (err) {
    console.error("Failed to delete job application", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
