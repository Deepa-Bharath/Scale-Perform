import {
  type Product,
  type NewProduct,
  type ProductFilters,
  type ProductPriceSort,
} from "../../../domain/entities/Product.js";
import { type ProductRepository } from "../../../domain/repositories/ProductRepository.js";
import { ProductModel } from "./models/product.schema.js";
import { dbQueryDuration } from "../../../shared/dbMetrics.js";

export class MongoProductRepository implements ProductRepository {
  async getAll(
    filters: ProductFilters,
    lastSeenId?: string,
    lastPrice?: number,
    priceSort?: ProductPriceSort
  ): Promise<Product[] | []> {
  const end = dbQueryDuration.startTimer({
    db: "mongo",
    operation: "find_all_products",
  });    
  try{
    const filter: Record<string, unknown> = {};

    if (filters.category !== undefined) {
      filter.category = filters.category;
    }

    if (filters.isActive !== undefined) {
      filter.isActive = filters.isActive;
    }

    if (priceSort !== undefined) {
      if (lastSeenId && lastPrice !== undefined) {
        const priceComparison = priceSort === "asc" ? "$gt" : "$lt";
        filter.$or = [
          { price: { [priceComparison]: lastPrice } },
          { price: lastPrice, _id: { $gt: lastSeenId } },
        ];
      }

      const sort = { price: priceSort === "asc" ? 1 : -1, _id: 1 } as const;
      return await ProductModel.find(filter).sort(sort).limit(21).lean();
    }

    if (lastSeenId) {
      filter._id = { $gt: lastSeenId };
    }

    return await ProductModel.find(filter).sort({ _id: 1 }).limit(21).lean();
  } finally {
    end();
  }
    
  }

  async save(products: NewProduct[]): Promise<void> {
    await ProductModel.insertMany(products);
  }
}
