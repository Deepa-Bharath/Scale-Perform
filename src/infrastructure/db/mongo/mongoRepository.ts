import { type Product } from "../../../domain/entities/Product.js";
import { type ProductRepository } from "../../../domain/repositories/ProductRepository.js";
import { ProductModel } from "./models/product.schema.js";
import { dbQueryDuration } from "../../../shared/dbMetrics.js";

export class MongoProductRepository implements ProductRepository {
  async getAll(page: number): Promise<Product[]> {
  const end = dbQueryDuration.startTimer({
    db: "mongo",
    operation: "find_all_products",
  });    
  try{
    return await ProductModel.find().limit(20).skip(page*20);
  } finally {
    end();
  }
    
  }

  async save(products: Product[]): Promise<void> {
    await ProductModel.insertMany(products);
  }
}
