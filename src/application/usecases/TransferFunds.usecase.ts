import type { LedgerRepository } from "../../domain/repositories/LedgerRepository.js";
import { type WalletRepository } from "../../domain/repositories/WalletRepository.js";
import { AppError } from "../../shared/AppError.js";


export class TransferFundsUseCase {
  constructor(private walletRepository: WalletRepository, private ledgerRepository: LedgerRepository) {}

  async execute(
    senderUserId: string,
    receiverUserId: string,
    amount: bigint,
    referenceId: string,
    description: string
  ): Promise<any> {
    // Implementation for transferring funds
    if (amount <= 0n) {
      throw new AppError("Amount must be greater than zero.", 400);
    }
    
    } 

}
