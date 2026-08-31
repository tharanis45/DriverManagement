import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {colors, radii} from '@/theme/colors';

export default function PickerField({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  error,
  containerStyle,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {label: string; value: string}[];
  placeholder?: string;
  error?: string;
  containerStyle?: object;
}) {
  return (
    <View style={[styles.wrap, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[styles.pickerWrap, error ? styles.pickerWrapError : undefined]}>
        <Picker selectedValue={value} onValueChange={onChange}>
          <Picker.Item label={placeholder} value="" color="#9aa1b5" />
          {options.map(opt => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
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
    marginBottom: 6,
  },
  pickerWrap: {
    backgroundColor: '#f1f3fa',
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  pickerWrapError: {borderWidth: 1.5, borderColor: colors.red},
  error: {fontSize: 11, color: colors.red, marginTop: 4, fontWeight: '600'},
});
