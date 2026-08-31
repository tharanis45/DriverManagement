import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/types';
import {colors, radii} from '@/theme/colors';
import {useApp} from '@/context/AppContext';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';
import FormField from '@/components/FormField';
import DateField from '@/components/DateField';
import Button from '@/components/Button';
import TabPills from '@/components/TabPills';
import {mobileError, onlyDigits, requiredError} from '@/utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'AddDriver'>;

const TABS = ['Personal', 'Salary'];

export default function AddDriverScreen({navigation}: Props) {
  const {vehicles, drivers, addDriver} = useApp();
  const [tab, setTab] = useState('Personal');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [address, setAddress] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [errors, setErrors] = useState<{name?: string; mobile?: string}>({});

  const nextId = 'DRV-' + (drivers.length + 1).toString().padStart(3, '0');

  const validatePersonal = () => {
    const nextErrors = {
      name: requiredError(name, 'Full name'),
      mobile: mobileError(mobile),
    };
    setErrors(nextErrors);
    return !nextErrors.name && !nextErrors.mobile;
  };

  const goToSalary = () => {
    if (validatePersonal()) {
      setTab('Salary');
    }
  };

  const save = () => {
    addDriver({
      name,
      vehiclePlate: selectedVehicle,
      phone: mobile,
      dob,
      bloodGroup,
      address,
    });
    navigation.goBack();
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <ScreenHeader title="Add New Driver" onBack={() => navigation.goBack()} />
      <View style={styles.tabsWrap}>
        <TabPills tabs={TABS} active={tab} onChange={setTab} />
      </View>
      <ScrollView contentContainerStyle={{padding: 20, paddingTop: 14}}>
        {tab === 'Personal' ? (
          <>
            <TouchableOpacity style={styles.photoBox}>
              <Icon name="upload" size={22} color={colors.muted} />
              <Text style={styles.photoText}>Photo</Text>
            </TouchableOpacity>
            <Card>
              <FormField
                label="FULL NAME *"
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
              />
              {errors.name ? <ErrorText text={errors.name} /> : null}

              <FormField label="DRIVER ID" value={nextId} editable={false} />

              <FormField
                label="MOBILE *"
                placeholder="10-digit mobile number"
                keyboardType="number-pad"
                maxLength={10}
                value={mobile}
                onChangeText={t => setMobile(onlyDigits(t).slice(0, 10))}
              />
              {errors.mobile ? <ErrorText text={errors.mobile} /> : null}

              <DateField label="DATE OF BIRTH" value={dob} onChange={setDob} />
              <FormField
                label="BLOOD GROUP"
                placeholder="O+"
                value={bloodGroup}
                onChangeText={setBloodGroup}
              />
              <FormField
                label="ADDRESS"
                placeholder="Full address"
                multiline
                value={address}
                onChangeText={setAddress}
                containerStyle={{marginBottom: 0}}
              />
            </Card>

            <Card style={{marginTop: 14}}>
              <View style={styles.vehicleHeader}>
                <Icon name="truck" size={18} color={colors.blue} />
                <Text style={styles.vehicleHeaderText}>Assign Vehicle</Text>
                <Text style={styles.optionalText}>(optional)</Text>
              </View>
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={selectedVehicle ?? ''}
                  onValueChange={v => setSelectedVehicle(v || null)}
                  style={
                    Platform.OS === 'ios' ? undefined : {color: colors.text}
                  }>
                  <Picker.Item label="Unassigned" value="" />
                  {vehicles.map(v => (
                    <Picker.Item
                      key={v.plate}
                      label={`${v.plate} — ${v.type}${
                        v.driver ? ` (assigned to ${v.driver})` : ''
                      }`}
                      value={v.plate}
                      enabled={!v.driver}
                    />
                  ))}
                </Picker>
              </View>
            </Card>

            <View style={styles.actionsRow}>
              <Button
                label="Cancel"
                variant="outline"
                style={{flex: 1}}
                onPress={() => navigation.goBack()}
              />
              <Button label="Continue" style={{flex: 1}} onPress={goToSalary} />
            </View>
          </>
        ) : (
          <>
            <Card style={{backgroundColor: '#eef2ff'}}>
              <View style={styles.sectionHeader}>
                <View
                  style={[styles.sectionIcon, {backgroundColor: colors.blue}]}>
                  <Text style={styles.sectionIconText}>₹</Text>
                </View>
                <Text style={styles.sectionTitle}>Salary Setup</Text>
              </View>
              <FormField
                label="DAILY RATE (₹ PER DAY) *"
                placeholder="e.g. 800"
                keyboardType="numeric"
              />
              <View style={{flexDirection: 'row', gap: 10}}>
                <FormField
                  label="FROM DATE *"
                  placeholder="YYYY-MM-DD"
                  containerStyle={{flex: 1}}
                />
                <FormField
                  label="TO DATE *"
                  placeholder="YYYY-MM-DD"
                  containerStyle={{flex: 1}}
                />
              </View>
            </Card>

            <Card style={{backgroundColor: '#f0fdf4', marginTop: 14}}>
              <View style={styles.sectionHeader}>
                <View
                  style={[styles.sectionIcon, {backgroundColor: colors.green}]}>
                  <Text style={styles.sectionIconText}>₹</Text>
                </View>
                <Text style={styles.sectionTitle}>Payment Details</Text>
              </View>
              <View style={{flexDirection: 'row', gap: 10}}>
                <FormField
                  label="ADVANCE (₹)"
                  placeholder="0"
                  keyboardType="numeric"
                  containerStyle={{flex: 1}}
                />
                <FormField
                  label="AMOUNT PAID (₹)"
                  placeholder="0"
                  keyboardType="numeric"
                  containerStyle={{flex: 1}}
                />
              </View>
              <Text style={styles.fieldLabel}>PAYMENT MODE</Text>
              <View style={{flexDirection: 'row', gap: 8}}>
                {['Cash', 'Bank', 'UPI'].map((m, i) => (
                  <Button
                    key={m}
                    label={m}
                    variant={i === 0 ? 'green' : 'outline'}
                    style={{flex: 1}}
                  />
                ))}
              </View>
            </Card>

            <View style={styles.actionsRow}>
              <Button
                label="Cancel"
                variant="outline"
                style={{flex: 1}}
                onPress={() => navigation.goBack()}
              />
              <Button label="Save Driver" style={{flex: 1}} onPress={save} />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function ErrorText({text}: {text: string}) {
  return <Text style={styles.errorText}>{text}</Text>;
}

const styles = StyleSheet.create({
  errorText: {
    fontSize: 11,
    color: colors.red,
    marginTop: -10,
    marginBottom: 10,
    fontWeight: '600',
  },
  tabsWrap: {paddingHorizontal: 20, paddingTop: 14, backgroundColor: colors.bg},
  photoBox: {
    width: 74,
    height: 74,
    borderWidth: 2,
    borderColor: '#cfd4e6',
    borderStyle: 'dashed',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    gap: 4,
  },
  photoText: {fontSize: 10.5, fontWeight: '700', color: colors.muted},
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  vehicleHeaderText: {fontWeight: '800'},
  optionalText: {color: colors.muted2, fontWeight: '600', fontSize: 11},
  pickerWrap: {
    backgroundColor: '#f1f3fa',
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  actionsRow: {flexDirection: 'row', gap: 10, marginTop: 16, marginBottom: 20},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionIconText: {color: '#fff', fontWeight: '800'},
  sectionTitle: {fontWeight: '800'},
  fieldLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#8790ab',
    marginBottom: 8,
    marginTop: 4,
  },
});
