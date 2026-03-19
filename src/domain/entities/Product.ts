import type { Types } from "mongoose";

export interface Product {
  _id: Types.ObjectId;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NewProduct = Omit<Product, "_id">;