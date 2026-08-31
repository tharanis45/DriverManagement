import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {colors, radii} from '@/theme/colors';
import {fmt} from '@/utils/format';
import {useApp} from '@/context/AppContext';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';
import DonutChart from '@/components/DonutChart';
import LineChart from '@/components/LineChart';

const EXPORTS = [
  {icon: 'file-text', bg: '#fee2e2', fg: '#dc2626', label: 'PDF'},
  {icon: 'bar-chart-2', bg: '#dcfce7', fg: '#16a34a', label: 'Excel'},
  {icon: 'download', bg: '#dbeafe', fg: '#2563eb', label: 'CSV'},
];

export default function ReportsScreen() {
  const {totals} = useApp();

  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <ScreenHeader title="Reports" subtitle="June 2025 · Q2 Summary" />
      <ScrollView contentContainerStyle={{padding: 20, paddingTop: 14}}>
        <Card>
          <Text style={styles.cardTitle}>Salary Distribution</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 18}}>
            <DonutChart
              segments={[
                {value: totals.paid, color: colors.green},
                {value: totals.pending, color: colors.amber},
                {value: totals.advance, color: colors.blue},
              ]}
              size={110}
              strokeWidth={18}
            />
            <View style={{flex: 1}}>
              {[
                ['Paid', totals.paid, colors.green],
                ['Pending', totals.pending, colors.amber],
                ['Advance', totals.advance, colors.blue],
              ].map(([label, val, c]) => (
                <View key={label as string} style={styles.legendRow}>
                  <View style={styles.legendLeft}>
                    <View
                      style={[styles.dot, {backgroundColor: c as string}]}
                    />
                    <Text style={styles.legendLabel}>{label}</Text>
                  </View>
                  <Text style={styles.legendValue}>{fmt(val as number)}</Text>
                </View>
              ))}
            </View>
          </View>
        </Card>

        <Card style={{marginTop: 14}}>
          <Text style={styles.cardTitle}>Monthly Salary Trend</Text>
          <LineChart points={[80, 88, 74, 82, 94, 86]} color={colors.blue} />
        </Card>

        <Card style={{marginTop: 14}}>
          <Text style={styles.cardTitle}>Export Reports</Text>
          <View style={{flexDirection: 'row', gap: 10}}>
            {EXPORTS.map(e => (
              <TouchableOpacity key={e.label} style={styles.exportBtn}>
                <View style={[styles.exportIcon, {backgroundColor: e.bg}]}>
                  <Icon name={e.icon} size={18} color={e.fg} />
                </View>
                <Text style={styles.exportLabel}>{e.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.shareBtn}>
            <Icon name="share-2" size={16} color={colors.text} />
            <Text style={styles.shareText}>Share Report</Text>
          </TouchableOpacity>
        </Card>
        <View style={{height: 20}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardTitle: {fontWeight: '800', marginBottom: 14},
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  legendLeft: {flexDirection: 'row', alignItems: 'center', gap: 6},
  dot: {width: 9, height: 9, borderRadius: 4.5},
  legendLabel: {fontSize: 12, color: colors.muted, fontWeight: '600'},
  legendValue: {fontWeight: '800'},
  exportBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radii.md,
  },
  exportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  exportLabel: {fontWeight: '700', fontSize: 12},
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radii.md,
    paddingVertical: 14,
    marginTop: 14,
  },
  shareText: {fontWeight: '700'},
});
