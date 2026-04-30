import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('ledger_entries')
    .addCheckConstraint(
      'ledger_entries_type_check',
      sql`"type" in ('CREDIT', 'DEBIT')`,
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('ledger_entries')
    .dropConstraint('ledger_entries_type_check')
    .execute()
}
