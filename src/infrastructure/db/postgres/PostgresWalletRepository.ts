import type { UUID } from 'crypto';
import { type WalletRepository } from '../../../domain/repositories/WalletRepository.js';
import { db } from './connection.js';

export class PostgresWalletRepository implements WalletRepository {
    async createWallet(userId: UUID, currency: string): Promise<{ walletId: UUID }> {
        const walletCreated = await db.insertInto('wallet').values({
            user_id: userId,
            balance: 0n,
            currency: currency,
            created_at: new Date(),
            updated_at: new Date()      
        }).returning('id').executeTakeFirstOrThrow();
        return { walletId: walletCreated.id };
    }
    async getWalletByUserId(userId: UUID): Promise<{ walletId: UUID; balance: bigint; currency: string } | null> {
        const wallet = await db.selectFrom('wallet').selectAll().where('user_id', '=', userId).executeTakeFirst();
        if (!wallet) {
            return null;
        }
        return {
            walletId: wallet.id,
            balance: wallet.balance,
            currency: wallet.currency
        };
    }
    async updateWalletBalance(userId: UUID, newBalance: bigint): Promise<void> {
        await db.updateTable('wallet').set({ balance: newBalance, updated_at: new Date() }).where('user_id', '=', userId).execute();
    }
}