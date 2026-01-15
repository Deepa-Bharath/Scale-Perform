import { Response } from "../shared/types.js";
import { repository } from "../index.js";


export class GetProductsService {
    static getProducts(): Response {
        try {
            const products = repository.getAll();
            
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