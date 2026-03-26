import type { Types } from "mongoose";

export interface Product {
  _id: Types.ObjectId;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type NewProduct = Omit<Product, "_id">;

export interface ProductFilters {
  category: string;
  isActive?: boolean;
}

export type ProductPriceSort = "asc" | "desc";
