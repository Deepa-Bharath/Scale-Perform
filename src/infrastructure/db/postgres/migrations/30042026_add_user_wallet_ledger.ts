import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'uuid', (col) => col.defaultTo(sql`gen_random_uuid()`).primaryKey())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('email', 'varchar', (col) => col.notNull().unique())
    .addColumn('password_hash', 'varchar(60)', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute()

  await db.schema
    .createTable('wallet')
    .addColumn('id', 'uuid', (col) => col.defaultTo(sql`gen_random_uuid()`).primaryKey())
    .addColumn('user_id', 'uuid', (col) =>
      col.references('users.id').onDelete('cascade').notNull(),
    )
    .addColumn('balance', 'varchar', (col) => col.notNull())
    .addColumn('currency', 'varchar(10)', (col) => col.notNull().defaultTo('INR'))  
    
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute()

  await db.schema
    .createIndex('wallet_user_id_index')
    .on('wallet')
    .column('user_id')
    .execute()

    await db.schema
    .createTable('ledger_entries')
    .addColumn('id', 'uuid', (col) => col.defaultTo(sql`gen_random_uuid()`).primaryKey())
    .addColumn('wallet_id', 'uuid', (col) =>
      col.references('wallet.id').onDelete('cascade').notNull(),
    )
    .addColumn('reference_id', 'varchar(50)', (col) => col.notNull())
    .addColumn('type', 'varchar(10)', (col) => col.notNull())
    .addColumn('amount', 'varchar', (col) => col.notNull())
    .addColumn('balance_after','varchar',(col) => col.notNull())
    .addColumn('description', 'varchar(255)', (col) => col.defaultTo(null))
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute()  
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('ledger_entries').execute()
  await db.schema.dropTable('wallet').execute()
  await db.schema.dropTable('users').execute() 
}
