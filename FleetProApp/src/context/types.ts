export type DriverStatus = 'Active' | 'Inactive';
export type PayStatus = 'Paid' | 'Partial' | 'Pending' | 'Settled';

export type SalaryHistoryEntry = {
  month: string;
  status: PayStatus;
  salary: number;
  paid: number;
  pending: number;
};

export type AdvanceEntry = {
  amount: number;
  reason: string;
  date: string;
  status: PayStatus;
};

export type PaymentEntry = {
  amount: number;
  mode: string;
  date: string;
  ref: string;
};

export type Driver = {
  driverId: string;
  name: string;
  phone: string;
  vehiclePlate: string | null;
  vehicleModel: string | null;
  status: DriverStatus;
  rating: number;
  salary: number;
  paid: number;
  pending: number;
  advanceTotal: number;
  dob: string;
  bloodGroup: string;
  address: string;
  aadhaar: string;
  license: string;
  licenseExpiry: string;
  joiningDate: string;
  emergency: string;
  salaryHistory: SalaryHistoryEntry[];
  advances: AdvanceEntry[];
  payments: PaymentEntry[];
  docs: string[];
};

export type DocStatus = 'ok' | 'warn';
export type VehicleStatus = 'On Road' | 'Available';

export type Vehicle = {
  plate: string;
  type: string;
  brand: string;
  model: string;
  fuelType: string;
  driver: string | null;
  status: VehicleStatus;
  ins: DocStatus;
  rc: DocStatus;
  permit: string;
};

export type SalaryEntry = {
  driverId: string;
  from: string;
  to: string;
  days: number;
  rate: number;
  advance: number;
  paid: number;
  paidMode: string;
  status: PayStatus;
  note: string;
};

export type Activity = {
  icon: string;
  bg: string;
  fg: string;
  title: string;
  sub: string;
  time: string;
};

export type Totals = {
  totalDrivers: number;
  activeDrivers: number;
  totalVehicles: number;
  payroll: number;
  paid: number;
  pending: number;
  advance: number;
};
