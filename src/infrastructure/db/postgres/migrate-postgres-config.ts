import 'dotenv/config'

import { FileMigrationProvider, Migrator } from 'kysely'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { db } from './connection.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const migrationFolder = path.join(__dirname, 'migrations')
const importPath = {
  join: (...segments: string[]) => pathToFileURL(path.join(...segments)).href,
}

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path: importPath,
    migrationFolder,
  }),
})

const { error, results } = await migrator.migrateToLatest()

results?.forEach((it) => {
  console.log(`${it.status}: ${it.migrationName}`)
})

await db.destroy()

if (error) {
  console.error(error)
  process.exit(1)
}
