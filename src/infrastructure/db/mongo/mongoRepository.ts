import { type Product } from "../../../domain/entities/Product.js";
import { type ProductRepository } from "../../../domain/repositories/ProductRepository.js";
import { ProductModel } from "./models/product.schema.js";
import { dbQueryDuration } from "../../../shared/dbMetrics.js";

export class MongoProductRepository implements ProductRepository {
  async getAll(lastSeenId: string): Promise<Product[] | []> {
  const end = dbQueryDuration.startTimer({
    db: "mongo",
    operation: "find_all_products",
  });    
  try{
    return await ProductModel.find({ _id: { $gt: lastSeenId } }).sort({ _id: 1 }).limit(21);
  } finally {
    end();
  }
    
  }

  async save(products: Product[]): Promise<void> {
    await ProductModel.insertMany(products);
  }
}
