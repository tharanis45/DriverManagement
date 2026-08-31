import {query, run} from './database';
import {Vehicle} from '@/context/types';

export async function fetchAllVehicles(): Promise<Vehicle[]> {
  return query<Vehicle>('SELECT * FROM vehicles ORDER BY rowid ASC;');
}

export async function insertVehicle(vehicle: Vehicle): Promise<void> {
  await run(
    `INSERT INTO vehicles
      (plate, type, brand, model, fuelType, driver, status, ins, rc, permit)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      vehicle.plate,
      vehicle.type,
      vehicle.brand,
      vehicle.model,
      vehicle.fuelType,
      vehicle.driver,
      vehicle.status,
      vehicle.ins,
      vehicle.rc,
      vehicle.permit,
    ],
  );
}

export async function updateVehicleFields(
  plate: string,
  patch: Partial<Vehicle>,
): Promise<void> {
  const fields = Object.keys(patch) as (keyof Vehicle)[];
  if (fields.length === 0) {
    return;
  }
  // Allow renaming the plate (primary key) by handling it last.
  const withoutPlate = fields.filter(f => f !== 'plate');
  if (withoutPlate.length > 0) {
    const setClause = withoutPlate.map(f => `${f} = ?`).join(', ');
    const values = withoutPlate.map(f => (patch as any)[f]);
    await run(`UPDATE vehicles SET ${setClause} WHERE plate = ?;`, [
      ...values,
      plate,
    ]);
  }
  if (patch.plate && patch.plate !== plate) {
    await run('UPDATE vehicles SET plate = ? WHERE plate = ?;', [
      patch.plate,
      plate,
    ]);
  }
}

export async function countVehicles(): Promise<number> {
  const rows = await query<{count: number}>(
    'SELECT COUNT(*) as count FROM vehicles;',
  );
  return rows[0]?.count ?? 0;
}
