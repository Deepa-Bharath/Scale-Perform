import { type Product,type NewProduct } from "../../../domain/entities/Product.js";
import { type ProductRepository } from "../../../domain/repositories/ProductRepository.js";
import { ProductModel } from "./models/product.schema.js";
import { dbQueryDuration } from "../../../shared/dbMetrics.js";

export class MongoProductRepository implements ProductRepository {
  async getAll(lastSeenId?: string): Promise<Product[] | []> {
  const end = dbQueryDuration.startTimer({
    db: "mongo",
    operation: "find_all_products",
  });    
  try{
    const filter = lastSeenId ? { _id: { $gt: lastSeenId } } : {};
    return await ProductModel.find(filter).sort({ _id: 1 }).limit(21).lean();
  } finally {
    end();
  }
    
  }

  async save(products: NewProduct[]): Promise<void> {
    await ProductModel.insertMany(products);
  }
}
