import React from 'react';
import {Text} from 'react-native';
import FormField from '@/components/FormField';
import PickerField from '@/components/PickerField';
import RadioGroup from '@/components/RadioGroup';
import {
  VEHICLE_TYPES,
  VEHICLE_BRANDS,
  FUEL_TYPES,
} from '@/constants/vehicleOptions';
import {requiredError} from '@/utils/validation';

export type VehicleFormState = {
  plate: string;
  type: string;
  brand: string;
  model: string;
  fuelType: string;
  driver: string;
  status: 'On Road' | 'Available';
};

export type VehicleFormErrors = Partial<Record<keyof VehicleFormState, string>>;

export function validateVehicleForm(form: VehicleFormState): VehicleFormErrors {
  return {
    plate: requiredError(form.plate, 'Vehicle number'),
    type: requiredError(form.type, 'Vehicle type'),
    brand: requiredError(form.brand, 'Brand'),
    model: requiredError(form.model, 'Model'),
    fuelType: requiredError(form.fuelType, 'Fuel type'),
    status: requiredError(form.status, 'Status'),
  };
}

export function hasVehicleFormErrors(errors: VehicleFormErrors): boolean {
  return Object.values(errors).some(Boolean);
}

const VEHICLE_TYPE_OPTIONS = VEHICLE_TYPES.map(t => ({label: t, value: t}));
const VEHICLE_BRAND_OPTIONS = VEHICLE_BRANDS.map(b => ({label: b, value: b}));
const FUEL_TYPE_OPTIONS = FUEL_TYPES.map(f => ({label: f, value: f}));
const STATUS_OPTIONS = [
  {label: 'On Road', value: 'On Road'},
  {label: 'Available', value: 'Available'},
];

export default function VehicleFormFields({
  form,
  setForm,
  errors,
  driverOptions,
  plateEditable = true,
}: {
  form: VehicleFormState;
  setForm: (updater: (f: VehicleFormState) => VehicleFormState) => void;
  errors: VehicleFormErrors;
  driverOptions: {label: string; value: string}[];
  plateEditable?: boolean;
}) {
  return (
    <>
      <FormField
        label="VEHICLE NUMBER *"
        placeholder="e.g. KA 05 XY 4321"
        value={form.plate}
        editable={plateEditable}
        autoCapitalize="characters"
        onChangeText={t => setForm(f => ({...f, plate: t}))}
      />
      {errors.plate ? <ErrorText text={errors.plate} /> : null}

      <PickerField
        label="VEHICLE TYPE *"
        value={form.type}
        onChange={v => setForm(f => ({...f, type: v}))}
        options={VEHICLE_TYPE_OPTIONS}
        placeholder="Select vehicle type"
        error={errors.type}
      />

      <PickerField
        label="BRAND *"
        value={form.brand}
        onChange={v => setForm(f => ({...f, brand: v}))}
        options={VEHICLE_BRAND_OPTIONS}
        placeholder="Select brand"
        error={errors.brand}
      />

      <FormField
        label="MODEL *"
        placeholder="e.g. Swift Dzire"
        value={form.model}
        onChangeText={t => setForm(f => ({...f, model: t}))}
      />
      {errors.model ? <ErrorText text={errors.model} /> : null}

      <RadioGroup
        label="FUEL TYPE *"
        options={FUEL_TYPE_OPTIONS}
        value={form.fuelType}
        onChange={v => setForm(f => ({...f, fuelType: v}))}
        error={errors.fuelType}
      />

      <RadioGroup
        label="DRIVER ASSIGNED *"
        options={[{label: 'Unassigned', value: ''}, ...driverOptions]}
        value={form.driver}
        onChange={v => setForm(f => ({...f, driver: v}))}
        columns={2}
      />

      <RadioGroup
        label="STATUS *"
        options={STATUS_OPTIONS}
        value={form.status}
        onChange={v =>
          setForm(f => ({...f, status: v as 'On Road' | 'Available'}))
        }
        error={errors.status}
      />
    </>
  );
}

function ErrorText({text}: {text: string}) {
  return (
    <Text
      style={{
        fontSize: 11,
        color: '#dc2626',
        marginTop: -10,
        marginBottom: 10,
        fontWeight: '600',
      }}>
      {text}
    </Text>
  );
}
