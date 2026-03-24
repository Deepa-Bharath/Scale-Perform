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
    lastSeenId?: string,
    filters: ProductFilters = {},
    priceSort?: ProductPriceSort
  ): Promise<Product[] | []> {
  const end = dbQueryDuration.startTimer({
    db: "mongo",
    operation: "find_all_products",
  });    
  try{
    const filter: Record<string, unknown> = {};

    if (lastSeenId) {
      filter._id = { $gt: lastSeenId };
    }

    if (filters.category !== undefined) {
      filter.category = filters.category;
    }

    if (filters.isActive !== undefined) {
      filter.isActive = filters.isActive;
    }

   const sort: Record<string, 1 | -1> = priceSort
  ? { price: priceSort === "asc" ? 1 : -1, _id: 1 }
  : { _id: 1 };


    return await ProductModel.find(filter).sort(sort).limit(21).lean();
  } finally {
    end();
  }
    
  }

  async save(products: NewProduct[]): Promise<void> {
    await ProductModel.insertMany(products);
  }
}
