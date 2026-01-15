import { Product } from "../../shared/types.js";
import { ProductDataMethods } from "../ProductRepository.js";
import { ProductModel } from "./models/product_schema.js";


export class MongoDBRepository implements ProductDataMethods {
    async getAll(): Promise<Product[]> {
        return await ProductModel.find();
    }
    async save(products: Product[]): Promise<void> {
        await ProductModel.insertMany(products);
    }   
}