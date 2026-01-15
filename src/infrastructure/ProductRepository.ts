// save product data to both database connected in the application
import { Product } from "../shared/types.js";

export interface ProductDataMethods {
    getAll(): Promise<Product[]>;
    save(products: Product[]): Promise<void>;
}