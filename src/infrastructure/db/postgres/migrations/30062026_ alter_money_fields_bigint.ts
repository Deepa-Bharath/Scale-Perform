import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await sql`ALTER TABLE wallet ALTER COLUMN balance TYPE bigint USING balance::bigint`.execute(db)
  await sql`ALTER TABLE ledger_entries ALTER COLUMN amount TYPE bigint USING amount::bigint`.execute(db)
  await sql`ALTER TABLE ledger_entries ALTER COLUMN balance_after TYPE bigint USING balance_after::bigint`.execute(db)
  await sql`ALTER TABLE ledger_entries ADD COLUMN seq BIGSERIAL NOT NULL`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`ALTER TABLE ledger_entries DROP COLUMN seq`.execute(db)
  await sql`ALTER TABLE wallet ALTER COLUMN balance TYPE varchar USING balance::text`.execute(db)
  await sql`ALTER TABLE ledger_entries ALTER COLUMN amount TYPE varchar USING amount::text`.execute(db)
  await sql`ALTER TABLE ledger_entries ALTER COLUMN balance_after TYPE varchar USING balance_after::text`.execute(db)
}