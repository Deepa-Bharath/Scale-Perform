export interface Response {
  statusCode: number;
  message: string;
  status: string;
  data?: object | object[];
}

export interface Product {
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type RepositoryType = 'mongoDB' |'postgreSQL';
