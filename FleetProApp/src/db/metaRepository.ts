import {query, run} from './database';

export async function getMeta(key: string): Promise<string | null> {
  const rows = await query<{value: string}>(
    'SELECT value FROM meta WHERE key = ?;',
    [key],
  );
  return rows[0]?.value ?? null;
}

export async function setMeta(key: string, value: string): Promise<void> {
  await run('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?);', [
    key,
    value,
  ]);
}
