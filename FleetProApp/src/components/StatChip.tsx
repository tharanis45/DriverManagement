import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {colors, radii} from '@/theme/colors';

export default function StatChip({
  label,
  value,
  color,
  bg,
  style,
}: {
  label: string;
  value: string | number;
  color?: string;
  bg?: string;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.chip, {backgroundColor: bg ?? '#f6f7fb'}, style]}>
      <Text
        style={[styles.value, {color: color ?? colors.text}]}
        numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    borderRadius: radii.md,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  value: {fontSize: 15, fontWeight: '800'},
  label: {fontSize: 10, color: colors.muted, fontWeight: '700', marginTop: 2},
});
