import Database from 'better-sqlite3'
import path from 'node:path'

export const db = new Database(path.join(__dirname, '..', 'data', 'agentclinic.db'))

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

export function runMigrations(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS agents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      species TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)
}