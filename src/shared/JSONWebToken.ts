import jwt from "jsonwebtoken";
import { AppError } from "./AppError.js";
import type { UUID } from "crypto";

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

async function verifyToken(token: string): Promise<{ userId: UUID }> {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError("JWT_SECRET is not configured", 500);
  }
  
  try {  
  const decoded = jwt.verify(token, secret) as { sub: UUID };
  return { userId: decoded.sub };
  } catch (error) {
    throw new AppError("Invalid token. Try to re-login", 401);
  }
}


export { createToken, verifyToken };
