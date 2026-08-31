import {countDrivers, insertDriver} from './driverRepository';
import {countVehicles, insertVehicle} from './vehicleRepository';
import {insertSalaryEntry} from './salaryEntryRepository';
import {insertActivity} from './activityRepository';
import {getMeta, setMeta} from './metaRepository';
import {
  initialActivities,
  initialDrivers,
  initialSalaryEntries,
  initialVehicles,
} from '@/context/seedData';

const SEEDED_KEY = 'seeded_v1';

export async function seedIfEmpty(): Promise<void> {
  const alreadySeeded = await getMeta(SEEDED_KEY);
  const [driverCount, vehicleCount] = await Promise.all([
    countDrivers(),
    countVehicles(),
  ]);
  if (alreadySeeded === 'true' || driverCount > 0 || vehicleCount > 0) {
    return;
  }

  for (const driver of initialDrivers) {
    await insertDriver(driver);
  }
  for (const vehicle of initialVehicles) {
    await insertVehicle(vehicle);
  }
  for (const entry of initialSalaryEntries) {
    await insertSalaryEntry(entry);
  }
  // Space seed activities out in the past so relative-time labels look natural on first launch.
  const now = Date.now();
  const offsetsMinutes = [2, 60, 180, 1500, 1520];
  for (let i = 0; i < initialActivities.length; i++) {
    const activity = initialActivities[i];
    const createdAt = new Date(
      now - (offsetsMinutes[i] ?? 0) * 60000,
    ).toISOString();
    await insertActivity(
      {
        icon: activity.icon,
        bg: activity.bg,
        fg: activity.fg,
        title: activity.title,
        sub: activity.sub,
      },
      createdAt,
    );
  }

  await setMeta(SEEDED_KEY, 'true');
}
