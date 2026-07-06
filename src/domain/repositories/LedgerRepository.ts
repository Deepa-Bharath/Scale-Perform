import { type Ledger } from '../entities/Ledger.js';

export interface LedgerRepository {
    createLedgerEntry(walletId: string, referenceId: string, type: 'CREDIT' | 'DEBIT', amount: bigint, balanceAfter: bigint, description?: string): Promise<void>;
    getLedgerEntries(walletId: string, lastSeq?: bigint, limit?: number): Promise<Array<Ledger>>;
}