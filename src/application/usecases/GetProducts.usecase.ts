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
    lastSeenId?: string,
    filters: ProductFilters = {},
    priceSort?: ProductPriceSort
  ): Promise<ProductResponse>{
    if (lastSeenId && !mongoose.Types.ObjectId.isValid(lastSeenId)) {
      throw new AppError("Invalid lastSeenId provided.", 400);
    }

    if (filters.category !== undefined && filters.category.trim() === "") {
      throw new AppError("Category cannot be empty.", 400);
    }

    if (priceSort !== undefined && priceSort !== "asc" && priceSort !== "desc") {
      throw new AppError("Price sort must be either asc or desc.", 400);
    }

    const products:Product[] | null = await this.repository.getAll(lastSeenId, filters, priceSort);
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
    }
    return response;  
  }
}
