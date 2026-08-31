import React from 'react';
import {ScrollView, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {colors, radii} from '@/theme/colors';

export default function TabPills({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {tabs.map(t => {
        const isActive = t === active;
        return (
          <TouchableOpacity
            key={t}
            onPress={() => onChange(t)}
            style={[styles.pill, isActive && styles.pillActive]}>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {t}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {gap: 8, paddingBottom: 2},
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: radii.pill,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  pillActive: {backgroundColor: colors.blue, borderColor: colors.blue},
  label: {fontSize: 13.5, fontWeight: '700', color: colors.muted},
  labelActive: {color: '#fff'},
});
