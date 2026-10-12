import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/types';
import {colors, radii} from '@/theme/colors';
import {useApp} from '@/context/AppContext';
import Button from '@/components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'AddAdvance'>;

export default function AddAdvanceModal({route, navigation}: Props) {
  const {drivers, addAdvance} = useApp();
  const [driverId, setDriverId] = useState(
    route.params.driverId ?? drivers[0]?.driverId ?? '',
  );
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  const save = () => {
    if (!driverId) {
      return;
    }
    addAdvance(driverId, parseInt(amount, 10) || 0, reason || 'Advance');
    navigation.goBack();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Advance</Text>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => navigation.goBack()}>
            <Icon name="x" size={18} color={colors.muted} />
          </TouchableOpacity>
        </View>
        {drivers.length === 0 ? (
          <Text style={styles.emptyText}>
            No drivers found. Add a driver first before recording an advance.
          </Text>
        ) : (
          <>
            <Text style={styles.fieldLabel}>DRIVER</Text>
            <View style={styles.pickerWrap}>
              <Picker selectedValue={driverId} onValueChange={setDriverId}>
                {drivers.map(d => (
                  <Picker.Item
                    key={d.driverId}
                    label={d.name}
                    value={d.driverId}
                  />
                ))}
              </Picker>
            </View>
            <Text style={styles.fieldLabel}>AMOUNT (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2000"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <Text style={styles.fieldLabel}>REASON</Text>
            <TextInput
              style={[styles.input, {marginBottom: 18}]}
              placeholder="e.g. Medical, Fuel, Rent"
              value={reason}
              onChangeText={setReason}
            />
            <Button label="Save Advance" onPress={save} />
          </>
        )}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {fontWeight: '800', fontSize: 15.5},
  closeBtn: {padding: 4},
  emptyText: {
    fontSize: 13.5,
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: 20,
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
  input: {
    backgroundColor: '#f1f3fa',
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    fontSize: 13.5,
    color: colors.text,
  },
});
