import { type ProductRepository } from "../../domain/repositories/ProductRepository.js";
import { type Product } from "../../domain/entities/Product.js";

export class GetProductsUseCase {
  constructor(private repository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.repository.getAll();
  }
}
