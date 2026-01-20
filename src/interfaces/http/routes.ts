import { Router } from "express";
import { getProductsController } from "../../shared/container.js";
import { generateProductsController } from "../../shared/container.js";
import { type Response } from "../../shared/types.js";
export const router = Router();

router.get("/products", async (req, res) => {
  const response:Response = await getProductsController.handle(req, res);
  res.json(response); }
);

router.post("/generate-products", async (req, res) => {
  const response:Response = await generateProductsController.handle(req, res);
  res.json(response); }
);
