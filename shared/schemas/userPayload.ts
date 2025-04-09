import { z } from "zod";

export const userPayloadSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string().optional(),
  provider: z.enum(["local", "google", "github"]),
  provider_id: z.string().optional(),
});

export type UserPayload = z.infer<typeof userPayloadSchema>;
