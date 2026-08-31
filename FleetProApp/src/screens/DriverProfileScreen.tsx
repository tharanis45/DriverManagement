import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
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
import TabPills from '@/components/TabPills';
import Button from '@/components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'DriverProfile'>;

const TABS = ['Info', 'Salary', 'Advance', 'Pay', 'Docs'];

export default function DriverProfileScreen({route, navigation}: Props) {
  const {getDriver} = useApp();
  const driver = getDriver(route.params.driverId);
  const [tab, setTab] = useState('Info');

  if (!driver) {
    return null;
  }
  const d = driver;

  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <ScreenHeader onBack={() => navigation.goBack()}>
        <View style={styles.profileRow}>
          <Avatar name={d.name} size={64} radius={20} />
          <View>
            <Text style={styles.name}>{d.name}</Text>
            <Text style={styles.driverId}>{d.driverId}</Text>
            <View style={styles.badgeRow}>
              <Pill label={d.status} variant={statusVariant(d.status)} dot />
              <Text style={styles.rating}>
                {'★'.repeat(Math.round(d.rating))}
                {'☆'.repeat(5 - Math.round(d.rating))} {d.rating}
              </Text>
            </View>
          </View>
        </View>
      </ScreenHeader>

      <View style={styles.fixedBody}>
        <View style={styles.statsGrid}>
          <View style={[styles.statChip, {backgroundColor: '#eef2ff'}]}>
            <Text style={[styles.statValue, {color: colors.blue}]}>
              {fmtK(d.salary)}
            </Text>
            <Text style={styles.statLabel}>Salary</Text>
          </View>
          <View style={[styles.statChip, {backgroundColor: '#f0fdf4'}]}>
            <Text style={[styles.statValue, {color: colors.green}]}>
              {fmtK(d.paid)}
            </Text>
            <Text style={styles.statLabel}>Paid</Text>
          </View>
          <View style={[styles.statChip, {backgroundColor: '#fffbeb'}]}>
            <Text style={[styles.statValue, {color: colors.amber}]}>
              {fmtK(d.pending)}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {d.vehiclePlate ? (
          <Card style={styles.vehicleCard}>
            <View style={styles.vehicleIconBox}>
              <Icon name="truck" size={22} color="#fff" />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.vehicleLabel}>ASSIGNED VEHICLE</Text>
              <Text style={styles.vehicleModel} numberOfLines={1}>
                {d.vehicleModel}
              </Text>
              <View style={styles.plateBadge}>
                <Text style={styles.plateText}>{d.vehiclePlate}</Text>
              </View>
            </View>
          </Card>
        ) : (
          <Card style={[styles.vehicleCard, styles.vehicleCardEmpty]}>
            <View style={[styles.vehicleIconBox, {backgroundColor: '#eef0f7'}]}>
              <Icon name="truck" size={22} color={colors.muted} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.vehicleLabel}>NO VEHICLE ASSIGNED</Text>
              <Text style={styles.noVehicleText}>Not assigned yet</Text>
            </View>
          </Card>
        )}

        <View style={{marginTop: 16}}>
          <TabPills tabs={TABS} active={tab} onChange={setTab} />
        </View>
      </View>

      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{
          padding: 20,
          paddingTop: 14,
          paddingBottom: 100,
        }}>
        {tab === 'Info' && (
          <Card noPadding style={{padding: 4}}>
            {(
              [
                ['DATE OF BIRTH', d.dob],
                ['BLOOD GROUP', d.bloodGroup],
                ['ADDRESS', d.address],
                ['AADHAAR', d.aadhaar],
                ['LICENSE', d.license],
                ['LICENSE EXPIRY', d.licenseExpiry],
                ['JOINING DATE', d.joiningDate],
                ['EMERGENCY', d.emergency],
              ] as const
            ).map(([label, value], i, arr) => (
              <View
                key={label}
                style={[
                  styles.infoRow,
                  i < arr.length - 1 && styles.borderBottom,
                ]}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
              </View>
            ))}
          </Card>
        )}

        {tab === 'Salary' &&
          (d.salaryHistory.length ? (
            d.salaryHistory.map((s, i) => (
              <Card key={i} style={{marginBottom: 10}}>
                <View style={styles.rowBetween}>
                  <Text style={styles.monthText}>{s.month}</Text>
                  <Pill label={s.status} variant={statusVariant(s.status)} />
                </View>
                <View style={styles.threeCol}>
                  <View style={styles.threeColItem}>
                    <Text style={styles.smallLabel}>Salary</Text>
                    <Text style={styles.threeColValue}>{fmt(s.salary)}</Text>
                  </View>
                  <View style={styles.threeColItem}>
                    <Text style={styles.smallLabel}>Paid</Text>
                    <Text style={[styles.threeColValue, {color: colors.green}]}>
                      {fmt(s.paid)}
                    </Text>
                  </View>
                  <View style={styles.threeColItem}>
                    <Text style={styles.smallLabel}>Pending</Text>
                    <Text
                      style={[
                        styles.threeColValue,
                        {color: s.pending > 0 ? colors.amber : colors.muted2},
                      ]}>
                      {fmt(s.pending)}
                    </Text>
                  </View>
                </View>
              </Card>
            ))
          ) : (
            <EmptyState text="No salary history yet." />
          ))}

        {tab === 'Advance' &&
          (d.advances.length ? (
            d.advances.map((a, i) => (
              <Card key={i} style={{marginBottom: 10}}>
                <View style={styles.rowBetween}>
                  <Text style={styles.amountText}>{fmt(a.amount)}</Text>
                  <Pill label={a.status} variant={statusVariant(a.status)} />
                </View>
                <Text style={styles.reasonText}>{a.reason}</Text>
                <Text style={styles.dateText}>{a.date}</Text>
              </Card>
            ))
          ) : (
            <EmptyState text="No advances recorded." />
          ))}

        {tab === 'Pay' &&
          (d.payments.length ? (
            d.payments.map((p, i) => (
              <Card
                key={i}
                style={{
                  marginBottom: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}>
                <View style={styles.payIcon}>
                  <Icon name="credit-card" size={18} color={colors.green} />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.payAmount}>{fmt(p.amount)}</Text>
                  <Text style={styles.paySub}>
                    {p.mode} · {p.date}
                  </Text>
                  <Text style={styles.payRef}>{p.ref}</Text>
                </View>
                <Icon name="check-circle" size={22} color={colors.green} />
              </Card>
            ))
          ) : (
            <EmptyState text="No payments yet." />
          ))}

        {tab === 'Docs' &&
          (d.docs.length ? (
            d.docs.map((doc, i) => (
              <Card
                key={i}
                style={{
                  marginBottom: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}>
                <View style={styles.docIcon}>
                  <Icon name="file-text" size={18} color={colors.blue} />
                </View>
                <Text style={{flex: 1, fontWeight: '700'}}>{doc}</Text>
                <TouchableOpacity style={styles.downloadBtn}>
                  <Icon name="download" size={16} color={colors.text} />
                </TouchableOpacity>
              </Card>
            ))
          ) : (
            <EmptyState text="No documents uploaded." />
          ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Edit"
          icon={<Icon name="edit-2" size={16} color="#fff" />}
          style={{flex: 1}}
          onPress={() =>
            navigation.navigate('EditDriver', {driverId: d.driverId})
          }
        />
        <Button
          label="Pay Salary"
          variant="green"
          icon={<Icon name="dollar-sign" size={16} color="#fff" />}
          style={{flex: 1}}
          onPress={() =>
            navigation.navigate('AddSalaryEntry', {
              driverId: d.driverId,
              mode: 'quickPay',
            })
          }
        />
        <TouchableOpacity style={styles.downloadFooterBtn}>
          <Icon name="download" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function EmptyState({text}: {text: string}) {
  return (
    <Card style={{alignItems: 'center', paddingVertical: 30}}>
      <Text style={{color: colors.muted}}>{text}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 12,
  },
  name: {fontSize: 17.5, fontWeight: '800', color: '#fff'},
  driverId: {color: '#c9d7ff', fontSize: 11.5, fontWeight: '600'},
  badgeRow: {flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 5},
  rating: {fontSize: 11.5, color: '#ffd166'},

  fixedBody: {
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  statsGrid: {flexDirection: 'row', gap: 8},
  statChip: {
    flex: 1,
    borderRadius: radii.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statValue: {fontWeight: '800', fontSize: 14.5},
  statLabel: {
    fontSize: 10,
    color: colors.muted,
    fontWeight: '700',
    marginTop: 2,
  },

  vehicleCard: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vehicleCardEmpty: {},
  vehicleIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  vehicleModel: {
    fontWeight: '800',
    color: colors.navy,
    fontSize: 14.5,
    marginTop: 2,
  },
  plateBadge: {
    backgroundColor: '#eef2ff',
    alignSelf: 'flex-start',
    borderRadius: 7,
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginTop: 6,
  },
  plateText: {color: colors.blue, fontWeight: '800', fontSize: 11},
  noVehicleText: {
    fontWeight: '700',
    color: colors.navy,
    fontSize: 13.5,
    marginTop: 2,
  },

  infoRow: {padding: 12},
  borderBottom: {borderBottomWidth: 1, borderBottomColor: colors.line},
  infoLabel: {
    fontSize: 10,
    color: colors.muted2,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  infoValue: {fontWeight: '700', fontSize: 13.5, marginTop: 3},

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthText: {fontWeight: '800', fontSize: 14},
  threeCol: {flexDirection: 'row', marginTop: 12},
  threeColItem: {flex: 1, alignItems: 'center'},
  smallLabel: {fontSize: 10.5, color: colors.muted},
  threeColValue: {fontWeight: '800', marginTop: 2},

  amountText: {fontWeight: '800', fontSize: 17},
  reasonText: {fontWeight: '600', color: colors.text, marginTop: 4},
  dateText: {color: colors.muted, fontSize: 11.5, marginTop: 2},

  payIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payAmount: {fontWeight: '800', fontSize: 15.5},
  paySub: {color: colors.muted, fontSize: 11.5},
  payRef: {color: colors.muted2, fontSize: 10.5},

  docIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#e7edff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f3fa',
    alignItems: 'center',
    justifyContent: 'center',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: {width: 0, height: -4},
    shadowRadius: 10,
  },
  downloadFooterBtn: {
    width: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
