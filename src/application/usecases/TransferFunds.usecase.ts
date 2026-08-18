import type { UUID } from "crypto";
import type { LedgerRepository } from "../../domain/repositories/LedgerRepository.js";
import { type WalletRepository } from "../../domain/repositories/WalletRepository.js";
import { AppError } from "../../shared/AppError.js";


export class TransferFundsUseCase {
  constructor(private walletRepository: WalletRepository, private ledgerRepository: LedgerRepository) {}

  async execute(
    senderUserId: UUID,
    receiverUserId: UUID,
    amount: bigint,
    referenceId: string,
    description: string
  ): Promise<void> {
    // Implementation for transferring funds
    if (amount <= 0n) {
      throw new AppError("Amount must be greater than zero.", 400);
    }
    const senderWallet = await this.walletRepository.getWalletByUserId(senderUserId);
    if (!senderWallet) {
      throw new AppError("Sender wallet not found.", 404);
    }
    if (senderWallet.balance < amount) {
      throw new AppError("Insufficient funds.", 400);
    }
    const receiverWallet = await this.walletRepository.getWalletByUserId(receiverUserId);
    if (!receiverWallet) {
      throw new AppError("Receiver wallet not found.", 404);  
    
    } 
    const newSenderBalance = senderWallet.balance - amount;
    const newReceiverBalance = receiverWallet.balance + amount;
    await this.walletRepository.updateWalletBalance(senderUserId, newSenderBalance);
    await this.walletRepository.updateWalletBalance(receiverUserId, newReceiverBalance);
    await this.ledgerRepository.createLedgerEntry(senderWallet.walletId, referenceId, 'DEBIT', amount, newSenderBalance, description);
    await this.ledgerRepository.createLedgerEntry(receiverWallet.walletId, referenceId, 'CREDIT', amount, newReceiverBalance, description);

  }

}
