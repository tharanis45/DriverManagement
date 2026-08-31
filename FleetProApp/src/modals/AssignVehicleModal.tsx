import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/types';
import {colors} from '@/theme/colors';
import {useApp} from '@/context/AppContext';
import Avatar from '@/components/Avatar';

type Props = NativeStackScreenProps<RootStackParamList, 'AssignVehicleModal'>;

export default function AssignVehicleModal({route, navigation}: Props) {
  const {drivers, assignVehicle} = useApp();
  const activeDrivers = drivers.filter(d => d.status === 'Active');

  const handleAssign = (name: string) => {
    assignVehicle(route.params.plate, name);
    navigation.goBack();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Assign {route.params.plate}</Text>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => navigation.goBack()}>
            <Icon name="x" size={18} color={colors.muted} />
          </TouchableOpacity>
        </View>
        {activeDrivers.map((d, i, arr) => (
          <TouchableOpacity
            key={d.driverId}
            style={[styles.row, i < arr.length - 1 && styles.borderBottom]}
            onPress={() => handleAssign(d.name)}>
            <Avatar name={d.name} size={38} />
            <Text style={styles.name}>{d.name}</Text>
            <Icon name="chevron-right" size={16} color={colors.muted2} />
          </TouchableOpacity>
        ))}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
  },
  borderBottom: {borderBottomWidth: 1, borderBottomColor: colors.line},
  name: {flex: 1, fontWeight: '700'},
});
