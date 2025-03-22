import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  username: z.string().optional(),
  password: z.string().min(6).optional(), // required for local auth
  provider: z.enum(["local", "google", "github"]).default("local"),
  provider_id: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
