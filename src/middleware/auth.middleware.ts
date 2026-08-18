import { type NextFunction, type Request, type Response } from "express";
import { AppError } from "../shared/AppError.js";
import { verifyToken } from "../shared/JSONWebToken.js";
import type { UUID } from "crypto";
import { userRepository } from "../shared/container.js";
declare global {
  namespace Express {
    interface Request {
      user?: { id: UUID };
    }
  }
}

export const requireAuth = (options?: { verifyUser?: boolean }) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new AppError("Authorization header is missing", 400);
      }
      const scheme = authHeader.split(" ")[0];
      if (scheme !== "Bearer") {
        throw new AppError(
          "Authorization header must be in the format 'Bearer <token>'",
          400,
        );
      }
      const token = authHeader.split(" ")[1];
      if (!token) {
        throw new AppError("Token is missing", 400);
      }
      const decodedToken = await verifyToken(token);
      req.user = { id: decodedToken.userId };
      if (options?.verifyUser) {
        const user = await userRepository.findById(decodedToken.userId);
        if (!user) {
          throw new AppError("User not found", 401);
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
