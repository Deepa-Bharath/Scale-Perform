import { TransferFundsUseCase } from "../../../application/usecases/TransferFunds.usecase.js";
import { type Result } from "../../../shared/types.js";

export class TransferFundsController {
  constructor(private useCase: TransferFundsUseCase) {}

  async handle(req: any): Promise<Result> {
    const { senderUserId, receiverUserId, amount, referenceId, description } = req.body;
    const auth = await this.useCase.execute(senderUserId, receiverUserId, amount, referenceId, description);
    return {
      statusCode: 201,
      message: "Funds transferred successfully.",
      status: "success",
      data: auth,
    };
  }
}
