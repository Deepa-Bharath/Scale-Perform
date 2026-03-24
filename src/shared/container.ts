import { type ProductRepository } from "../domain/repositories/ProductRepository.js";

import { MongoProductRepository } from "../infrastructure/db/mongo/mongoRepository.js";
//import { PostgresProductRepository } from "../infrastructure/db/postgres/postgresRepository";

import { GetProductsUseCase } from "../application/usecases/GetProducts.usecase.js";
import { GenerateProductsUseCase } from "../application/usecases/GenerateProducts.usecase.js";

import { GetProductsController } from "../interfaces/http/controllers/GetProductsController.js";
import { GenerateProductsController } from "../interfaces/http/controllers/GenerateProductsController.js";

import { UsecaseMetrics } from "../shared/UsecaseMetrics.js";
import { AppError } from "./AppError.js";

function createProductRepository(): ProductRepository {
  const dbType:string | undefined = process.env.DB_TYPE; 
  switch (dbType) {
    case "mongo":
      return new MongoProductRepository();

    case "postgres":
      //return new PostgresProductRepository();

    default:
      throw new AppError(
        `Unsupported DB type "${dbType}". Set DB_TYPE=mongo|postgres`,
        500
      );
  }
}

const productRepository = createProductRepository();

const rawGetProductsUseCase =
  new GetProductsUseCase(productRepository);

const getProductsUseCase =
  new UsecaseMetrics(
    rawGetProductsUseCase,
    "GetProductsUseCase"
  );
export const getProductsController =
  new GetProductsController(getProductsUseCase);


const generateProductsUseCase = new GenerateProductsUseCase(productRepository);
export const generateProductsController =
  new GenerateProductsController(generateProductsUseCase);
