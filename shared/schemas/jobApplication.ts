import { z } from "zod";

export const createJobApplicationSchema = z.object({
  job_title: z.string().min(1),
  company_name: z.string().min(1),
  location: z.string().optional(),
  application_status: z
    .enum(["wishlist", "applied", "interviewing", "offer", "rejected"])
    .optional(),
  job_posting_url: z.string().url().optional(),
  applied_date: z.string().optional(), // or z.coerce.date()
  notes: z.string().optional(),
});

export type CreateJobApplicationInput = z.infer<
  typeof createJobApplicationSchema
>;
