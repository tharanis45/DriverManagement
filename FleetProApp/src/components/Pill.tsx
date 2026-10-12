import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, radii} from '@/theme/colors';

type Variant = 'green' | 'amber' | 'red' | 'gray' | 'purple';

const VARIANT_STYLES: Record<Variant, {bg: string; fg: string}> = {
  green: {bg: colors.greenBg, fg: colors.green},
  amber: {bg: colors.amberBg, fg: colors.amber},
  red: {bg: colors.redBg, fg: colors.red},
  gray: {bg: '#eef0f5', fg: colors.muted},
  purple: {bg: colors.purpleBg, fg: colors.purple},
};

export default function Pill({
  label,
  variant = 'gray',
  dot,
}: {
  label: string;
  variant?: Variant;
  dot?: boolean;
}) {
  const v = VARIANT_STYLES[variant];
  return (
    <View style={[styles.pill, {backgroundColor: v.bg}]}>
      {dot && <View style={[styles.dot, {backgroundColor: v.fg}]} />}
      <Text style={[styles.label, {color: v.fg}]}>{label}</Text>
    </View>
  );
}

export function statusVariant(status: string): Variant {
  switch (status) {
    case 'Active':
    case 'Paid':
    case 'Settled':
    case 'On Road':
      return 'green';
    case 'Partial':
      return 'amber';
    case 'Pending':
      return 'red';
    case 'Inactive':
    default:
      return 'gray';
  }
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
    gap: 4,
  },
  dot: {width: 6, height: 6, borderRadius: 3},
  label: {fontSize: 12, fontWeight: '700'},
});
