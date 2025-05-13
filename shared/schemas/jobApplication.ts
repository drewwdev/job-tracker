import { z } from "zod";

export const createJobApplicationSchema = z.object({
  job_title: z.string().min(1),
  company_name: z.string().min(1),
  location: z.string().optional(),
  application_status: z
    .enum(["wishlist", "applied", "interviewing", "offer", "rejected"])
    .optional(),
  job_posting_url: z.string().url().optional(),
  applied_date: z.coerce.date().optional(),
  notes: z.string().optional(),
});

export const jobApplicationOutputSchema = z.object({
  id: z.number(),
  job_title: z.string(),
  company_name: z.string(),
  location: z.string().nullable().optional(),
  application_status: z
    .enum(["wishlist", "applied", "interviewing", "offer", "rejected"])
    .nullable()
    .optional(),
  job_posting_url: z.string().nullable().optional(),
  applied_date: z.string().nullable().optional(), // comes back as string from DB/JSON
  notes: z.string().nullable().optional(),
});
export const jobApplicationListSchema = z.array(jobApplicationOutputSchema);

export type CreateJobApplicationInput = z.infer<
  typeof createJobApplicationSchema
>;
