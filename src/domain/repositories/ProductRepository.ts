// save product data to both database connected in the application
import {
  type NewProduct,
  type Product,
  type ProductFilters,
  type ProductPriceSort,
} from "../../domain/entities/Product.js";

export interface ProductRepository {
    getAll(
      lastSeenId?: string,
      filters?: ProductFilters,
      priceSort?: ProductPriceSort
    ): Promise<Product[] | []>;
    save(products: NewProduct[]): Promise<void>;
}
