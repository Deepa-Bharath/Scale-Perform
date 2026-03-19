import { type ProductRepository } from "../domain/repositories/ProductRepository.js";

import { MongoProductRepository } from "../infrastructure/db/mongo/mongoRepository.js";
//import { PostgresProductRepository } from "../infrastructure/db/postgres/postgresRepository";

import { GetProductsUseCase } from "../application/usecases/GetProducts.usecase.js";
import { GenerateProductsUseCase } from "../application/usecases/GenerateProducts.usecase.js";

import { GetProductsController } from "../interfaces/http/controllers/GetProductsController.js";
import { GenerateProductsController } from "../interfaces/http/controllers/GenerateProductsController.js";

import { UsecaseMetrics } from "../shared/UsecaseMetrics.js";

function createProductRepository(): ProductRepository {
  const dbType = (process.env.DB_TYPE ?? "mongo").trim().toLowerCase();

  switch (dbType) {
    case "mongo":
      return new MongoProductRepository();

    case "postgres":
      //return new PostgresProductRepository();

    default:
      throw new Error(`Unsupported DB type "${dbType}". Set DB_TYPE=mongo|postgres`);
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
