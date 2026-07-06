import type { UUID } from 'crypto'
import {
  type ColumnType,
  type Generated,
} from 'kysely'

export interface Database {
  users: UserTable
  wallet: WalletTable
  ledger_entries: LedgerEntryTable
}

export interface UserTable {
    id: Generated<UUID>
    name: string
    email: string
    password_hash: string
    created_at: ColumnType<Date, Date, never>
    updated_at: ColumnType<Date, Date, Date>
}

export interface WalletTable {
    id: Generated<UUID>
    user_id: UUID
    balance: bigint
    currency: string
    created_at: ColumnType<Date, Date, never>
    updated_at: ColumnType<Date, Date, Date>
}

export interface LedgerEntryTable {
    seq: Generated<bigint>
    id: Generated<UUID>
    wallet_id: UUID
    reference_id: string
    type: 'CREDIT' | 'DEBIT'
    amount: bigint
    balance_after: bigint
    description: string | null
    created_at: ColumnType<Date, Date, never>
}