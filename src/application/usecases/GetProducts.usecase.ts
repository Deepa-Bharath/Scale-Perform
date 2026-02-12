import { type ProductRepository } from "../../domain/repositories/ProductRepository.js";
import { type ProductResponse } from "../../shared/types.js";
import { type Product } from "../../domain/entities/Product.js";
export class GetProductsUseCase {
  constructor(private repository: ProductRepository) {}

  async execute(lastSeenId: string): Promise<ProductResponse>{
    const products:Product[] | null = await this.repository.getAll(lastSeenId);
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
