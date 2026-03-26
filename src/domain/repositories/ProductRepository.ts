// save product data to both database connected in the application
import {
  type NewProduct,
  type Product,
  type ProductFilters,
  type ProductPriceSort,
} from "../../domain/entities/Product.js";

export interface ProductRepository {
    getAll(
      filters: ProductFilters,
      lastSeenId?: string,
      lastPrice?: number,
      priceSort?: ProductPriceSort
    ): Promise<Product[] | []>;
    save(products: NewProduct[]): Promise<void>;
}
