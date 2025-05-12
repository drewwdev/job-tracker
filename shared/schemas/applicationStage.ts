import { z } from "zod";

export const createApplicationStageSchema = z.object({
  job_application_id: z.number().int(),
  stage_type: z.string().min(1),
  stage_date: z.string().optional(),
  notes: z.string().optional(),
});

export const updateApplicationStageSchema = z.object({
  job_application_id: z.number().int().optional(),
  stage_type: z.string().min(1).optional(),
  stage_date: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateApplicationStageInput = z.infer<
  typeof createApplicationStageSchema
>;
