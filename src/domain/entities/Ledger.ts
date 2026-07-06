export interface Ledger {
  seq: bigint;
  id: string;
  walletId: string;
  referenceId: string;
  type: 'CREDIT' | 'DEBIT';
  amount: bigint;
  balanceAfter: bigint;
  description: string | null;
  createdAt: Date;
}