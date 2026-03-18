import { GetProductsUseCase } from "../../../application/usecases/GetProducts.usecase.js";
import { type Result } from "../../../shared/types.js";
import { type ProductResponse } from "../../../shared/types.js";
export class GetProductsController {
  constructor(private useCase: GetProductsUseCase) {}

  async handle(req: any, res: any): Promise<Result> {
    try {
      const products: ProductResponse = await this.useCase.execute(req.query.lastSeenId);
      return { statusCode: 200, message: "Products retrieved successfully.", status: 'success', data: products };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("[GetProductsController] Error:", errorMessage);
      return { statusCode: 500, message: errorMessage, status: 'error' };
    }
    
  }
}
