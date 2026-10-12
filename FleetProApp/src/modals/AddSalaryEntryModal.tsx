import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/types';
import {colors, radii} from '@/theme/colors';
import {fmt} from '@/utils/format';
import {useApp} from '@/context/AppContext';
import Avatar from '@/components/Avatar';
import Pill, {statusVariant} from '@/components/Pill';
import Button from '@/components/Button';
import FormField from '@/components/FormField';

type Props = NativeStackScreenProps<RootStackParamList, 'AddSalaryEntry'>;

export default function AddSalaryEntryModal({route, navigation}: Props) {
  const {drivers, addSalaryEntry, payQuickAmount} = useApp();
  const isQuickPay = route.params.mode === 'quickPay';

  const defaultDriverId =
    route.params.driverId ??
    drivers.find(d => d.status === 'Active')?.driverId ??
    drivers[0]?.driverId ??
    '';
  const [driverId, setDriverId] = useState(defaultDriverId);
  const [dailyRate, setDailyRate] = useState('800');
  const [days, setDays] = useState('1');
  const [mode, setMode] = useState('Cash');
  const [payAmount, setPayAmount] = useState('');

  const driver = drivers.find(d => d.driverId === driverId);

  useMemo(() => {
    if (isQuickPay && driver) {
      setPayAmount(String(driver.pending));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => navigation.goBack();

  if (!driver) {
    return (
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isQuickPay ? 'Pay Salary' : 'Add Salary Entry'}
            </Text>
            <TouchableOpacity style={styles.closeBtn} onPress={close}>
              <Icon name="x" size={17} color={colors.muted} />
            </TouchableOpacity>
          </View>
          <View style={styles.hairline} />
          <Text style={styles.emptyText}>
            No drivers found. Add a driver first before creating a salary entry.
          </Text>
        </View>
      </View>
    );
  }

  const total = (parseInt(dailyRate, 10) || 0) * (parseInt(days, 10) || 0);
  const advance = driver.advanceTotal;
  const pending = Math.max(total - advance, 0);

  const saveFull = () => {
    addSalaryEntry({
      driverId,
      dailyRate: parseInt(dailyRate, 10) || 0,
      days: Math.max(parseInt(days, 10) || 1, 1),
      mode,
      notes: '',
    });
    close();
  };

  const saveQuickPay = () => {
    const amount = parseInt(payAmount, 10) || 0;
    payQuickAmount(driver.driverId, amount, mode);
    close();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              {isQuickPay ? 'Pay Salary' : 'Add Salary Entry'}
            </Text>
            <Text style={styles.subtitle}>
              {isQuickPay
                ? `For ${driver.name}`
                : 'Day-wise salary calculation'}
            </Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={close}>
            <Icon name="x" size={17} color={colors.muted} />
          </TouchableOpacity>
        </View>
        <View style={styles.hairline} />

        <ScrollView contentContainerStyle={{paddingBottom: 20}}>
          {!isQuickPay && (
            <>
              <Text style={styles.fieldLabel}>SELECT DRIVER *</Text>
              <View style={styles.pickerWrap}>
                <Picker selectedValue={driverId} onValueChange={setDriverId}>
                  {drivers.map(d => (
                    <Picker.Item
                      key={d.driverId}
                      label={`${d.name} · ${d.driverId}`}
                      value={d.driverId}
                    />
                  ))}
                </Picker>
              </View>
            </>
          )}

          <View style={styles.driverPreview}>
            <Avatar name={driver.name} size={44} />
            <View style={{flex: 1}}>
              <Text style={styles.driverName}>{driver.name}</Text>
              <Text style={styles.driverSub}>
                {isQuickPay
                  ? `${driver.driverId} · ${
                      driver.vehiclePlate || 'No vehicle assigned'
                    }`
                  : driver.vehiclePlate || 'No vehicle assigned'}
              </Text>
            </View>
            <Pill
              label={driver.status}
              variant={statusVariant(driver.status)}
            />
          </View>

          {isQuickPay ? (
            <>
              <View style={styles.threeStat}>
                <StatBox
                  label="Total Salary"
                  value={fmt(driver.salary)}
                  bg="#eef2ff"
                  color={colors.blue}
                />
                <StatBox
                  label="Already Paid"
                  value={fmt(driver.paid)}
                  bg="#f0fdf4"
                  color={colors.green}
                />
                <StatBox
                  label="Pending"
                  value={fmt(driver.pending)}
                  bg="#fffbeb"
                  color={colors.amber}
                />
              </View>

              <View style={[styles.section, {backgroundColor: '#f0fdf4'}]}>
                <SectionHeader color={colors.green} title="Payment" />
                <Text style={styles.fieldLabel}>AMOUNT TO PAY NOW (₹) *</Text>
                <TextInput
                  style={styles.amountInput}
                  keyboardType="numeric"
                  value={payAmount}
                  onChangeText={setPayAmount}
                />
                <Text style={styles.helperText}>
                  Up to {fmt(driver.pending)} pending for this driver
                </Text>
                <Text style={styles.fieldLabel}>PAYMENT MODE</Text>
                <ModeRow mode={mode} setMode={setMode} />
              </View>
              <Button
                label="Confirm Payment"
                style={{marginTop: 18}}
                onPress={saveQuickPay}
              />
            </>
          ) : (
            <>
              <View style={[styles.section, {backgroundColor: '#eef2ff'}]}>
                <SectionHeader
                  color={colors.blue}
                  title="Salary Period & Daily Rate"
                />
                <FormField
                  label="DAILY AMOUNT (₹ PER DAY) *"
                  keyboardType="numeric"
                  value={dailyRate}
                  onChangeText={setDailyRate}
                />
                <FormField
                  label="NUMBER OF DAYS *"
                  keyboardType="numeric"
                  value={days}
                  onChangeText={setDays}
                />
                <View style={styles.totalRow}>
                  <View style={styles.totalIcon}>
                    <Text
                      style={{color: '#fff', fontWeight: '800', fontSize: 18}}>
                      ₹
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.helperText}>Total Salary</Text>
                    <Text style={styles.totalValue}>{fmt(total)}</Text>
                  </View>
                  <View style={styles.daysBadge}>
                    <Text style={styles.daysBadgeText}>{days}d</Text>
                  </View>
                </View>
              </View>

              <View style={[styles.section, {backgroundColor: '#f0fdf4'}]}>
                <SectionHeader color={colors.green} title="Payment Details" />
                <Text style={styles.fieldLabel}>
                  ADVANCE (₹) — from driver's profile
                </Text>
                <View style={styles.advanceBox}>
                  <Icon name="briefcase" size={15} color={colors.blue} />
                  <Text style={styles.advanceValue}>{fmt(advance)}</Text>
                  <Pill label="Locked" variant="gray" />
                </View>
                <View style={styles.pendingBox}>
                  <View style={{flex: 1}}>
                    <Text style={styles.pendingLabel}>PENDING AMOUNT</Text>
                    <Text style={styles.pendingValue}>{fmt(pending)}</Text>
                  </View>
                  <Icon name="clock" size={18} color={colors.amber} />
                </View>
                <Text style={[styles.fieldLabel, {marginTop: 14}]}>
                  PAYMENT MODE
                </Text>
                <ModeRow mode={mode} setMode={setMode} />
              </View>
              <Button
                label="Save Entry"
                style={{marginTop: 18}}
                onPress={saveFull}
              />
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

function SectionHeader({color, title}: {color: string; title: string}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionIcon, {backgroundColor: color}]}>
        <Text style={{color: '#fff', fontWeight: '800', fontSize: 13}}>₹</Text>
      </View>
      <Text style={{fontWeight: '800', fontSize: 13.5}}>{title}</Text>
    </View>
  );
}

function ModeRow({
  mode,
  setMode,
}: {
  mode: string;
  setMode: (m: string) => void;
}) {
  return (
    <View style={{flexDirection: 'row', gap: 8}}>
      {['Cash', 'Bank', 'UPI'].map(m => (
        <Button
          key={m}
          label={m}
          variant={mode === m ? 'green' : 'outline'}
          style={{flex: 1}}
          onPress={() => setMode(m)}
        />
      ))}
    </View>
  );
}

function StatBox({
  label,
  value,
  bg,
  color,
}: {
  label: string;
  value: string;
  bg: string;
  color: string;
}) {
  return (
    <View style={[styles.statBoxSmall, {backgroundColor: bg}]}>
      <Text style={[styles.statBoxValue, {color}]}>{value}</Text>
      <Text style={styles.statBoxLabel}>{label}</Text>
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
    alignItems: 'flex-start',
  },
  title: {fontWeight: '800', fontSize: 17},
  subtitle: {color: colors.muted, fontSize: 11.5, marginTop: 2},
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f1f3fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hairline: {height: 1, backgroundColor: colors.line, marginVertical: 16},
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
    marginBottom: 8,
  },
  pickerWrap: {
    backgroundColor: '#f1f3fa',
    borderRadius: radii.md,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: colors.blueLight,
  },
  driverPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#eef2ff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 18,
  },
  driverName: {fontWeight: '800', color: colors.blue},
  driverSub: {color: colors.muted, fontSize: 12},
  threeStat: {flexDirection: 'row', gap: 10, marginBottom: 18},
  statBoxSmall: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statBoxValue: {fontWeight: '800', fontSize: 15},
  statBoxLabel: {
    fontSize: 10,
    color: colors.muted,
    fontWeight: '700',
    marginTop: 2,
  },
  section: {borderRadius: 18, padding: 16, marginBottom: 14},
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
  amountInput: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontWeight: '800',
    fontSize: 15,
    marginBottom: 6,
    color: colors.text,
  },
  helperText: {color: colors.muted, fontSize: 11, marginBottom: 14},
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
  },
  totalIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalValue: {fontWeight: '800', fontSize: 19},
  daysBadge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  daysBadgeText: {fontWeight: '700', color: colors.muted, fontSize: 11},
  advanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#c7ceE3',
    borderStyle: 'dashed',
    padding: 13,
    marginBottom: 14,
  },
  advanceValue: {flex: 1, fontWeight: '800', fontSize: 15.5},
  pendingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.amberBg,
    borderRadius: 14,
    padding: 14,
  },
  pendingLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92651a',
    letterSpacing: 0.5,
  },
  pendingValue: {
    fontWeight: '800',
    fontSize: 21,
    color: colors.amber,
    marginTop: 2,
  },
});
