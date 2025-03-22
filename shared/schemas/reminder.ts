import { z } from "zod";

export const createReminderSchema = z.object({
  job_application_id: z.number().int(),
  reminder_date: z.string(), // or z.coerce.date()
  message: z.string().optional(),
  completed: z.boolean().optional(),
});

export type CreateReminderInput = z.infer<typeof createReminderSchema>;
