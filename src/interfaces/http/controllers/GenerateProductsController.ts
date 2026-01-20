import { GenerateProductsUseCase } from "../../../application/usecases/GenerateProducts.usecase.js";

export class GenerateProductsController {
  constructor(private useCase: GenerateProductsUseCase) {}

  async handle(req: any, res: any): Promise<void> {
    try {
      await this.useCase.execute();
      res.status(200).json({ message: "Products generated successfully." });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("[GenerateProductsController] Error:", errorMessage);
      res.status(500).json({ error: errorMessage });
    }
  }
}