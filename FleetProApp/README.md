# FleetPro — React Native App (SQLite-backed)

Full driver/fleet management app, ported from the FleetPro HTML prototype. Built with React Native CLI (0.74.3) + TypeScript. **All data lives in a local SQLite database on-device — no network calls, no backend.**

## Stack
- React Navigation (native-stack + bottom-tabs)
- **react-native-sqlite-storage** — the persistence layer (see below)
- react-native-svg (donut/line charts)
- react-native-linear-gradient (headers, splash)
- react-native-vector-icons (Feather icon set)
- @react-native-picker/picker (dropdowns)

## Data layer (`src/db/`)

```
src/db/
  database.ts             opens the SQLite connection, exposes run()/query()/runInTransaction() helpers
  schema.ts                CREATE TABLE statements for every table
  initDatabase.ts           runs the schema once on app boot
  seed.ts                   inserts the original mock dataset ONCE (checked via a `meta` table flag),
                            so first launch looks identical to the old in-memory version, but every
                            launch after that reads only what's actually in the DB
  driverRepository.ts       drivers + their nested salary_history / advances / payments / driver_docs rows
  vehicleRepository.ts      vehicles table CRUD
  salaryEntryRepository.ts  the day-based salary_entries table (Salary Management → All Entries)
  activityRepository.ts     activities table; converts stored timestamps to "2m ago" / "Yesterday" etc.
                            at read time via src/utils/time.ts, so labels stay accurate across app restarts
  metaRepository.ts         tiny key/value table, currently just tracks "have we seeded yet"
```

### Tables
`drivers`, `salary_history`, `advances`, `payments`, `driver_docs`, `vehicles`, `salary_entries`, `activities`, `meta` — see `schema.ts` for exact columns. Driver's nested arrays (salary history, advances, payments, docs) are normalized into their own tables with a `driverId` foreign key rather than stored as JSON blobs, so they're independently queryable/indexable if the app grows.

### How screens get data
`AppContext` (`src/context/AppContext.tsx`) is now a thin reactive cache in front of SQLite:
1. On mount: `initDatabase()` → `seedIfEmpty()` → `refresh()` (loads everything into React state) → flips `isReady` to `true`.
2. `RootNavigator` shows a spinner until `isReady` is true (this is the only loading state in the app — should be near-instant on-device).
3. Every mutation (`paySalaryFull`, `payQuickAmount`, `addSalaryEntry`, `addDriver`, `editDriver`, `editVehicle`, `assignVehicle`, `addVehicle`, `addAdvance`) writes to SQLite first, then calls `refresh()` to reload state from the DB — so the UI is always rendering exactly what's persisted, never optimistic/out-of-sync state.

**Screens themselves did not change** — they still just call `useApp()` and destructure `drivers`, `vehicles`, `totals`, etc., same as before. Only what's inside `AppContext` changed, from in-memory arrays to SQLite-backed ones.

## Setup

```bash
npm install
```

### iOS (macOS only)
```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

### Android
```bash
npx react-native run-android
```

## One manual native step: vector icon fonts

`react-native-vector-icons` needs its font files linked natively (autolinking handles the JS side, not the font assets).

**Android** — add this line to `android/app/build.gradle` (at the bottom):
```gradle
apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")
```

**iOS** — add `Feather.ttf` to `Info.plist` under `UIAppFonts` (the font file lives in `node_modules/react-native-vector-icons/Fonts/`). Full steps: https://github.com/oblador/react-native-vector-icons#installation

`react-native-sqlite-storage`, `react-native-svg`, `react-native-linear-gradient`, `react-native-gesture-handler`, `react-native-screens`, and `react-native-safe-area-context` all autolink — just `pod install` on iOS and you're set, no other manual step needed for them.

## Resetting your data
Data now genuinely persists across app restarts (that's the point). To wipe it and re-seed from scratch during development: uninstall the app from your device/emulator and reinstall (clears the app's SQLite file), or add a temporary "Clear DB" dev button that calls `DROP TABLE`/`initDatabase()`/`seedIfEmpty()` again.

## What's wired up vs. stubbed
- **Fully functional & persisted:** all driver/vehicle CRUD, salary payments (both the quick "Pay Salary" from a driver's profile and the full day-rate "Add Entry" flow), advances, vehicle assignment, search/filtering, all totals recalculate live off the DB.
- **Cosmetic-only (as in the original prototype):** Photo upload button, Export PDF/Excel/CSV, Share Report, biometric login button (just logs you in) — these show UI but don't perform real I/O.
- **Not persisted on purpose:** login/session state (`isAuthenticated`) — resets to the login screen each app launch, which is normal auth behavior, not a data-loss bug.

## Notes
- TypeScript compiles clean (`npx tsc --noEmit`) and ESLint reports zero errors (only intentional `no-inline-styles` warnings from the default RN lint config, and one intentional bitwise-operator warning in the avatar color hash function).
- I could not execute the actual SQLite native module in this sandboxed build environment (it requires a real Android/iOS runtime) — so while every query is type-checked and the SQL was hand-verified for correctness, please do a quick smoke test (add a driver, pay a salary, kill and reopen the app to confirm it persisted) as your first step after building.
