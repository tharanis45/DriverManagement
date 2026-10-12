import {query, run} from './database';
import {
  AdvanceEntry,
  Driver,
  PaymentEntry,
  SalaryHistoryEntry,
} from '@/context/types';

type DriverRow = {
  driverId: string;
  name: string;
  phone: string;
  vehiclePlate: string | null;
  vehicleModel: string | null;
  status: string;
  rating: number;
  salary: number;
  paid: number;
  pending: number;
  advanceTotal: number;
  dob: string | null;
  bloodGroup: string | null;
  address: string | null;
  aadhaar: string | null;
  license: string | null;
  licenseExpiry: string | null;
  joiningDate: string | null;
  emergency: string | null;
};

function rowToDriver(
  row: DriverRow,
  salaryHistory: SalaryHistoryEntry[],
  advances: AdvanceEntry[],
  payments: PaymentEntry[],
  docs: string[],
): Driver {
  return {
    driverId: row.driverId,
    name: row.name,
    phone: row.phone,
    vehiclePlate: row.vehiclePlate,
    vehicleModel: row.vehicleModel,
    status: row.status as Driver['status'],
    rating: row.rating,
    salary: row.salary,
    paid: row.paid,
    pending: row.pending,
    advanceTotal: row.advanceTotal,
    dob: row.dob ?? '—',
    bloodGroup: row.bloodGroup ?? '—',
    address: row.address ?? '—',
    aadhaar: row.aadhaar ?? '—',
    license: row.license ?? '—',
    licenseExpiry: row.licenseExpiry ?? '—',
    joiningDate: row.joiningDate ?? '—',
    emergency: row.emergency ?? '—',
    salaryHistory,
    advances,
    payments,
    docs,
  };
}

export async function fetchAllDrivers(): Promise<Driver[]> {
  const rows = await query<DriverRow>(
    'SELECT * FROM drivers ORDER BY rowid ASC;',
  );
  const drivers: Driver[] = [];
  for (const row of rows) {
    const [salaryHistory, advances, payments, docRows] = await Promise.all([
      query<SalaryHistoryEntry>(
        'SELECT month, status, salary, paid, pending FROM salary_history WHERE driverId = ? ORDER BY id DESC;',
        [row.driverId],
      ),
      query<AdvanceEntry>(
        'SELECT amount, reason, date, status FROM advances WHERE driverId = ? ORDER BY id DESC;',
        [row.driverId],
      ),
      query<PaymentEntry>(
        'SELECT amount, mode, date, ref FROM payments WHERE driverId = ? ORDER BY id DESC;',
        [row.driverId],
      ),
      query<{name: string}>(
        'SELECT name FROM driver_docs WHERE driverId = ? ORDER BY id ASC;',
        [row.driverId],
      ),
    ]);
    drivers.push(
      rowToDriver(
        row,
        salaryHistory,
        advances,
        payments,
        docRows.map(d => d.name),
      ),
    );
  }
  return drivers;
}

export async function insertDriver(driver: Driver): Promise<void> {
  await run(
    `INSERT INTO drivers
      (driverId, name, phone, vehiclePlate, vehicleModel, status, rating, salary, paid, pending, advanceTotal,
       dob, bloodGroup, address, aadhaar, license, licenseExpiry, joiningDate, emergency)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      driver.driverId,
      driver.name,
      driver.phone,
      driver.vehiclePlate,
      driver.vehicleModel,
      driver.status,
      driver.rating,
      driver.salary,
      driver.paid,
      driver.pending,
      driver.advanceTotal,
      driver.dob,
      driver.bloodGroup,
      driver.address,
      driver.aadhaar,
      driver.license,
      driver.licenseExpiry,
      driver.joiningDate,
      driver.emergency,
    ],
  );
  for (const s of driver.salaryHistory) {
    await insertSalaryHistory(driver.driverId, s);
  }
  for (const a of driver.advances) {
    await insertAdvance(driver.driverId, a);
  }
  for (const p of driver.payments) {
    await insertPayment(driver.driverId, p);
  }
  for (const d of driver.docs) {
    await insertDoc(driver.driverId, d);
  }
}

export async function updateDriverFields(
  driverId: string,
  patch: Partial<Driver>,
): Promise<void> {
  const fields = Object.keys(patch) as (keyof Driver)[];
  const simpleFields = fields.filter(
    f => !['salaryHistory', 'advances', 'payments', 'docs'].includes(f),
  );
  if (simpleFields.length === 0) {
    return;
  }
  const setClause = simpleFields.map(f => `${f} = ?`).join(', ');
  const values = simpleFields.map(f => (patch as any)[f]);
  await run(`UPDATE drivers SET ${setClause} WHERE driverId = ?;`, [
    ...values,
    driverId,
  ]);
}

export async function insertSalaryHistory(
  driverId: string,
  entry: SalaryHistoryEntry,
): Promise<void> {
  await run(
    'INSERT INTO salary_history (driverId, month, status, salary, paid, pending) VALUES (?, ?, ?, ?, ?, ?);',
    [
      driverId,
      entry.month,
      entry.status,
      entry.salary,
      entry.paid,
      entry.pending,
    ],
  );
}

export async function updateLatestSalaryHistory(
  driverId: string,
  patch: {paid: number; pending: number; status: string},
): Promise<void> {
  const rows = await query<{id: number}>(
    'SELECT id FROM salary_history WHERE driverId = ? ORDER BY id DESC LIMIT 1;',
    [driverId],
  );
  if (rows.length === 0) {
    return;
  }
  await run(
    'UPDATE salary_history SET paid = ?, pending = ?, status = ? WHERE id = ?;',
    [patch.paid, patch.pending, patch.status, rows[0].id],
  );
}

export async function insertAdvance(
  driverId: string,
  entry: AdvanceEntry,
): Promise<void> {
  await run(
    'INSERT INTO advances (driverId, amount, reason, date, status) VALUES (?, ?, ?, ?, ?);',
    [driverId, entry.amount, entry.reason, entry.date, entry.status],
  );
}

export async function insertPayment(
  driverId: string,
  entry: PaymentEntry,
): Promise<void> {
  await run(
    'INSERT INTO payments (driverId, amount, mode, date, ref) VALUES (?, ?, ?, ?, ?);',
    [driverId, entry.amount, entry.mode, entry.date, entry.ref],
  );
}

export async function insertDoc(driverId: string, name: string): Promise<void> {
  await run('INSERT INTO driver_docs (driverId, name) VALUES (?, ?);', [
    driverId,
    name,
  ]);
}

export async function countDrivers(): Promise<number> {
  const rows = await query<{count: number}>(
    'SELECT COUNT(*) as count FROM drivers;',
  );
  return rows[0]?.count ?? 0;
}
