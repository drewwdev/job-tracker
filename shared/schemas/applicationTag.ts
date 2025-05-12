import { z } from "zod";

export const createApplicationTagSchema = z.object({
  job_application_id: z.number(),
  tag_id: z.number(),
});

export type CreateApplicationTagInput = z.infer<
  typeof createApplicationTagSchema
>;
