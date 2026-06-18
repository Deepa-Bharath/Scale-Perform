import jwt from "jsonwebtoken";
import { AppError } from "./AppError.js";

async function createToken(userId: string): Promise<string> {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError("JWT_SECRET is not configured", 500);
  }

  return jwt.sign(
    { sub: userId },
    secret,
    { expiresIn:  "1h" }
  );
}

export { createToken };
