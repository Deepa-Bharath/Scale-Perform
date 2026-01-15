import { Router, Request, Response } from "express";
import { GenerateProductsService } from "../services/generateProducts.js";
import { GetProductsService } from "../services/getProducts.js";
export const router = Router();
const DB_TYPE = process.env.DB_TYPE || "mongodb";

// Sample route
router.post("/generate-products", (req: Request, res: Response) => {
    const result = GenerateProductsService.generateProducts();
    res.json(result);
});

router.post("/get-products", (req: Request, res: Response) => {
    const result = GetProductsService.getProducts();
    res.json(result);
});