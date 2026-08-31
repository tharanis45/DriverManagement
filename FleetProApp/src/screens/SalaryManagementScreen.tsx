import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/types';
import {colors, radii} from '@/theme/colors';
import {fmt, fmtK} from '@/utils/format';
import {useApp} from '@/context/AppContext';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import Pill, {statusVariant} from '@/components/Pill';
import Button from '@/components/Button';
import TabPills from '@/components/TabPills';

type Props = NativeStackScreenProps<RootStackParamList, 'SalaryManagement'>;

const STATUS_FILTERS = ['All', 'Paid', 'Partial', 'Pending'];

export default function SalaryManagementScreen({navigation}: Props) {
  const {drivers, salaryEntries, totals, payQuickAmount} = useApp();
  const [tab, setTab] = useState<'Overview' | 'All Entries'>('Overview');
  const [statusFilter, setStatusFilter] = useState('All');
  const [driverFilter, setDriverFilter] = useState('All Drivers');

  const entryTotal = (e: (typeof salaryEntries)[number]) => e.days * e.rate;
  const entryPending = (e: (typeof salaryEntries)[number]) =>
    Math.max(entryTotal(e) - e.advance - e.paid, 0);

  const filteredEntries = useMemo(() => {
    return salaryEntries.filter(e => {
      if (statusFilter !== 'All' && e.status !== statusFilter) {
        return false;
      }
      if (driverFilter !== 'All Drivers') {
        const d = drivers.find(x => x.driverId === e.driverId);
        if (!d || d.name !== driverFilter) {
          return false;
        }
      }
      return true;
    });
  }, [salaryEntries, statusFilter, driverFilter, drivers]);

  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <ScreenHeader
        title="Salary Management"
        subtitle={`Day-based · ${drivers.length} entries`}
        onBack={() => navigation.goBack()}
        right={
          <Button
            label="Add Entry"
            variant="ghostWhite"
            icon={<Icon name="plus" size={14} color={colors.blue} />}
            style={{paddingHorizontal: 14, paddingVertical: 9}}
            onPress={() =>
              navigation.navigate('AddSalaryEntry', {mode: 'full'})
            }
          />
        }>
        <View style={styles.statsRow}>
          <StatBox label="Earned" value={fmtK(totals.payroll)} color="#fff" />
          <StatBox label="Paid" value={fmtK(totals.paid)} color="#a7f3c9" />
          <StatBox
            label="Pending"
            value={fmtK(totals.pending)}
            color="#fde68a"
          />
          <StatBox label="Advance" value={fmtK(totals.advance)} color="#fff" />
        </View>
      </ScreenHeader>

      <View style={styles.segmentWrap}>
        <View style={styles.segment}>
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              tab === 'Overview' && styles.segmentBtnActive,
            ]}
            onPress={() => setTab('Overview')}>
            <Text
              style={[
                styles.segmentText,
                tab === 'Overview' && styles.segmentTextActive,
              ]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              tab === 'All Entries' && styles.segmentBtnActive,
            ]}
            onPress={() => setTab('All Entries')}>
            <Text
              style={[
                styles.segmentText,
                tab === 'All Entries' && styles.segmentTextActive,
              ]}>
              All Entries
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{padding: 20, paddingTop: 14}}>
        {tab === 'Overview' ? (
          drivers.map(d => {
            const progress = d.salary
              ? Math.round((d.paid / d.salary) * 100)
              : 0;
            return (
              <Card key={d.driverId} style={{marginBottom: 12}}>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                  <Avatar name={d.name} size={44} />
                  <View style={{flex: 1}}>
                    <Text style={{fontWeight: '800'}}>{d.name}</Text>
                    <Text style={styles.mutedSmall}>
                      {d.driverId} · 1 entry
                    </Text>
                  </View>
                  <Pill label={d.status} variant={statusVariant(d.status)} />
                </View>
                <View style={styles.fourCol}>
                  <FourColItem label="TOTAL" value={fmtK(d.salary)} />
                  <FourColItem
                    label="ADVANCE"
                    value={fmtK(d.advanceTotal)}
                    color={colors.blue}
                  />
                  <FourColItem
                    label="PAID"
                    value={fmtK(d.paid)}
                    color={colors.green}
                  />
                  <FourColItem
                    label="PENDING"
                    value={fmtK(d.pending)}
                    color={d.pending > 0 ? colors.amber : colors.muted2}
                  />
                </View>
                <View style={styles.progressRow}>
                  <Text style={styles.mutedSmall}>Payment progress</Text>
                  <Text style={{fontWeight: '800'}}>{progress}%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${progress}%`,
                        backgroundColor:
                          progress >= 100 ? colors.green : colors.amber,
                      },
                    ]}
                  />
                </View>
                <View style={{flexDirection: 'row', gap: 10, marginTop: 12}}>
                  {d.pending > 0 ? (
                    <Button
                      label={`Pay ${fmtK(d.pending)}`}
                      style={{flex: 1}}
                      onPress={() =>
                        payQuickAmount(d.driverId, d.pending, 'Bank Transfer')
                      }
                    />
                  ) : (
                    <Button
                      label="Fully Settled"
                      variant="outline"
                      style={{flex: 1}}
                      disabled
                    />
                  )}
                  <Button
                    label="Entry"
                    variant="outline"
                    style={{width: 100}}
                    onPress={() =>
                      navigation.navigate('AddSalaryEntry', {
                        driverId: d.driverId,
                        mode: 'full',
                      })
                    }
                  />
                </View>
              </Card>
            );
          })
        ) : (
          <>
            <View style={styles.filterRow}>
              <View style={styles.driverPickerWrap}>
                <Picker
                  selectedValue={driverFilter}
                  onValueChange={setDriverFilter}
                  style={
                    Platform.OS === 'ios'
                      ? undefined
                      : {color: colors.text, height: 40}
                  }>
                  <Picker.Item label="All Drivers" value="All Drivers" />
                  {drivers.map(d => (
                    <Picker.Item
                      key={d.driverId}
                      label={d.name}
                      value={d.name}
                    />
                  ))}
                </Picker>
              </View>
            </View>
            <TabPills
              tabs={STATUS_FILTERS}
              active={statusFilter}
              onChange={setStatusFilter}
            />
            <Text
              style={[styles.mutedSmall, {marginTop: 12, marginBottom: 10}]}>
              {filteredEntries.length}{' '}
              {filteredEntries.length === 1 ? 'entry' : 'entries'}
            </Text>
            {filteredEntries.length === 0 ? (
              <Card style={{alignItems: 'center', padding: 30}}>
                <Text style={{color: colors.muted}}>
                  No entries match this filter.
                </Text>
              </Card>
            ) : (
              filteredEntries.map((e, idx) => {
                const d = drivers.find(x => x.driverId === e.driverId);
                if (!d) {
                  return null;
                }
                const total = entryTotal(e);
                const pending = entryPending(e);
                return (
                  <Card key={idx} style={{marginBottom: 12}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                      }}>
                      <Avatar name={d.name} size={44} />
                      <View style={{flex: 1}}>
                        <Text style={{fontWeight: '800'}}>{d.name}</Text>
                        <Text style={styles.mutedSmall}>
                          {e.from} → {e.to}
                        </Text>
                      </View>
                      <Pill
                        label={e.status}
                        variant={statusVariant(e.status)}
                      />
                    </View>
                    <View style={styles.daysCard}>
                      <View style={styles.daysIcon}>
                        <Icon name="calendar" size={17} color={colors.blue} />
                      </View>
                      <View style={{flex: 1}}>
                        <Text style={{fontWeight: '800', fontSize: 14}}>
                          {e.days} days
                        </Text>
                        <Text style={styles.mutedSmall}>{fmt(e.rate)}/day</Text>
                      </View>
                      <View style={{alignItems: 'flex-end'}}>
                        <Text style={[styles.mutedSmall, {fontSize: 10.5}]}>
                          Total Amount
                        </Text>
                        <Text style={{fontWeight: '800', fontSize: 15.5}}>
                          {fmt(total)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.fourCol}>
                      <FourColItem
                        label="TOTAL"
                        value={fmt(total)}
                        sub={`${e.days}d × ${fmt(e.rate)}`}
                      />
                      <FourColItem
                        label="ADVANCE"
                        value={fmt(e.advance)}
                        color={colors.blue}
                        sub="Deducted"
                      />
                      <FourColItem
                        label="PAID"
                        value={fmt(e.paid)}
                        color={colors.green}
                        sub={e.paidMode}
                      />
                      <FourColItem
                        label="PENDING"
                        value={pending > 0 ? fmt(pending) : 'Nil'}
                        color={pending > 0 ? colors.amber : colors.muted2}
                        sub={pending > 0 ? e.status : 'Paid'}
                      />
                    </View>
                    {e.note ? (
                      <Text style={styles.noteText}>"{e.note}"</Text>
                    ) : null}
                  </Card>
                );
              })
            )}
          </>
        )}
        <View style={{height: 20}} />
      </ScrollView>
    </View>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statBoxValue, {color}]}>{value}</Text>
      <Text style={styles.statBoxLabel}>{label}</Text>
    </View>
  );
}

function FourColItem({
  label,
  value,
  color,
  sub,
}: {
  label: string;
  value: string;
  color?: string;
  sub?: string;
}) {
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Text style={styles.fourColLabel}>{label}</Text>
      <Text style={[styles.fourColValue, color ? {color} : undefined]}>
        {value}
      </Text>
      {sub ? <Text style={styles.fourColSub}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {flexDirection: 'row', gap: 8, marginTop: 14},
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  statBoxValue: {fontWeight: '800'},
  statBoxLabel: {fontSize: 10, color: '#dbe4ff'},

  segmentWrap: {
    paddingHorizontal: 20,
    paddingTop: 14,
    backgroundColor: colors.bg,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: '#eef0f7',
    borderRadius: 14,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
  },
  segmentBtnActive: {backgroundColor: '#fff'},
  segmentText: {fontWeight: '700', fontSize: 13.5, color: colors.muted},
  segmentTextActive: {color: colors.blue},

  mutedSmall: {fontSize: 11, color: colors.muted},
  fourCol: {flexDirection: 'row', marginTop: 12},
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#eef0f7',
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {height: '100%'},

  filterRow: {marginBottom: 10},
  driverPickerWrap: {
    backgroundColor: '#fff',
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.line,
    overflow: 'hidden',
  },

  daysCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f1f3fa',
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
  },
  daysIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e2e9ff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  fourColLabel: {
    fontSize: 9.5,
    color: colors.muted2,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  fourColValue: {fontWeight: '800', fontSize: 13.5, marginTop: 2},
  fourColSub: {fontSize: 9.5, color: colors.muted2, marginTop: 1},
  noteText: {
    fontStyle: 'italic',
    color: colors.muted,
    fontSize: 12,
    marginTop: 10,
  },
});
