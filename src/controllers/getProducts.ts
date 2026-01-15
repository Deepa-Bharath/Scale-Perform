import { Product } from "../shared/types.js";
import { repository } from "../index.js";

export async function getProducts(): Promise<Product[]> {
    const products: Product[] = await repository.getAll();
    return products;
}
 