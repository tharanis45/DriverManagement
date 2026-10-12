import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {RootStackParamList} from '@/navigation/types';
import {MainTabParamList} from '@/navigation/types';
import {colors, radii} from '@/theme/colors';
import {fmt, fmtK} from '@/utils/format';
import {useApp} from '@/context/AppContext';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import DonutChart from '@/components/DonutChart';
import LineChart from '@/components/LineChart';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const QUICK_ACTIONS = [
  {icon: 'user-plus', color: '#2563eb', label: 'Add Driver'},
  {icon: 'plus', color: '#16a34a', label: 'Add Entry'},
  {icon: 'briefcase', color: '#7c3aed', label: 'Advance'},
  {icon: 'truck', color: '#0891b2', label: 'Vehicle'},
  {icon: 'bar-chart-2', color: '#d97706', label: 'Reports'},
  {icon: 'download', color: '#dc2626', label: 'Export'},
  {icon: 'dollar-sign', color: '#16a34a', label: 'Salary Pay'},
  {icon: 'file-text', color: '#475569', label: 'All Docs'},
];

export default function HomeScreen({navigation}: Props) {
  const {drivers, vehicles, totals, activities} = useApp();
  const [analyticsView, setAnalyticsView] = useState<'trend' | 'status'>(
    'trend',
  );

  const attention = useMemo(() => {
    const due = drivers
      .filter(d => d.pending > 0)
      .sort((a, b) => b.pending - a.pending)
      .map(d => ({
        key: 'due-' + d.driverId,
        severity: d.pending >= 8000 ? 'red' : 'amber',
        title: `${d.name} — salary due`,
        sub: `${fmt(d.pending)} pending`,
        icon: 'credit-card',
        onPress: () =>
          navigation.navigate('DriverProfile', {driverId: d.driverId}),
      }));
    const alerts = vehicles
      .filter(v => v.ins !== 'ok' || v.rc !== 'ok')
      .map(v => ({
        key: 'veh-' + v.plate,
        severity: v.rc !== 'ok' ? 'red' : 'amber',
        title: `${v.plate} — document alert`,
        sub: v.rc !== 'ok' ? 'RC needs renewal' : 'Insurance expiring soon',
        icon: 'alert-circle',
        onPress: () => navigation.navigate('Vehicles' as never),
      }));
    return [...due, ...alerts]
      .sort(
        (a, b) =>
          (a.severity === 'red' ? 0 : 1) - (b.severity === 'red' ? 0 : 1),
      )
      .slice(0, 4);
  }, [drivers, vehicles, navigation]);

  const paidPct = totals.payroll
    ? Math.round((totals.paid / totals.payroll) * 100)
    : 0;
  const pendingPct = totals.payroll
    ? Math.round((totals.pending / totals.payroll) * 100)
    : 0;
  const advancePct = Math.max(0, 100 - paidPct - pendingPct);

  const handleQuickAction = (label: string) => {
    switch (label) {
      case 'Add Driver':
        navigation.navigate('AddDriver');
        break;
      case 'Add Entry':
        navigation.navigate('AddSalaryEntry', {mode: 'full'});
        break;
      case 'Advance':
        navigation.navigate('AddAdvance', {});
        break;
      case 'Vehicle':
        navigation.navigate('AddVehicleModal');
        break;
      case 'Reports':
        navigation.navigate('Reports' as never);
        break;
      case 'Salary Pay':
        navigation.navigate('SalaryManagement');
        break;
      case 'All Docs':
        navigation.navigate('Reports' as never);
        break;
      default:
        break;
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <ScreenHeader
        eyebrow="GOOD MORNING"
        title="Jayam Cars Admin"
        right={
          <TouchableOpacity
            onPress={() => navigation.navigate('LogoutConfirm')}>
            <Avatar name="Rahul Mehta" size={40} />
          </TouchableOpacity>
        }>
        <View style={styles.dateRow}>
          <View style={styles.dateChip}>
            <Icon name="calendar" size={13} color="#c9d7ff" />
            <Text style={styles.dateText}>Saturday, 4 July 2026</Text>
          </View>
          <View style={styles.quarterChip}>
            <Text style={styles.quarterText}>Q2 · FY 2025–26</Text>
          </View>
        </View>
      </ScreenHeader>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* PAYROLL CARD */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Reports' as never)}>
          <Card style={styles.payrollCard}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.payrollLabel}>
                  MONTHLY PAYROLL · JUN 2025
                </Text>
                <Text style={styles.payrollValue}>{fmtK(totals.payroll)}</Text>
                <Text style={styles.payrollTrend}>↗ +3% vs last month</Text>
              </View>
              <View style={styles.rupeeBox}>
                <Text style={styles.rupeeText}>₹</Text>
              </View>
            </View>
            <View style={styles.hairlineLight} />
            <View style={styles.payrollStatsRow}>
              {[
                ['Drivers', totals.totalDrivers],
                ['Active', totals.activeDrivers],
                ['Vehicles', totals.totalVehicles],
              ].map(([label, val], i) => (
                <View
                  key={label as string}
                  style={[
                    styles.payrollStat,
                    i > 0 && styles.payrollStatBorder,
                  ]}>
                  <Text style={styles.payrollStatValue}>{val}</Text>
                  <Text style={styles.payrollStatLabel}>{label}</Text>
                </View>
              ))}
            </View>
          </Card>
        </TouchableOpacity>

        {/* QUICK ACTIONS */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map(qa => (
            <TouchableOpacity
              key={qa.label}
              style={styles.quickItem}
              onPress={() => handleQuickAction(qa.label)}>
              <View style={[styles.quickIconBox, {backgroundColor: qa.color}]}>
                <Icon name={qa.icon} size={18} color="#fff" />
              </View>
              <Text style={styles.quickLabel} numberOfLines={1}>
                {qa.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* NEEDS ATTENTION */}
        {attention.length > 0 && (
          <>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>Needs Your Attention</Text>
              <View style={styles.countPill}>
                <Text style={styles.countPillText}>{attention.length}</Text>
              </View>
            </View>
            <Card
              noPadding
              style={{
                marginTop: 10,
                paddingVertical: 4,
                paddingHorizontal: 14,
              }}>
              {attention.map((a, i) => (
                <TouchableOpacity
                  key={a.key}
                  onPress={a.onPress}
                  style={[
                    styles.attentionRow,
                    i < attention.length - 1 && styles.borderBottom,
                    {
                      borderLeftColor:
                        a.severity === 'red' ? colors.red : colors.amber,
                    },
                  ]}>
                  <View
                    style={[
                      styles.attentionIcon,
                      {
                        backgroundColor:
                          a.severity === 'red' ? colors.redBg : colors.amberBg,
                      },
                    ]}>
                    <Icon
                      name={a.icon}
                      size={15}
                      color={a.severity === 'red' ? colors.red : colors.amber}
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.attentionTitle}>{a.title}</Text>
                    <Text style={styles.attentionSub}>{a.sub}</Text>
                  </View>
                  <Icon name="chevron-right" size={15} color={colors.muted2} />
                </TouchableOpacity>
              ))}
            </Card>
          </>
        )}

        {/* DRIVER SNAPSHOT */}
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Driver Snapshot</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Drivers' as never)}
            style={styles.viewAllRow}>
            <Text style={styles.viewAllText}>View All</Text>
            <Icon name="chevron-right" size={14} color={colors.blue} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{gap: 14, marginTop: 12}}>
          {drivers.map(d => {
            const pct = d.salary ? Math.round((d.paid / d.salary) * 100) : 100;
            const ringColor =
              pct >= 100
                ? colors.green
                : pct >= 50
                ? colors.blue
                : colors.amber;
            return (
              <TouchableOpacity
                key={d.driverId}
                style={{width: 96, alignItems: 'center'}}
                onPress={() =>
                  navigation.navigate('DriverProfile', {driverId: d.driverId})
                }>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <DonutChart
                    segments={[
                      {value: pct, color: ringColor},
                      {value: 100 - pct, color: '#e5e7f0'},
                    ]}
                    size={64}
                    strokeWidth={5}
                  />
                  <View style={{position: 'absolute'}}>
                    <Avatar name={d.name} size={52} />
                  </View>
                </View>
                <Text style={styles.snapshotName} numberOfLines={1}>
                  {d.name.split(' ')[0]}
                </Text>
                <Text style={styles.snapshotSub}>
                  {d.pending > 0 ? `${fmtK(d.pending)} due` : 'Settled'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* PAYROLL HEALTH */}
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Payroll Health</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Reports' as never)}
            style={styles.viewAllRow}>
            <Text style={styles.viewAllText}>Details</Text>
            <Icon name="chevron-right" size={14} color={colors.blue} />
          </TouchableOpacity>
        </View>
        <Card style={{marginTop: 10}}>
          <View style={styles.healthBar}>
            <View
              style={{width: `${paidPct}%`, backgroundColor: colors.green}}
            />
            <View
              style={{width: `${pendingPct}%`, backgroundColor: colors.amber}}
            />
            <View
              style={{width: `${advancePct}%`, backgroundColor: colors.purple}}
            />
          </View>
          <View style={styles.healthLegendRow}>
            {[
              ['PAID', totals.paid, colors.green],
              ['PENDING', totals.pending, colors.amber],
              ['ADVANCE', totals.advance, colors.purple],
            ].map(([label, val, c]) => (
              <View key={label as string} style={{flex: 1}}>
                <View style={styles.legendDotRow}>
                  <View
                    style={[styles.legendDot, {backgroundColor: c as string}]}
                  />
                  <Text style={styles.legendLabel}>{label}</Text>
                </View>
                <Text style={styles.legendValue}>{fmt(val as number)}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* ANALYTICS */}
        <Text style={styles.sectionTitle}>Analytics</Text>
        <Card style={{marginTop: 10}}>
          <View style={styles.segment}>
            <TouchableOpacity
              style={[
                styles.segmentBtn,
                analyticsView === 'trend' && styles.segmentBtnActive,
              ]}
              onPress={() => setAnalyticsView('trend')}>
              <Text
                style={[
                  styles.segmentText,
                  analyticsView === 'trend' && styles.segmentTextActive,
                ]}>
                Salary Trend
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.segmentBtn,
                analyticsView === 'status' && styles.segmentBtnActive,
              ]}
              onPress={() => setAnalyticsView('status')}>
              <Text
                style={[
                  styles.segmentText,
                  analyticsView === 'status' && styles.segmentTextActive,
                ]}>
                Driver Status
              </Text>
            </TouchableOpacity>
          </View>
          {analyticsView === 'trend' ? (
            <>
              <Text style={styles.chartCaption}>Monthly Salary (₹k)</Text>
              <LineChart
                points={[78, 86, 72, 80, 92, 84]}
                color={colors.blue}
              />
            </>
          ) : (
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
              <View
                style={{
                  width: 104,
                  height: 104,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <DonutChart
                  segments={[
                    {value: totals.activeDrivers, color: colors.green},
                    {
                      value: totals.totalDrivers - totals.activeDrivers,
                      color: '#e5e7f0',
                    },
                  ]}
                  size={104}
                  strokeWidth={13}
                />
                <View style={{position: 'absolute', alignItems: 'center'}}>
                  <Text style={styles.donutCenterValue}>
                    {totals.activeDrivers}
                  </Text>
                  <Text style={styles.donutCenterLabel}>active</Text>
                </View>
              </View>
              <View style={{flex: 1}}>
                <View style={[styles.rowBetween, styles.borderBottomLine]}>
                  <Text style={styles.legendRowText}>● Active</Text>
                  <Text style={styles.legendRowValue}>
                    {totals.activeDrivers}
                  </Text>
                </View>
                <View style={[styles.rowBetween, {paddingVertical: 6}]}>
                  <Text style={styles.legendRowText}>● Inactive</Text>
                  <Text style={styles.legendRowValue}>
                    {totals.totalDrivers - totals.activeDrivers}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Card>

        {/* RECENT ACTIVITY */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Card style={{marginTop: 10}}>
          {activities.slice(0, 5).map((a, i, arr) => (
            <View key={i} style={{flexDirection: 'row', gap: 12}}>
              <View style={{alignItems: 'center'}}>
                <View style={[styles.activityIcon, {backgroundColor: a.bg}]}>
                  <Icon name={a.icon} size={14} color={a.fg} />
                </View>
                {i < arr.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View
                style={{flex: 1, paddingBottom: i < arr.length - 1 ? 16 : 0}}>
                <View style={styles.rowBetween}>
                  <Text style={styles.activityTitle}>{a.title}</Text>
                  <Text style={styles.activityTime}>{a.time}</Text>
                </View>
                <Text style={styles.activitySub}>{a.sub}</Text>
              </View>
            </View>
          ))}
        </Card>
        <View style={{height: 20}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {padding: 20},
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  dateChip: {flexDirection: 'row', alignItems: 'center', gap: 6},
  dateText: {color: '#c9d7ff', fontSize: 11, fontWeight: '600'},
  quarterChip: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
  },
  quarterText: {color: '#fff', fontSize: 10.5, fontWeight: '700'},

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  payrollCard: {backgroundColor: colors.navy, padding: 20},
  payrollLabel: {
    fontSize: 10,
    letterSpacing: 1,
    color: '#bcd0ff',
    fontWeight: '700',
  },
  payrollValue: {fontSize: 28, fontWeight: '800', color: '#fff', marginTop: 4},
  payrollTrend: {
    fontSize: 11.5,
    color: '#a7f3c9',
    fontWeight: '700',
    marginTop: 4,
  },
  rupeeBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rupeeText: {color: '#fff', fontSize: 18, fontWeight: '800'},
  hairlineLight: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 16,
  },
  payrollStatsRow: {flexDirection: 'row'},
  payrollStat: {flex: 1, alignItems: 'center'},
  payrollStatBorder: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.15)',
  },
  payrollStatValue: {fontSize: 17, fontWeight: '800', color: '#fff'},
  payrollStatLabel: {
    fontSize: 10,
    color: '#bcd0ff',
    fontWeight: '700',
    marginTop: 1,
  },

  sectionTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: colors.text,
    marginTop: 22,
  },

  quickGrid: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 10},
  quickItem: {
    width: '22.5%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: radii.lg,
    paddingVertical: 12,
  },
  quickIconBox: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  quickLabel: {fontSize: 10, fontWeight: '700', color: colors.text},

  countPill: {
    backgroundColor: colors.redBg,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  countPillText: {color: colors.red, fontWeight: '800', fontSize: 12},
  attentionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingLeft: 12,
    borderLeftWidth: 3,
  },
  borderBottom: {borderBottomWidth: 1, borderBottomColor: colors.line},
  attentionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attentionTitle: {fontWeight: '700', fontSize: 12.5, color: colors.text},
  attentionSub: {color: colors.muted, fontSize: 11},

  viewAllRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  viewAllText: {color: colors.blue, fontWeight: '700', fontSize: 12},

  snapshotName: {fontWeight: '800', fontSize: 12, marginTop: 8},
  snapshotSub: {fontSize: 10, color: colors.muted2, marginTop: 1},

  healthBar: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#eef0f7',
  },
  healthLegendRow: {flexDirection: 'row', marginTop: 16},
  legendDotRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  legendDot: {width: 8, height: 8, borderRadius: 4},
  legendLabel: {fontSize: 10.5, color: colors.muted, fontWeight: '700'},
  legendValue: {fontWeight: '800', fontSize: 15, marginTop: 3},

  segment: {
    flexDirection: 'row',
    backgroundColor: '#eef0f7',
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
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
  chartCaption: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.muted,
    marginBottom: 4,
  },

  donutCenterValue: {fontSize: 17.5, fontWeight: '800'},
  donutCenterLabel: {fontSize: 9.5, color: colors.muted},
  borderBottomLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingVertical: 6,
  },
  legendRowText: {fontSize: 12, fontWeight: '600', color: colors.muted},
  legendRowValue: {fontWeight: '800'},

  activityIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.line,
    marginVertical: 2,
  },
  activityTitle: {fontWeight: '700', fontSize: 12.5, flexShrink: 1},
  activityTime: {color: colors.muted2, fontSize: 10},
  activitySub: {color: colors.muted, fontSize: 11, marginTop: 1},
});
