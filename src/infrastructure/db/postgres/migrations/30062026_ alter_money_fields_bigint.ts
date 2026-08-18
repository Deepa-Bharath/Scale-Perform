import { sql, type Kysely } from 'kysely'

// Money columns (wallet.balance, ledger_entries.amount, ledger_entries.balance_after)
// were created as varchar. This migration moves them to bigint (integer minor units)
// using a production-safe expand -> backfill -> contract sequence.
//
// PRODUCTION NOTE: on a high-traffic table the CONTRACT phase (dropping the old
// varchar column) belongs in a SEPARATE later migration that runs only after the
// app has been deployed reading the new column. It is collapsed here because this
// table is small and deployed in one shot.

const MONEY_COLUMNS: ReadonlyArray<{ table: string; pk: string; col: string }> = [
  { table: 'wallet', pk: 'id', col: 'balance' },
  { table: 'ledger_entries', pk: 'id', col: 'amount' },
  { table: 'ledger_entries', pk: 'id', col: 'balance_after' },
]

const BATCH_SIZE = 1000

/**
 * Copy an integer-valued varchar column into its new bigint sibling, in bounded
 * batches so no single statement holds a long lock or bloats the table.
 */
async function backfillInBatches(
  db: Kysely<any>,
  table: string,
  pk: string,
  col: string,
): Promise<void> {
  while (true) {
    const result = await sql`
      WITH batch AS (
        SELECT ${sql.ref(pk)}
        FROM ${sql.table(table)}
        WHERE ${sql.ref(`${col}_new`)} IS NULL
        ORDER BY ${sql.ref(pk)}
        LIMIT ${BATCH_SIZE}
      )
      UPDATE ${sql.table(table)} AS target
      SET ${sql.ref(`${col}_new`)} = ${sql.ref(`target.${col}`)}::bigint
      FROM batch
      WHERE ${sql.ref(`target.${pk}`)} = ${sql.ref(`batch.${pk}`)}
    `.execute(db)

    if (result.numAffectedRows === 0n) {
      break
    }
  }
}

export async function up(db: Kysely<any>): Promise<void> {
  // Fail fast instead of queueing behind live traffic while holding a lock.
  await sql`SET lock_timeout = '2s'`.execute(db)
  await sql`SET statement_timeout = '60s'`.execute(db)

  // --- VALIDATION GUARD: refuse to run if any value is not a clean integer ---
  for (const { table, col } of MONEY_COLUMNS) {
    const bad = await sql<{ count: string }>`
      SELECT count(*)::text AS count
      FROM ${sql.table(table)}
      WHERE ${sql.ref(col)} !~ '^-?\\d+$'
    `.execute(db)
    if (Number(bad.rows[0]?.count ?? 0) > 0) {
      throw new Error(
        `Aborting: ${table}.${col} has non-integer values; clean them before migrating.`,
      )
    }
  }

  // --- EXPAND: add nullable bigint siblings (additive, no table rewrite) ---
  for (const { table, col } of MONEY_COLUMNS) {
    await sql`
      ALTER TABLE ${sql.table(table)}
      ADD COLUMN IF NOT EXISTS ${sql.ref(`${col}_new`)} bigint
    `.execute(db)
  }

  // --- BACKFILL: fill the new columns in bounded batches ---
  for (const { table, pk, col } of MONEY_COLUMNS) {
    await backfillInBatches(db, table, pk, col)
  }

  // --- RECONCILE: prove every new value equals the old one before we swap ---
  for (const { table, col } of MONEY_COLUMNS) {
    const mismatch = await sql<{ count: string }>`
      SELECT count(*)::text AS count
      FROM ${sql.table(table)}
      WHERE ${sql.ref(`${col}_new`)} IS DISTINCT FROM ${sql.ref(col)}::bigint
    `.execute(db)
    if (Number(mismatch.rows[0]?.count ?? 0) > 0) {
      throw new Error(`Aborting: ${table}.${col} backfill mismatch; not swapping.`)
    }
  }

  // --- CONTRACT: enforce NOT NULL, drop varchar, rename bigint into place ---
  // (In real prod this block is a separate migration run after the app reads *_new.)
  for (const { table, col } of MONEY_COLUMNS) {
    await sql`ALTER TABLE ${sql.table(table)} ALTER COLUMN ${sql.ref(`${col}_new`)} SET NOT NULL`.execute(db)
    await sql`ALTER TABLE ${sql.table(table)} DROP COLUMN ${sql.ref(col)}`.execute(db)
    await sql`ALTER TABLE ${sql.table(table)} RENAME COLUMN ${sql.ref(`${col}_new`)} TO ${sql.ref(col)}`.execute(db)
  }

  // Cursor column for keyset pagination over the ledger.
  await sql`ALTER TABLE ledger_entries ADD COLUMN IF NOT EXISTS seq BIGSERIAL NOT NULL`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`ALTER TABLE ledger_entries DROP COLUMN IF EXISTS seq`.execute(db)
  for (const { table, col } of MONEY_COLUMNS) {
    await sql`ALTER TABLE ${sql.table(table)} ALTER COLUMN ${sql.ref(col)} TYPE varchar USING ${sql.ref(col)}::text`.execute(db)
  }
}
