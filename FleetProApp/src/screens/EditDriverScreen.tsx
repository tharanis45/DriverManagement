import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/types';
import {colors} from '@/theme/colors';
import {useApp} from '@/context/AppContext';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import FormField from '@/components/FormField';
import DateField from '@/components/DateField';
import Button from '@/components/Button';
import {mobileError, requiredError} from '@/utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'EditDriver'>;

export default function EditDriverScreen({route, navigation}: Props) {
  const {getDriver, editDriver} = useApp();
  const driver = getDriver(route.params.driverId);
  const [form, setForm] = useState(() => ({
    name: driver?.name ?? '',
    phone: driver?.phone ?? '',
    dob: driver?.dob === '—' ? '' : driver?.dob ?? '',
    bloodGroup: driver?.bloodGroup === '—' ? '' : driver?.bloodGroup ?? '',
    address: driver?.address === '—' ? '' : driver?.address ?? '',
    aadhaar: driver?.aadhaar === '—' ? '' : driver?.aadhaar ?? '',
    license: driver?.license === '—' ? '' : driver?.license ?? '',
    licenseExpiry:
      driver?.licenseExpiry === '—' ? '' : driver?.licenseExpiry ?? '',
    emergency: driver?.emergency === '—' ? '' : driver?.emergency ?? '',
  }));
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    emergency?: string;
  }>({});

  if (!driver) {
    return null;
  }

  const set = (key: keyof typeof form) => (value: string) =>
    setForm(f => ({...f, [key]: value}));

  const save = () => {
    const nextErrors = {
      name: requiredError(form.name, 'Full name'),
      phone: mobileError(form.phone),
      emergency: form.emergency
        ? mobileError(form.emergency, false)
        : undefined,
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.phone || nextErrors.emergency) {
      return;
    }
    const patch: Record<string, string> = {};
    (Object.keys(form) as (keyof typeof form)[]).forEach(k => {
      if (form[k].trim()) {
        patch[k] = form[k].trim();
      }
    });
    editDriver(driver.driverId, patch);
    navigation.goBack();
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <ScreenHeader title="Edit Driver" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{padding: 20}}>
        <View style={{alignItems: 'center', marginBottom: 16}}>
          <Avatar name={driver.name} size={74} radius={20} />
        </View>
        <Card>
          <FormField
            label="FULL NAME *"
            value={form.name}
            onChangeText={set('name')}
          />
          {errors.name ? (
            <Text style={styles.errorText}>{errors.name}</Text>
          ) : null}

          <FormField
            label="DRIVER ID"
            value={driver.driverId}
            editable={false}
          />
          <FormField
            label="MOBILE *"
            value={form.phone}
            onChangeText={set('phone')}
            keyboardType="phone-pad"
          />
          {errors.phone ? (
            <Text style={styles.errorText}>{errors.phone}</Text>
          ) : null}

          <DateField
            label="DATE OF BIRTH"
            value={form.dob}
            onChange={set('dob')}
          />
          <FormField
            label="BLOOD GROUP"
            value={form.bloodGroup}
            onChangeText={set('bloodGroup')}
          />
          <FormField
            label="ADDRESS"
            value={form.address}
            onChangeText={set('address')}
            multiline
          />
          <FormField
            label="AADHAAR"
            value={form.aadhaar}
            onChangeText={set('aadhaar')}
          />
          <FormField
            label="LICENSE NUMBER"
            value={form.license}
            onChangeText={set('license')}
          />
          <DateField
            label="LICENSE EXPIRY"
            value={form.licenseExpiry}
            onChange={set('licenseExpiry')}
          />
          <FormField
            label="EMERGENCY CONTACT"
            value={form.emergency}
            onChangeText={set('emergency')}
            keyboardType="phone-pad"
            containerStyle={{marginBottom: 0}}
          />
          {errors.emergency ? (
            <Text style={styles.errorText}>{errors.emergency}</Text>
          ) : null}
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
  errorText: {
    fontSize: 11,
    color: colors.red,
    marginTop: -10,
    marginBottom: 10,
    fontWeight: '600',
  },
});
