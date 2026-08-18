import { TransferFundsUseCase } from "../../../application/usecases/TransferFunds.usecase.js";
import { AppError } from "../../../shared/AppError.js";
import { type Result } from "../../../shared/types.js";
import { type Request } from "express";

export class TransferFundsController {
  constructor(private useCase: TransferFundsUseCase) {}

  async handle(req: Request): Promise<Result> {
    const { receiverUserId, amount, referenceId, description } = req.body;
    const senderUserId = req.user!.id;
    if (!receiverUserId || !amount || !referenceId) {
      throw new AppError("Missing required fields", 401);
    }
    if (typeof amount !== "number" || amount <= 0) {
      throw new AppError("Amount must be a positive number", 400);
    }
    await this.useCase.execute(senderUserId, receiverUserId, BigInt(amount), referenceId, description);
    return {
      statusCode: 201,
      message: "Funds transferred successfully.",
      status: "success"
    };
  }
}
