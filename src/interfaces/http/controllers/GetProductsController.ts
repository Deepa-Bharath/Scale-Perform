import { GetProductsUseCase } from "../../../application/usecases/GetProducts.usecase.js";
import { type Result } from "../../../shared/types.js";
import { type ProductResponse } from "../../../shared/types.js";
import {
  type ProductFilters,
  type ProductPriceSort,
} from "../../../domain/entities/Product.js";

type GetProductsHandler = {
  execute(
    lastSeenId?: string,
    filters?: ProductFilters,
    priceSort?: ProductPriceSort
  ): Promise<ProductResponse>;
};
export class GetProductsController {
  constructor(private useCase: GetProductsHandler) {}

  async handle(req: any): Promise<Result> {
    const filters: ProductFilters = {};

    if (typeof req.query.category === "string") {
      filters.category = req.query.category.trim();
    }

    if (typeof req.query.isActive === "string") {
      if (req.query.isActive === "true") {
        filters.isActive = true;
      } else if (req.query.isActive === "false") {
        filters.isActive = false;
      }
    }

    const priceSortQuery = req.query.price;
    const priceSort: ProductPriceSort | undefined =
      priceSortQuery === "asc" || priceSortQuery === "desc"
        ? priceSortQuery
        : typeof priceSortQuery === "string"
          ? (priceSortQuery as ProductPriceSort)
          : undefined;

    const products: ProductResponse = await this.useCase.execute(
      req.query.lastSeenId,
      filters,
      priceSort
    );
    return {
      statusCode: 200,
      message: "Products retrieved successfully.",
      status: "success",
      data: products,
    };
  }
}
