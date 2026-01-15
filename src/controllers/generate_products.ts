import fs from "fs";
import path from "path";
import { Product } from "../shared/types.js";

export class GenerateProductsController {
  private static readonly PRODUCT_COUNT = 5000;
  private static readonly OUTPUT_FILE = "products_1000.json";

  static generateProducts(): void {
    try {
      const products = this.generateProductData();
      this.saveProductsToFile(products);
      console.log(`[GenerateProductsController] Successfully generated ${products.length} products`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("[GenerateProductsController] Error:", errorMessage);
      throw error;
    }
  }

  private static generateProductData(): Product[] {
    const products: Product[] = [];

    for (let i = 1; i <= this.PRODUCT_COUNT; i++) {
      products.push({
        sku: `SKU-${String(i).padStart(4, "0")}`,
        name: `Eco Product ${i}`,
        description: `Eco-friendly product number ${i} made with sustainable materials.`,
        category: this.getCategoryByIndex(i),
        price: 100 + (i % 900),
        isActive: true,
        createdAt: new Date("2024-01-01").toISOString(),
        updatedAt: new Date("2024-01-01").toISOString(),
      });
    }

    return products;
  }

  private static getCategoryByIndex(index: number): string {
    if (index % 3 === 0) return "eco-products";
    if (index % 3 === 1) return "personal-care";
    return "kits";
  }

  private static saveProductsToFile(products: Product[]): void {
    try {
      const filePath = path.join(process.cwd(), this.OUTPUT_FILE);
      fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
      console.log(`[GenerateProductsController] Products saved to ${filePath}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error(`[GenerateProductsController] Failed to write file: ${errorMessage}`);
      throw new Error(`File write operation failed: ${errorMessage}`);
    }
  }
}
