import { Router, type Response, type Request, type NextFunction } from "express";
import { getProductsController, loginUserController, registerUserController } from "../../shared/container.js";
import { generateProductsController } from "../../shared/container.js";
import { type Result } from "../../shared/types.js";
export const router = Router();

router.get("/products", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response: Result = await getProductsController.handle(req);
    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
});

router.post("/generate-products", async (req, res, next) => {
  try {
    const response: Result = await generateProductsController.handle();
    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
});

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


