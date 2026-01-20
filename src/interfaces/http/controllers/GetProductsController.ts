import { GetProductsUseCase } from "../../../application/usecases/GetProducts.usecase.js";
import { type Response } from "../../../shared/types.js";

export class GetProductsController {
  constructor(private useCase: GetProductsUseCase) {}

  async handle(req: any, res: any): Promise<Response> {
    try {
    const products = await this.useCase.execute();
    console.log(`[GetProductsController] Retrieved ${products.length} products.`);
      return { statusCode: 200, message: "Products retrieved successfully.", status: 'success', data: products };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("[GetProductsController] Error:", errorMessage);
      return { statusCode: 500, message: errorMessage, status: 'error' };
    }
    
  }
}
