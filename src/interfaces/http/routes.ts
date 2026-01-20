import { Router } from "express";
import { getProductsController } from "../../shared/container.js";
import { generateProductsController } from "../../shared/container.js";

export const router = Router();

router.get("/products", (req, res) =>
  getProductsController.handle(req, res)
);

router.post("/generate-products", (req, res) =>
  generateProductsController.handle(req, res)
);
