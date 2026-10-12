import {query, run} from './database';
import {SalaryEntry} from '@/context/types';

type SalaryEntryRow = {
  driverId: string;
  fromDate: string;
  toDate: string;
  days: number;
  rate: number;
  advance: number;
  paid: number;
  paidMode: string;
  status: string;
  note: string | null;
  createdAt: string;
};

function rowToEntry(row: SalaryEntryRow): SalaryEntry {
  return {
    driverId: row.driverId,
    from: row.fromDate,
    to: row.toDate,
    days: row.days,
    rate: row.rate,
    advance: row.advance,
    paid: row.paid,
    paidMode: row.paidMode,
    status: row.status as SalaryEntry['status'],
    note: row.note ?? '',
  };
}

export async function fetchAllSalaryEntries(): Promise<SalaryEntry[]> {
  const rows = await query<SalaryEntryRow>(
    'SELECT * FROM salary_entries ORDER BY createdAt DESC, id DESC;',
  );
  return rows.map(rowToEntry);
}

export async function insertSalaryEntry(entry: SalaryEntry): Promise<void> {
  await run(
    `INSERT INTO salary_entries
      (driverId, fromDate, toDate, days, rate, advance, paid, paidMode, status, note, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      entry.driverId,
      entry.from,
      entry.to,
      entry.days,
      entry.rate,
      entry.advance,
      entry.paid,
      entry.paidMode,
      entry.status,
      entry.note,
      new Date().toISOString(),
    ],
  );
}
