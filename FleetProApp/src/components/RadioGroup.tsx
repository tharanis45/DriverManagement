import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, radii} from '@/theme/colors';

export default function RadioGroup({
  label,
  options,
  value,
  onChange,
  error,
  columns = 2,
}: {
  label: string;
  options: {label: string; value: string}[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  columns?: number;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionsRow}>
        {options.map(opt => {
          const selected = opt.value === value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.option, {width: `${100 / columns}%`}]}
              activeOpacity={0.7}
              onPress={() => onChange(opt.value)}>
              <View style={[styles.dot, selected && styles.dotSelected]}>
                {selected && <View style={styles.dotInner} />}
              </View>
              <Text
                style={[
                  styles.optionText,
                  selected && styles.optionTextSelected,
                ]}
                numberOfLines={1}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {marginBottom: 14},
  label: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#8790ab',
    marginBottom: 8,
  },
  optionsRow: {flexDirection: 'row', flexWrap: 'wrap'},
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingRight: 8,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#c7ceE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotSelected: {borderColor: colors.blue},
  dotInner: {
    width: 9,
    height: 9,
    borderRadius: radii.pill,
    backgroundColor: colors.blue,
  },
  optionText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
    flexShrink: 1,
  },
  optionTextSelected: {color: colors.blue, fontWeight: '800'},
  error: {fontSize: 11, color: colors.red, marginTop: 4, fontWeight: '600'},
});
