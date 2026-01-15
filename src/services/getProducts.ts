import { Response } from "../shared/types.js";
import { getProducts } from "../controllers/getProducts.js";


export class GetProductsService {
    static async getProducts(): Promise<Response> {
        try {
            const products = await getProducts();
            
            return {    
                statusCode: 200,
                message: "Products retrieved successfully",
                status: "success",
                data: products
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            console.error("[GetProductsService] Error:", errorMessage);
            
            return {
                statusCode: 500,
                message: "Error retrieving products",
                status: "error"
            };
        }
    }
}   