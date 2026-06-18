
import { MongoProductRepository } from "../infrastructure/db/mongo/mongoRepository.js";
import { PostgresUserRepository } from "../infrastructure/db/postgres/PostgresUserRepository.js";

import { GetProductsUseCase } from "../application/usecases/GetProducts.usecase.js";
import { GenerateProductsUseCase } from "../application/usecases/GenerateProducts.usecase.js";

import { GetProductsController } from "../interfaces/http/controllers/GetProductsController.js";
import { GenerateProductsController } from "../interfaces/http/controllers/GenerateProductsController.js";

import { UsecaseMetrics } from "../shared/UsecaseMetrics.js";
import { RegisterUserUseCase } from "../application/usecases/RegisterUser.usecase.js";
import { RegisterUserController } from "../interfaces/http/controllers/registerUserController.js";

import { LoginUserUseCase } from "../application/usecases/LoginUser.usecase.js";
import { LoginUserController } from "../interfaces/http/controllers/loginUserController.js";

const productRepository = new MongoProductRepository();

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

const userRepository = new PostgresUserRepository();
const registerUserUseCase = new RegisterUserUseCase(userRepository);
export const registerUserController =
  new RegisterUserController(registerUserUseCase);

const loginUserUseCase = new LoginUserUseCase(userRepository);
export const loginUserController =
  new LoginUserController(loginUserUseCase);
