export interface WalletRepository {
   createWallet(userId: string, currency: string): Promise<{ walletId: string }>;
   getWalletByUserId(userId: string): Promise<{ walletId: string; balance: bigint; currency: string } | null>;
   updateWalletBalance(userId: string, newBalance: bigint): Promise<void>; 
}
