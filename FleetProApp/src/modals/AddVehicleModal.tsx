import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/types';
import {colors} from '@/theme/colors';
import {useApp} from '@/context/AppContext';
import Button from '@/components/Button';
import VehicleFormFields, {
  VehicleFormState,
  validateVehicleForm,
  hasVehicleFormErrors,
} from '@/components/VehicleFormFields';

type Props = NativeStackScreenProps<RootStackParamList, 'AddVehicleModal'>;

export default function AddVehicleModal({navigation}: Props) {
  const {addVehicle, drivers} = useApp();
  const [form, setForm] = useState<VehicleFormState>({
    plate: '',
    type: '',
    brand: '',
    model: '',
    fuelType: '',
    driver: '',
    status: 'Available',
  });
  const [errors, setErrors] = useState<ReturnType<typeof validateVehicleForm>>(
    {},
  );

  const driverOptions = drivers
    .filter(d => !d.vehiclePlate)
    .map(d => ({label: d.name, value: d.name}));

  const save = () => {
    const nextErrors = validateVehicleForm(form);
    setErrors(nextErrors);
    if (hasVehicleFormErrors(nextErrors)) {
      return;
    }
    addVehicle({
      plate: form.plate,
      type: form.type,
      brand: form.brand,
      model: form.model,
      fuelType: form.fuelType,
      driver: form.driver || null,
      status: form.driver ? 'On Road' : form.status,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Vehicle</Text>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => navigation.goBack()}>
            <Icon name="x" size={18} color={colors.muted} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{paddingBottom: 4}}>
          <VehicleFormFields
            form={form}
            setForm={setForm}
            errors={errors}
            driverOptions={driverOptions}
          />
        </ScrollView>
        <Button label="Save Vehicle" onPress={save} style={{marginTop: 6}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10,12,25,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '88%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {fontWeight: '800', fontSize: 15.5},
  closeBtn: {padding: 4},
});
