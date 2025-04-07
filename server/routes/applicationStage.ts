import express, { Request, Response } from "express";
import { z } from "zod";
import {
  createApplicationStage,
  getApplicationStageById,
} from "../models/applicationStage";
import {
  createApplicationStageSchema,
  CreateApplicationStageInput,
} from "../../shared/schemas/applicationStage";

const router = express.Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const result = createApplicationStageSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json(result.error.format());
    return;
  }

  try {
    const newApplicationStageId = await createApplicationStage(result.data);
    res.status(201).json({ applicationStageId: newApplicationStageId });
  } catch (err: any) {
    if (err.message === "APPLICATION_STAGE_NAME_TAKEN") {
      res.status(409).json({ error: "Application stage name already in use" });
      return;
    }

    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const applicationStageId = parseInt(req.params.id, 10);
  if (isNaN(applicationStageId)) {
    res.status(400).json({ error: "Invalid application stage ID" });
    return;
  }
  try {
    const applicationStage = await getApplicationStageById(applicationStageId);
    if (!applicationStage) {
      res.status(404).json({ error: "Application stage not found" });
      return;
    }
    res.status(200).json(applicationStage);
  } catch (err: any) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
