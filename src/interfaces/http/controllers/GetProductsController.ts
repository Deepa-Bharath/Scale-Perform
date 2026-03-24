import { GetProductsUseCase } from "../../../application/usecases/GetProducts.usecase.js";
import { type Result } from "../../../shared/types.js";
import { type ProductResponse } from "../../../shared/types.js";

type GetProductsHandler = {
  execute(lastSeenId?: string): Promise<ProductResponse>;
};
export class GetProductsController {
  constructor(private useCase: GetProductsHandler) {}

  async handle(req: any): Promise<Result> {
    const products: ProductResponse = await this.useCase.execute(
      req.query.lastSeenId
    );
    return {
      statusCode: 200,
      message: "Products retrieved successfully.",
      status: "success",
      data: products,
    };
  }
}
