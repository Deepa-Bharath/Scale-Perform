import {GenerateProductsController} from '../controllers/generate_products.js';
import { Response } from "../shared/types.js";

export class GenerateProductsService {
  static generateProducts(): Response {
    try {
      GenerateProductsController.generateProducts();
      
      return {
        statusCode: 200,
        message: "5000 products generated and saved to products_1000.json",
        status: "success"
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("[GenerateProductsService] Error:", errorMessage);
      
      return {
        statusCode: 500,
        message: "Error generating products",
        status: "error"
      };
    }
  }
}