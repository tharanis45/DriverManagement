import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainTabParamList, RootStackParamList} from '@/navigation/types';
import {colors} from '@/theme/colors';
import {fmt} from '@/utils/format';
import {useApp} from '@/context/AppContext';
import {Driver} from '@/context/types';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import Pill, {statusVariant} from '@/components/Pill';
import TabPills from '@/components/TabPills';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Drivers'>,
  NativeStackScreenProps<RootStackParamList>
>;

const FILTERS = ['All', 'Active', 'Inactive', 'Pending Salary'];

export default function DriversScreen({navigation}: Props) {
  const {drivers} = useApp();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return drivers.filter(d => {
      if (filter === 'Active' && d.status !== 'Active') {
        return false;
      }
      if (filter === 'Inactive' && d.status !== 'Inactive') {
        return false;
      }
      if (filter === 'Pending Salary' && d.pending <= 0) {
        return false;
      }
      if (search) {
        const q = search.toLowerCase();
        if (
          !d.name.toLowerCase().includes(q) &&
          !d.driverId.toLowerCase().includes(q) &&
          !(d.vehiclePlate || '').toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [drivers, filter, search]);

  const renderItem = ({item: d}: {item: Driver}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('DriverProfile', {driverId: d.driverId})
      }>
      <Card style={{marginBottom: 12}}>
        <View style={{flexDirection: 'row', gap: 12}}>
          <Avatar name={d.name} size={48} />
          <View style={{flex: 1}}>
            <View style={styles.rowBetween}>
              <Text style={styles.driverName}>{d.name}</Text>
              <Pill label={d.status} variant={statusVariant(d.status)} dot />
            </View>
            <Text style={styles.driverId}>{d.driverId}</Text>
            <View style={styles.metaRow}>
              <Icon name="phone" size={12} color={colors.muted} />
              <Text style={styles.metaText}>{d.phone}</Text>
            </View>
            {d.vehiclePlate ? (
              <View style={styles.metaRow}>
                <Icon name="truck" size={12} color={colors.muted} />
                <Text style={styles.metaText}>{d.vehiclePlate}</Text>
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.hairline} />
        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>SALARY</Text>
            <Text style={styles.statValue}>{fmt(d.salary)}</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>PAID</Text>
            <Text style={[styles.statValue, {color: colors.green}]}>
              {fmt(d.paid)}
            </Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>PENDING</Text>
            <Text
              style={[
                styles.statValue,
                {color: d.pending > 0 ? colors.amber : colors.muted2},
              ]}>
              {fmt(d.pending)}
            </Text>
          </View>
        </View>
        {d.advanceTotal > 0 && (
          <View style={styles.advanceRow}>
            <Text style={styles.advanceLabel}>Advance Taken</Text>
            <Text style={styles.advanceValue}>{fmt(d.advanceTotal)}</Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <ScreenHeader
        title="Drivers"
        right={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('AddDriver')}>
            <Icon name="plus" size={18} color="#fff" />
          </TouchableOpacity>
        }>
        <View style={styles.searchWrap}>
          <Icon
            name="search"
            size={16}
            color="#c9d7ff"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Name, phone, vehicle..."
            placeholderTextColor="#c9d7ff"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </ScreenHeader>
      <View style={styles.filterWrap}>
        <TabPills tabs={FILTERS} active={filter} onChange={setFilter} />
        <Text style={styles.countText}>
          {filtered.length} driver{filtered.length !== 1 ? 's' : ''}
        </Text>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item.driverId}
        renderItem={renderItem}
        contentContainerStyle={{padding: 20, paddingTop: 12}}
        ListEmptyComponent={
          <Card style={{alignItems: 'center', padding: 36}}>
            <Text style={{color: colors.muted}}>
              No drivers match this filter.
            </Text>
          </Card>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {position: 'relative', marginTop: 14, justifyContent: 'center'},
  searchIcon: {position: 'absolute', left: 16, zIndex: 1},
  searchInput: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 14,
    paddingLeft: 42,
    paddingRight: 16,
    paddingVertical: 13,
    color: '#fff',
    fontSize: 13.5,
  },
  filterWrap: {
    paddingHorizontal: 20,
    paddingTop: 14,
    backgroundColor: colors.bg,
  },
  countText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  driverName: {fontWeight: '800', fontSize: 14},
  driverId: {color: colors.muted, fontSize: 11.5, fontWeight: '600'},
  metaRow: {flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4},
  metaText: {color: colors.muted, fontSize: 11.5},
  hairline: {height: 1, backgroundColor: colors.line, marginVertical: 12},
  statsRow: {flexDirection: 'row'},
  statCol: {flex: 1, alignItems: 'center'},
  statLabel: {
    fontSize: 10,
    color: colors.muted2,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statValue: {fontWeight: '800', fontSize: 13.5, marginTop: 2},
  advanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 10,
  },
  advanceLabel: {color: colors.blue, fontWeight: '700', fontSize: 11.5},
  advanceValue: {color: colors.blue, fontWeight: '800'},
});
