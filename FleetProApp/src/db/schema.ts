export const SCHEMA_STATEMENTS: string[] = [
  `CREATE TABLE IF NOT EXISTS drivers (
    driverId TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    vehiclePlate TEXT,
    vehicleModel TEXT,
    status TEXT NOT NULL,
    rating REAL NOT NULL,
    salary INTEGER NOT NULL,
    paid INTEGER NOT NULL,
    pending INTEGER NOT NULL,
    advanceTotal INTEGER NOT NULL,
    dob TEXT,
    bloodGroup TEXT,
    address TEXT,
    aadhaar TEXT,
    license TEXT,
    licenseExpiry TEXT,
    joiningDate TEXT,
    emergency TEXT
  );`,

  `CREATE TABLE IF NOT EXISTS salary_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driverId TEXT NOT NULL,
    month TEXT NOT NULL,
    status TEXT NOT NULL,
    salary INTEGER NOT NULL,
    paid INTEGER NOT NULL,
    pending INTEGER NOT NULL,
    FOREIGN KEY (driverId) REFERENCES drivers(driverId) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS advances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driverId TEXT NOT NULL,
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (driverId) REFERENCES drivers(driverId) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driverId TEXT NOT NULL,
    amount INTEGER NOT NULL,
    mode TEXT NOT NULL,
    date TEXT NOT NULL,
    ref TEXT NOT NULL,
    FOREIGN KEY (driverId) REFERENCES drivers(driverId) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS driver_docs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driverId TEXT NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (driverId) REFERENCES drivers(driverId) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS vehicles (
    plate TEXT PRIMARY KEY NOT NULL,
    type TEXT NOT NULL,
    brand TEXT NOT NULL DEFAULT '',
    model TEXT NOT NULL DEFAULT '',
    fuelType TEXT NOT NULL DEFAULT '',
    driver TEXT,
    status TEXT NOT NULL,
    ins TEXT NOT NULL,
    rc TEXT NOT NULL,
    permit TEXT NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS salary_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driverId TEXT NOT NULL,
    fromDate TEXT NOT NULL,
    toDate TEXT NOT NULL,
    days INTEGER NOT NULL,
    rate INTEGER NOT NULL,
    advance INTEGER NOT NULL,
    paid INTEGER NOT NULL,
    paidMode TEXT NOT NULL,
    status TEXT NOT NULL,
    note TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (driverId) REFERENCES drivers(driverId) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    icon TEXT NOT NULL,
    bg TEXT NOT NULL,
    fg TEXT NOT NULL,
    title TEXT NOT NULL,
    sub TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );`,
];
