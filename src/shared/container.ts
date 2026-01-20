import { type ProductRepository } from "../domain/repositories/ProductRepository.js";

import { MongoProductRepository } from "../infrastructure/db/mongo/mongoRepository.js";
//import { PostgresProductRepository } from "../infrastructure/db/postgres/postgresRepository";

import { GetProductsUseCase } from "../application/usecases/GetProducts.usecase.js";
import { GenerateProductsUseCase } from "../application/usecases/GenerateProducts.usecase.js";

import { GetProductsController } from "../interfaces/http/controllers/GetProductsController.js";
import { GenerateProductsController } from "../interfaces/http/controllers/GenerateProductsController.js";


function createProductRepository(): ProductRepository {
  switch (process.env.DB_TYPE) {
    case "mongo":
      return new MongoProductRepository();

    case "postgres":
      //return new PostgresProductRepository();

    default:
      throw new Error("Unsupported DB type. Set DB=mongo|postgres");
  }
}

const productRepository = createProductRepository();

const getProductsUseCase = new GetProductsUseCase(productRepository);
export const getProductsController =
  new GetProductsController(getProductsUseCase);


const generateProductsUseCase = new GenerateProductsUseCase(productRepository);
export const generateProductsController =
  new GenerateProductsController(generateProductsUseCase);