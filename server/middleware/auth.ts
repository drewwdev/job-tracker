import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userPayloadSchema } from "../../shared/schemas/userPayloadSchema";

export interface AuthenticatedRequest extends Request {
  user: z.infer<typeof userPayloadSchema>;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err);
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parsedUser = userPayloadSchema.safeParse(decoded);
    if (!parsedUser.success) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = parsedUser.data;
    next();
  });
}
