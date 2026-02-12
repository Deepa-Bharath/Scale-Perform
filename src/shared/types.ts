import { Types } from "mongoose";
import { type Product } from "../domain/entities/Product.js";
export interface Result {
  statusCode: number;
  message: string;
  status: string;
  data?: object | object[] | null;
}

export interface ProductResponse {
  products: Product[];
  hasMore: boolean;
  lastSeenId?: Types.ObjectId;
}

export type RepositoryType = 'mongoDB' |'postgreSQL';
