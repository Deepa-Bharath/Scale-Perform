import { GetProductsUseCase } from "../../../application/usecases/GetProducts.usecase.js";
import { type Result } from "../../../shared/types.js";
import { type ProductResponse } from "../../../shared/types.js";
import {
  type ProductFilters,
  type ProductPriceSort,
} from "../../../domain/entities/Product.js";

type GetProductsHandler = {
  execute(
    filters: ProductFilters,
    lastSeenId?: string,
    lastPrice?: number,
    priceSort?: ProductPriceSort
  ): Promise<ProductResponse>;
};
export class GetProductsController {
  constructor(private useCase: GetProductsHandler) {}

  async handle(req: any): Promise<Result> {
    const category =
      typeof req.query.category === "string" ? req.query.category.trim() : "";
    const filters: ProductFilters = { category };

    if (typeof req.query.isActive === "string") {
      if (req.query.isActive === "true") {
        filters.isActive = true;
      } else if (req.query.isActive === "false") {
        filters.isActive = false;
      }
    }

    const lastPrice =
      typeof req.query.lastPrice === "string" && req.query.lastPrice.trim() !== ""
        ? Number(req.query.lastPrice)
        : undefined;

    const priceSortQuery = req.query.price;
    const priceSort: ProductPriceSort | undefined =
      priceSortQuery === "asc" || priceSortQuery === "desc"
        ? priceSortQuery
        : undefined;

    const products: ProductResponse = await this.useCase.execute(
      filters,
      req.query.lastSeenId,
      lastPrice,
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
