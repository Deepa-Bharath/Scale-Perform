import { GenerateProductsUseCase } from "../../../application/usecases/GenerateProducts.usecase.js";
import { type Result } from "../../../shared/types.js";

export class GenerateProductsController {
  constructor(private useCase: GenerateProductsUseCase) {}

  async handle(req: any, res: any): Promise<Result> {
    try {
      await this.useCase.execute();
      return {
        statusCode: 200, message: "Products generated successfully." , status: 'success'
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("[GenerateProductsController] Error:", errorMessage);
      return {
        statusCode: 500, message: errorMessage, status: 'error'
      }
    }
  }
}