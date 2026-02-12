import { Router, type Response, type Request } from "express";
import { getProductsController } from "../../shared/container.js";
import { generateProductsController } from "../../shared/container.js";
import { type Result } from "../../shared/types.js";
export const router = Router();

router.get("/products", async (req: Request, res: Response) => {
  const response:Result = await getProductsController.handle(req, res);
  res.json(response); }
);

router.post("/generate-products", async (req, res) => {
  const response:Result = await generateProductsController.handle(req, res);
  res.json(response); }
);
