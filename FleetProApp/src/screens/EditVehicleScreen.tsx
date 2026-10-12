import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/types';
import {colors, gradients, radii} from '@/theme/colors';
import {useApp} from '@/context/AppContext';
import LinearGradient from 'react-native-linear-gradient';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';
import DateField from '@/components/DateField';
import Button from '@/components/Button';
import VehicleFormFields, {
  VehicleFormState,
  validateVehicleForm,
  hasVehicleFormErrors,
} from '@/components/VehicleFormFields';

type Props = NativeStackScreenProps<RootStackParamList, 'EditVehicle'>;

export default function EditVehicleScreen({route, navigation}: Props) {
  const {vehicles, drivers, editVehicle} = useApp();
  const vehicle = vehicles.find(v => v.plate === route.params.plate);
  const [form, setForm] = useState<VehicleFormState>(() => ({
    plate: vehicle?.plate ?? '',
    type: vehicle?.type ?? '',
    brand: vehicle?.brand ?? '',
    model: vehicle?.model ?? '',
    fuelType: vehicle?.fuelType ?? '',
    driver: vehicle?.driver ?? '',
    status: vehicle?.status ?? 'Available',
  }));
  const [permit, setPermit] = useState(vehicle?.permit ?? '');
  const [ins, setIns] = useState(vehicle?.ins ?? 'ok');
  const [rc, setRc] = useState(vehicle?.rc ?? 'ok');
  const [errors, setErrors] = useState<ReturnType<typeof validateVehicleForm>>(
    {},
  );

  if (!vehicle) {
    return null;
  }

  const driverOptions = drivers
    .filter(d => !d.vehiclePlate || d.name === vehicle.driver)
    .map(d => ({label: d.name, value: d.name}));

  const save = () => {
    const nextErrors = validateVehicleForm(form);
    setErrors(nextErrors);
    if (hasVehicleFormErrors(nextErrors)) {
      return;
    }
    editVehicle(vehicle.plate, {
      plate: form.plate,
      type: form.type,
      brand: form.brand,
      model: form.model,
      fuelType: form.fuelType,
      driver: form.driver || null,
      status: form.driver ? 'On Road' : form.status,
      permit,
      ins: ins as 'ok' | 'warn',
      rc: rc as 'ok' | 'warn',
    });
    navigation.goBack();
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <ScreenHeader title="Edit Vehicle" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{padding: 20}}>
        <View style={{alignItems: 'center', marginBottom: 16}}>
          <LinearGradient
            colors={gradients.truckIcon as unknown as string[]}
            style={styles.iconBox}>
            <Icon name="truck" size={30} color="#fff" />
          </LinearGradient>
        </View>
        <Card>
          <VehicleFormFields
            form={form}
            setForm={setForm}
            errors={errors}
            driverOptions={driverOptions}
          />

          <DateField
            label="PERMIT EXPIRY"
            value={permit === '—' ? '' : permit}
            onChange={setPermit}
          />

          <View style={{flexDirection: 'row', gap: 10}}>
            <View style={{flex: 1}}>
              <Text style={styles.fieldLabel}>INSURANCE</Text>
              <View style={styles.pickerWrap}>
                <Picker selectedValue={ins} onValueChange={setIns}>
                  <Picker.Item label="Valid" value="ok" />
                  <Picker.Item label="Needs Renewal" value="warn" />
                </Picker>
              </View>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.fieldLabel}>RC STATUS</Text>
              <View style={styles.pickerWrap}>
                <Picker selectedValue={rc} onValueChange={setRc}>
                  <Picker.Item label="Valid" value="ok" />
                  <Picker.Item label="Needs Renewal" value="warn" />
                </Picker>
              </View>
            </View>
          </View>
        </Card>
        <View style={{flexDirection: 'row', gap: 10, marginTop: 16}}>
          <Button
            label="Cancel"
            variant="outline"
            style={{flex: 1}}
            onPress={() => navigation.goBack()}
          />
          <Button label="Save Changes" style={{flex: 1}} onPress={save} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    width: 74,
    height: 74,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#8790ab',
    marginBottom: 6,
  },
  pickerWrap: {
    backgroundColor: '#f1f3fa',
    borderRadius: radii.md,
    overflow: 'hidden',
    marginBottom: 14,
  },
});
