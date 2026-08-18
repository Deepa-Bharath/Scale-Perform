
import { PostgresUserRepository } from "../infrastructure/db/postgres/PostgresUserRepository.js";
import { PostgresWalletRepository } from "../infrastructure/db/postgres/PostgresWalletRepository.js";
import { PostgresLedgerRepository } from "../infrastructure/db/postgres/PostgresLedgerRepository.js";

import { UsecaseMetrics } from "../shared/UsecaseMetrics.js";
import { RegisterUserUseCase } from "../application/usecases/RegisterUser.usecase.js";
import { RegisterUserController } from "../interfaces/http/controllers/registerUserController.js";

import { LoginUserUseCase } from "../application/usecases/LoginUser.usecase.js";
import { LoginUserController } from "../interfaces/http/controllers/loginUserController.js";

import { TransferFundsController } from "../interfaces/http/controllers/transferFundsController.js";
import { TransferFundsUseCase } from "../application/usecases/TransferFunds.usecase.js";

export const userRepository = new PostgresUserRepository();
const registerUserUseCase = new RegisterUserUseCase(userRepository);
export const registerUserController =
  new RegisterUserController(registerUserUseCase);

const loginUserUseCase = new LoginUserUseCase(userRepository);
export const loginUserController =
  new LoginUserController(loginUserUseCase);

const walletRepository = new PostgresWalletRepository();
const ledgerRepository = new PostgresLedgerRepository();
const transferFundsUseCase = new TransferFundsUseCase(walletRepository, ledgerRepository);
export const transferFundsController =
  new TransferFundsController(transferFundsUseCase);

