import { z } from "zod";

export const createDocumentSchema = z.object({
  job_application_id: z.number().int().optional(),
  file_name: z.string().min(1),
  file_url: z.string().url(),
  document_type: z.enum(["resume", "cover_letter"]),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
