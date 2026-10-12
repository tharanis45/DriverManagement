import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainTabParamList, RootStackParamList} from '@/navigation/types';
import {colors, radii} from '@/theme/colors';
import {useApp} from '@/context/AppContext';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';
import StatChip from '@/components/StatChip';
import Pill from '@/components/Pill';
import Button from '@/components/Button';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Vehicles'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function VehiclesScreen({navigation}: Props) {
  const {vehicles, totals} = useApp();

  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <ScreenHeader
        title="Fleet Manager"
        subtitle={`${totals.totalVehicles} vehicles · ${
          vehicles.filter(v => v.status === 'On Road').length
        } deployed`}
        right={
          <Button
            label="Add"
            variant="ghostWhite"
            icon={<Icon name="plus" size={15} color={colors.blue} />}
            style={styles.addBtn}
            onPress={() => navigation.navigate('AddVehicleModal')}
          />
        }>
        <View style={{height: 40}} />
      </ScreenHeader>

      <View style={styles.statsWrap}>
        <View style={styles.statsCard}>
          <StatChip label="Total" value={totals.totalVehicles} />
          <StatChip
            label="On Road"
            value={vehicles.filter(v => v.status === 'On Road').length}
            color={colors.green}
          />
          <StatChip
            label="Available"
            value={vehicles.filter(v => v.status === 'Available').length}
            color={colors.blue}
          />
          <StatChip
            label="Alerts"
            value={vehicles.filter(v => v.ins !== 'ok' || v.rc !== 'ok').length}
            color={colors.amber}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{padding: 20, paddingTop: 14}}>
        {vehicles.map(v => (
          <Card key={v.plate} style={{marginBottom: 12}}>
            <View style={{flexDirection: 'row', gap: 12}}>
              <View style={styles.vehicleIcon}>
                <Icon name="truck" size={26} color="#fff" />
              </View>
              <View style={{flex: 1}}>
                <View style={styles.rowBetween}>
                  <Text style={styles.plateText}>{v.plate}</Text>
                  <Pill
                    label={v.status}
                    variant={v.status === 'On Road' ? 'green' : 'gray'}
                  />
                </View>
                <Text style={styles.typeText}>{v.type}</Text>
                <View style={styles.driverRow}>
                  <Icon name="users" size={12} color={colors.muted} />
                  <Text style={styles.driverText}>
                    {v.driver || 'Unassigned'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.badgeRow}>
              <Pill
                label={v.ins === 'ok' ? 'INS ✓' : 'INS !'}
                variant={v.ins === 'ok' ? 'green' : 'amber'}
              />
              <Pill
                label={v.rc === 'ok' ? 'RC ✓' : 'RC !'}
                variant={v.rc === 'ok' ? 'green' : 'red'}
              />
              <Pill label={`Permit ${v.permit}`} variant="gray" />
            </View>
            <View style={styles.hairline} />
            <View style={{flexDirection: 'row', gap: 10}}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() =>
                  navigation.navigate('EditVehicle', {plate: v.plate})
                }>
                <Icon name="edit-2" size={14} color={colors.text} />
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, {backgroundColor: '#f4f0ff'}]}
                onPress={() =>
                  navigation.navigate('AssignVehicleModal', {plate: v.plate})
                }>
                <Icon name="users" size={14} color={colors.purple} />
                <Text style={[styles.actionText, {color: colors.purple}]}>
                  Assign
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn: {paddingHorizontal: 16, paddingVertical: 9},
  statsWrap: {paddingHorizontal: 20},
  statsCard: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: radii.lg,
    padding: 12,
    marginTop: -24,
    shadowColor: '#141e50',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 8},
    elevation: 4,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleIcon: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateText: {fontWeight: '800', fontSize: 14.5},
  typeText: {color: colors.muted, fontSize: 11.5},
  driverRow: {flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2},
  driverText: {color: colors.muted, fontSize: 11.5},
  badgeRow: {flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap'},
  hairline: {height: 1, backgroundColor: colors.line, marginVertical: 12},
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f4f5fa',
    borderRadius: 10,
    paddingVertical: 9,
  },
  actionText: {fontWeight: '700', fontSize: 12.5, color: colors.text},
});
