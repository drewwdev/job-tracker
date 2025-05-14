import { z } from "zod";

export const createApplicationTagSchema = z.object({
  job_application_id: z.number(),
  tag_id: z.number(),
});

export const createApplicationTagByNameSchema = z.object({
  job_application_id: z.number(),
  tag_name: z.string().min(1),
});

export type CreateApplicationTagByNameInput = z.infer<
  typeof createApplicationTagByNameSchema
>;

export type CreateApplicationTagInput = z.infer<
  typeof createApplicationTagSchema
>;
