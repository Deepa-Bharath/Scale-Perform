import { type Product } from "../../../domain/entities/Product.js";
import { type ProductRepository } from "../../../domain/repositories/ProductRepository.js";
import { ProductModel } from "./models/product.schema.js";

export class MongoProductRepository implements ProductRepository {
  async getAll(): Promise<Product[]> {
    console.log(ProductModel.find());
    return ProductModel.find();
  }

  async save(products: Product[]): Promise<void> {
    await ProductModel.insertMany(products);
  }
}
