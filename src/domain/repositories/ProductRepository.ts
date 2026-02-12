// save product data to both database connected in the application
import { type Product } from "../../domain/entities/Product.js";

export interface ProductRepository {
    getAll(lastSeenId?: string): Promise<Product[] | []>;
    save(products: Product[]): Promise<void>;
}