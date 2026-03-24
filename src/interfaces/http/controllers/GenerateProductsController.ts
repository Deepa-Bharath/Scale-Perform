import { GenerateProductsUseCase } from "../../../application/usecases/GenerateProducts.usecase.js";
import { type Result } from "../../../shared/types.js";

export class GenerateProductsController {
  constructor(private useCase: GenerateProductsUseCase) {}

  async handle(): Promise<Result> {
    await this.useCase.execute();
    return {
      statusCode: 200,
      message: "Products generated successfully.",
      status: "success",
    };
  }
}
