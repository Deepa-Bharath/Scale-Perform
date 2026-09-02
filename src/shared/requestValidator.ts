import { type Request } from "express";
import { AppError } from "./AppError.js";
import { type UUID } from "crypto";

export function assertAuthenticated(req: Request): asserts req is Request & { user: { id: UUID } } {
  if (!req.user || !req.user.id) {
    throw new AppError("User is not authenticated", 401);
  } 
}
