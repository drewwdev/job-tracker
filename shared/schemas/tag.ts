import { z } from "zod";

export const createTagSchema = z.object({
  user_id: z.number().int(),
  name: z.string().min(1),
});

export const addTagToApplicationSchema = z.object({
  job_application_id: z.number().int(),
  tag_id: z.number().int(),
});

export const updateTagSchema = z.object({
  name: z.string().min(1).optional(),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type AddTagToApplicationInput = z.infer<
  typeof addTagToApplicationSchema
>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
