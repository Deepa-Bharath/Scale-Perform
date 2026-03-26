import { type ProductRepository } from "../../domain/repositories/ProductRepository.js";
import { type ProductResponse } from "../../shared/types.js";
import {
  type Product,
  type ProductFilters,
  type ProductPriceSort,
} from "../../domain/entities/Product.js";
import mongoose from "mongoose";
import { AppError } from "../../shared/AppError.js";
export class GetProductsUseCase {
  constructor(private repository: ProductRepository) {}

  async execute(
    filters: ProductFilters,
    lastSeenId?: string,
    lastPrice?: number,
    priceSort?: ProductPriceSort
  ): Promise<ProductResponse>{
    const hasLastSeenId = (lastSeenId !== undefined);
    const hasLastPrice = (lastPrice !== undefined);
    const hasPartialPriceCursor = (hasLastSeenId !== hasLastPrice);

    if (lastSeenId && !mongoose.Types.ObjectId.isValid(lastSeenId)) {
      throw new AppError("Invalid lastSeenId provided.", 400);
    }

    if (lastPrice !== undefined && !Number.isFinite(lastPrice)) {
      throw new AppError("Invalid lastPrice provided.", 400);
    }

    if (priceSort !== undefined && hasPartialPriceCursor) {
      throw new AppError(
        "Both lastSeenId and lastPrice are required for price pagination.",
        400
      );
    }

    if (priceSort === undefined && lastPrice !== undefined) {
      throw new AppError("lastPrice requires a price sort.", 400);
    }

    if (filters.category.trim() === "") {
      throw new AppError("Category is required.", 400);
    }

    if (priceSort !== undefined && priceSort !== "asc" && priceSort !== "desc") {
      throw new AppError("Price sort must be either asc or desc.", 400);
    }

    const products:Product[] | null = await this.repository.getAll(
      filters,
      lastSeenId,
      lastPrice,
      priceSort
    );
    if (!products || products.length === 0) {
        return {
          products: [],
          hasMore: false,
      };
    }
    const limit = 20;
    const hasMore = products.length > limit;
    const result = hasMore ? products.slice(0, limit) : products;

    const response: ProductResponse = {
      products: result,
      hasMore,
    };

    if (hasMore) {
      response.lastSeenId = result[result.length - 1]!._id;
      if (priceSort !== undefined) {
        response.lastPrice = result[result.length - 1]!.price;
      }
    }
    return response;  
  }
}
