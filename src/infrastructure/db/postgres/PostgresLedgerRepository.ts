import { db } from './connection.js';
import type { LedgerRepository } from '../../../domain/repositories/LedgerRepository.js';
import type { Ledger } from '../../../domain/entities/Ledger.js';
import type { UUID } from 'crypto';
export class PostgresLedgerRepository implements LedgerRepository {
    async createLedgerEntry(walletId: UUID, referenceId: UUID, type: 'CREDIT' | 'DEBIT', amount: bigint, balanceAfter: bigint, description?: string): Promise<void> {
        await db.insertInto('ledger_entries').values({
            wallet_id: walletId,            
            reference_id: referenceId,
            type: type,
            amount: amount,
            balance_after: balanceAfter,
            description: description || null,
            created_at: new Date()
        }).execute();
    }
    async getLedgerEntries(walletId: UUID, lastSeq?: bigint, limit: number = 10): Promise<Array<Ledger>> {
        let query = db.selectFrom('ledger_entries').selectAll().where('wallet_id', '=', walletId).orderBy('seq', 'asc').limit(limit);
        if (lastSeq !== undefined) {
            query = query.where('seq', '>', lastSeq);
        }
        const ledgerEntries = await query.execute();
        return ledgerEntries.map(entry => ({
            seq: entry.seq,
            id: entry.id,
            walletId: entry.wallet_id,
            referenceId: entry.reference_id,
            type: entry.type,
            amount: entry.amount,
            balanceAfter: entry.balance_after,
            description: entry.description,
            createdAt: entry.created_at
        }));
    }
}

                      
