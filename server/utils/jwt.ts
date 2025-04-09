import jwt from "jsonwebtoken";
import { userPayloadSchema } from "../../shared/schemas/userPayload";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d";

export type UserPayload = z.infer<typeof userPayloadSchema>;

export function signToken(user: UserPayload): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): UserPayload {
  return jwt.verify(token, JWT_SECRET) as UserPayload;
}
