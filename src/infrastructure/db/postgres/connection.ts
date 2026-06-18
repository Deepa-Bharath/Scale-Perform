 import { Kysely, PostgresDialect, sql } from 'kysely'
 import { Pool } from 'pg'
 import { type Database } from './types.js';
const connectPostgresDB = async (): Promise<Kysely<Database>> => {
    try {      
        const db = new Kysely<Database>({
        dialect: new PostgresDialect({
          pool: new Pool({
            connectionString: process.env.POSTGRES_URI,
            max: 10,
            ssl: process.env.NODE_ENV === 'production' ? true : false,
          }),
        })
      });
      await sql`select 1`.execute(db);
      return db;
    } catch (error) {
      console.error('Error connecting to PostgreSQL:', error);
      throw error;
    }
};      

const db = await connectPostgresDB();
export { db };
