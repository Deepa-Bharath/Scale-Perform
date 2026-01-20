import { GetProductsUseCase } from "../../../application/usecases/GetProducts.usecase.js";

export class GetProductsController {
  constructor(private useCase: GetProductsUseCase) {}

  async handle(req: any, res: any): Promise<void> {
    const products = await this.useCase.execute();
    console.log(`[GetProductsController] Retrieved ${products.length} products.`);
    res.json(products);
  }
}
