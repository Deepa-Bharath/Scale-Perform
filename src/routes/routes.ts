import { Router, Request, Response } from "express";
import { GenerateProductsService } from "../services/generate-product.js";
export const router = Router();
const DB_TYPE = process.env.DB_TYPE || "mongodb";

// Sample route
router.post("/generate-products", (req: Request, res: Response) => {
    const result = GenerateProductsService.generateProducts();
    res.json(result);
});

router.post("/get-products", (req: Request, res: Response) => {
    const result = GenerateProductsService.getProducts(DB_TYPE);
    res.json(result);
});