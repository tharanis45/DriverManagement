export type RootStackParamList = {
  Launch: undefined;
  Login: undefined;
  MainTabs: undefined;
  DriverProfile: {driverId: string};
  EditDriver: {driverId: string};
  AddDriver: undefined;
  EditVehicle: {plate: string};
  SalaryManagement: undefined;

  // modal-presentation screens
  AddSalaryEntry: {driverId?: string; mode: 'full' | 'quickPay'};
  AddAdvance: {driverId?: string};
  AddVehicleModal: undefined;
  AssignVehicleModal: {plate: string};
  LogoutConfirm: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Drivers: undefined;
  Vehicles: undefined;
  Reports: undefined;
};
