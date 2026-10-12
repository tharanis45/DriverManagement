import {query, run} from './database';
import {SCHEMA_STATEMENTS} from './schema';

/** Adds columns introduced after a table's initial CREATE TABLE ran on an existing install. */
async function addColumnIfMissing(
  table: string,
  column: string,
  definition: string,
): Promise<void> {
  const info = await query<{name: string}>(`PRAGMA table_info(${table});`);
  const exists = info.some(col => col.name === column);
  if (!exists) {
    await run(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition};`);
  }
}

export async function initDatabase(): Promise<void> {
  await run('PRAGMA foreign_keys = ON;');
  for (const statement of SCHEMA_STATEMENTS) {
    await run(statement);
  }
  await addColumnIfMissing('vehicles', 'brand', "TEXT NOT NULL DEFAULT ''");
  await addColumnIfMissing('vehicles', 'model', "TEXT NOT NULL DEFAULT ''");
  await addColumnIfMissing('vehicles', 'fuelType', "TEXT NOT NULL DEFAULT ''");
}
