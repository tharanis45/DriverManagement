import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Activity, Driver, SalaryEntry, Totals, Vehicle} from './types';
import {todayISO, addDaysISO} from '@/utils/format';

import {initDatabase} from '@/db/initDatabase';
// Demo/sample data seeding is disabled for client-facing builds — see the
// bootstrap effect below. Re-import seedIfEmpty from '@/db/seed' to restore
// it for internal/dev testing.
import {
  countDrivers,
  fetchAllDrivers,
  insertAdvance,
  insertDriver,
  insertPayment,
  updateDriverFields,
  updateLatestSalaryHistory,
} from '@/db/driverRepository';
import {
  fetchAllVehicles,
  insertVehicle,
  updateVehicleFields,
} from '@/db/vehicleRepository';
import {
  fetchAllSalaryEntries,
  insertSalaryEntry as insertSalaryEntryRow,
} from '@/db/salaryEntryRepository';
import {fetchRecentActivities, insertActivity} from '@/db/activityRepository';
import {run} from '@/db/database';
import {getMeta, setMeta} from '@/db/metaRepository';

const AUTH_META_KEY = 'isAuthenticated';

type NewEntryInput = {
  driverId: string;
  dailyRate: number;
  days: number;
  mode: string;
  notes: string;
};

type AppContextValue = {
  isReady: boolean;

  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;

  drivers: Driver[];
  vehicles: Vehicle[];
  salaryEntries: SalaryEntry[];
  activities: Activity[];

  totals: Totals;

  getDriver: (id: string) => Driver | undefined;
  getVehicle: (plate: string) => Vehicle | undefined;

  paySalaryFull: (driverId: string) => Promise<void>;
  payQuickAmount: (
    driverId: string,
    amount: number,
    mode: string,
  ) => Promise<void>;
  addSalaryEntry: (input: NewEntryInput) => Promise<void>;

  addDriver: (input: {
    name: string;
    vehiclePlate: string | null;
    phone?: string;
    dob?: string;
    bloodGroup?: string;
    address?: string;
  }) => Promise<void>;
  editDriver: (id: string, patch: Partial<Driver>) => Promise<void>;

  editVehicle: (plate: string, patch: Partial<Vehicle>) => Promise<void>;
  assignVehicle: (plate: string, driverName: string) => Promise<void>;
  addVehicle: (input: {
    plate: string;
    type: string;
    brand: string;
    model: string;
    fuelType: string;
    driver: string | null;
    status: 'On Road' | 'Available';
  }) => Promise<void>;

  addAdvance: (
    driverId: string,
    amount: number,
    reason: string,
  ) => Promise<void>;

  refresh: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({children}: {children: React.ReactNode}) {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [salaryEntries, setSalaryEntries] = useState<SalaryEntry[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const login = useCallback(() => {
    setIsAuthenticated(true);
    setMeta(AUTH_META_KEY, 'true');
  }, []);
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setMeta(AUTH_META_KEY, 'false');
  }, []);

  // ---- Bootstrap: create tables, seed once, load everything from SQLite ----
  const refresh = useCallback(async () => {
    const [d, v, se, act] = await Promise.all([
      fetchAllDrivers(),
      fetchAllVehicles(),
      fetchAllSalaryEntries(),
      fetchRecentActivities(),
    ]);
    setDrivers(d);
    setVehicles(v);
    setSalaryEntries(se);
    setActivities(act);
  }, []);

  useEffect(() => {
    (async () => {
      await initDatabase();
      // Demo/sample data seeding is disabled for client-facing builds so a
      // fresh install starts genuinely empty instead of showing placeholder
      // drivers, vehicles, and salary entries. Re-enable seedIfEmpty() below
      // only for internal/dev testing.
      // await seedIfEmpty();
      const storedAuth = await getMeta(AUTH_META_KEY);
      setIsAuthenticated(storedAuth === 'true');
      await refresh();
      setIsReady(true);
    })();
  }, [refresh]);

  const getDriver = useCallback(
    (id: string) => drivers.find(d => d.driverId === id),
    [drivers],
  );
  const getVehicle = useCallback(
    (plate: string) => vehicles.find(v => v.plate === plate),
    [vehicles],
  );

  // ---- Actions: each writes to SQLite, then reloads state from the DB ----

  const paySalaryFull = useCallback(
    async (driverId: string) => {
      const driver = drivers.find(d => d.driverId === driverId);
      if (!driver || driver.pending <= 0) {
        return;
      }
      const amount = driver.pending;
      const today = todayISO();

      await insertPayment(driverId, {
        amount,
        mode: 'Bank Transfer',
        date: today,
        ref: 'TXN' + Date.now().toString().slice(-9),
      });
      await updateDriverFields(driverId, {
        paid: driver.paid + amount,
        pending: 0,
      });
      await updateLatestSalaryHistory(driverId, {
        paid: driver.salary,
        pending: 0,
        status: 'Paid',
      });
      await insertActivity({
        icon: 'credit-card',
        bg: '#dcfce7',
        fg: '#16a34a',
        title: `Salary paid to ${driver.name}`,
        sub: `₹${amount.toLocaleString('en-IN')} · Bank Transfer`,
      });
      await refresh();
    },
    [drivers, refresh],
  );

  const payQuickAmount = useCallback(
    async (driverId: string, rawAmount: number, mode: string) => {
      const driver = drivers.find(d => d.driverId === driverId);
      if (!driver) {
        return;
      }
      const amount = Math.min(Math.max(rawAmount, 0), driver.pending);
      if (amount <= 0) {
        return;
      }
      const today = todayISO();

      await insertPayment(driverId, {
        amount,
        mode,
        date: today,
        ref:
          (mode === 'Cash' ? 'CASH-' : 'TXN') + Date.now().toString().slice(-9),
      });
      const newPaid = driver.paid + amount;
      const newPending = driver.pending - amount;
      await updateDriverFields(driverId, {paid: newPaid, pending: newPending});
      if (driver.salaryHistory[0]) {
        const h = driver.salaryHistory[0];
        const historyPending = Math.max(h.pending - amount, 0);
        await updateLatestSalaryHistory(driverId, {
          paid: h.paid + amount,
          pending: historyPending,
          status: historyPending > 0 ? 'Partial' : 'Paid',
        });
      }
      await insertActivity({
        icon: 'credit-card',
        bg: '#dcfce7',
        fg: '#16a34a',
        title: `Salary paid to ${driver.name}`,
        sub: `₹${amount.toLocaleString('en-IN')} · ${mode}`,
      });
      await refresh();
    },
    [drivers, refresh],
  );

  const addSalaryEntry = useCallback(
    async (input: NewEntryInput) => {
      const driver = drivers.find(d => d.driverId === input.driverId);
      const advance = driver?.advanceTotal ?? 0;
      const total = input.dailyRate * input.days;
      const pending = Math.max(total - advance, 0);
      const entry: SalaryEntry = {
        driverId: input.driverId,
        from: todayISO(),
        to: addDaysISO(Math.max(input.days - 1, 0)),
        days: input.days,
        rate: input.dailyRate,
        advance,
        paid: 0,
        paidMode: input.mode,
        status: pending > 0 ? 'Pending' : 'Paid',
        note: input.notes,
      };
      await insertSalaryEntryRow(entry);
      await refresh();
    },
    [drivers, refresh],
  );

  const addDriver = useCallback(
    async (input: {
      name: string;
      vehiclePlate: string | null;
      phone?: string;
      dob?: string;
      bloodGroup?: string;
      address?: string;
    }) => {
      const count = await countDrivers();
      const idNum = (count + 1).toString().padStart(3, '0');
      const driverId = 'DRV-' + idNum;
      const chosenVehicle = input.vehiclePlate
        ? vehicles.find(v => v.plate === input.vehiclePlate)
        : undefined;

      const newDriver: Driver = {
        driverId,
        name: input.name || 'New Driver',
        phone: input.phone || '+91 90000 00000',
        vehiclePlate: chosenVehicle ? chosenVehicle.plate : null,
        vehicleModel: chosenVehicle ? chosenVehicle.type : null,
        status: 'Active',
        rating: 5.0,
        salary: 8000,
        paid: 0,
        pending: 8000,
        advanceTotal: 0,
        dob: input.dob || '—',
        bloodGroup: input.bloodGroup || '—',
        address: input.address || '—',
        aadhaar: '—',
        license: '—',
        licenseExpiry: '—',
        joiningDate: todayISO(),
        emergency: '—',
        salaryHistory: [],
        advances: [],
        payments: [],
        docs: [],
      };

      await insertDriver(newDriver);
      if (chosenVehicle) {
        await updateVehicleFields(chosenVehicle.plate, {
          driver: newDriver.name,
          status: 'On Road',
        });
      }
      await insertActivity({
        icon: 'user-plus',
        bg: '#ede9fe',
        fg: '#7c3aed',
        title: `New driver ${newDriver.name} onboarded`,
        sub: `${driverId} · Active`,
      });
      await refresh();
    },
    [vehicles, refresh],
  );

  const editDriver = useCallback(
    async (id: string, patch: Partial<Driver>) => {
      await updateDriverFields(id, patch);
      await refresh();
    },
    [refresh],
  );

  const editVehicle = useCallback(
    async (plate: string, patch: Partial<Vehicle>) => {
      await updateVehicleFields(plate, patch);
      // Keep the driver's cached vehicle fields in sync if the plate itself was renamed.
      if (patch.plate && patch.plate !== plate) {
        await run(
          'UPDATE drivers SET vehiclePlate = ? WHERE vehiclePlate = ?;',
          [patch.plate, plate],
        );
      }
      await refresh();
    },
    [refresh],
  );

  const assignVehicle = useCallback(
    async (plate: string, driverName: string) => {
      await updateVehicleFields(plate, {driver: driverName, status: 'On Road'});
      await refresh();
    },
    [refresh],
  );

  const addVehicle = useCallback(
    async (input: {
      plate: string;
      type: string;
      brand: string;
      model: string;
      fuelType: string;
      driver: string | null;
      status: 'On Road' | 'Available';
    }) => {
      await insertVehicle({
        plate: input.plate,
        type: input.type,
        brand: input.brand,
        model: input.model,
        fuelType: input.fuelType,
        driver: input.driver,
        status: input.status,
        ins: 'ok',
        rc: 'ok',
        permit: '—',
      });
      if (input.driver) {
        const chosenDriver = drivers.find(d => d.name === input.driver);
        if (chosenDriver) {
          await updateDriverFields(chosenDriver.driverId, {
            vehiclePlate: input.plate,
            vehicleModel: input.model,
          });
        }
      }
      await refresh();
    },
    [drivers, refresh],
  );

  const addAdvance = useCallback(
    async (driverId: string, amount: number, reason: string) => {
      const driver = drivers.find(d => d.driverId === driverId);
      if (!driver) {
        return;
      }
      await insertAdvance(driverId, {
        amount,
        reason,
        date: todayISO(),
        status: 'Pending',
      });
      await updateDriverFields(driverId, {
        advanceTotal: driver.advanceTotal + amount,
      });
      await refresh();
    },
    [drivers, refresh],
  );

  const totals: Totals = useMemo(() => {
    return {
      totalDrivers: drivers.length,
      activeDrivers: drivers.filter(d => d.status === 'Active').length,
      totalVehicles: vehicles.length,
      payroll: drivers.reduce((s, d) => s + d.salary, 0),
      paid: drivers.reduce((s, d) => s + d.paid, 0),
      pending: drivers.reduce((s, d) => s + d.pending, 0),
      advance: drivers.reduce((s, d) => s + d.advanceTotal, 0),
    };
  }, [drivers, vehicles]);

  const value: AppContextValue = {
    isReady,
    isAuthenticated,
    login,
    logout,
    drivers,
    vehicles,
    salaryEntries,
    activities,
    totals,
    getDriver,
    getVehicle,
    paySalaryFull,
    payQuickAmount,
    addSalaryEntry,
    addDriver,
    editDriver,
    editVehicle,
    assignVehicle,
    addVehicle,
    addAdvance,
    refresh,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
