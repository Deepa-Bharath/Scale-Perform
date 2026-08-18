import { Router, type Response, type Request, type NextFunction } from "express";
import { loginUserController, registerUserController, transferFundsController } from "../../shared/container.js";
import { type Result } from "../../shared/types.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

export const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const response: Result = await registerUserController.handle(req);
    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const response: Result = await loginUserController.handle(req);
    res.status(response.statusCode).json(response);
    } catch (error) {
    next(error);
  }
});

router.post("/transfer-funds", requireAuth({ verifyUser: true }), async (req, res, next) => {
  try {
    const response: Result = await transferFundsController.handle(req); 
    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);  
  }
});
