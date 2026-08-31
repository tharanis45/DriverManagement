import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);
// Verbose logging is handy while developing; flip to false for production builds.
SQLite.DEBUG(false);

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }
  dbInstance = await SQLite.openDatabase({
    name: 'fleetpro.db',
    location: 'default',
  });
  return dbInstance;
}

/** Run a write statement (INSERT/UPDATE/DELETE/CREATE TABLE). */
export async function run(
  sql: string,
  params: (string | number | null)[] = [],
): Promise<void> {
  const db = await getDB();
  await db.executeSql(sql, params);
}

/** Run a SELECT and return all rows as plain objects. */
export async function query<T = any>(
  sql: string,
  params: (string | number | null)[] = [],
): Promise<T[]> {
  const db = await getDB();
  const [result] = await db.executeSql(sql, params);
  const rows: T[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    rows.push(result.rows.item(i));
  }
  return rows;
}

/** Run several write statements as a single transaction (all-or-nothing). */
export async function runInTransaction(
  statements: {sql: string; params?: (string | number | null)[]}[],
): Promise<void> {
  const db = await getDB();
  await db.transaction(tx => {
    statements.forEach(({sql, params = []}) => {
      tx.executeSql(sql, params);
    });
  });
}
