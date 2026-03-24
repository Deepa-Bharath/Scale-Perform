import { type NextFunction, type Request, type Response } from "express";
import { AppError } from "../shared/AppError.js";

export function handleError(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  const message = err instanceof Error ? err.message : "Internal Server Error";
  console.error("[Unhandled Error]", err);

  return res.status(500).json({
    status: "error",
    message,
  });
}
