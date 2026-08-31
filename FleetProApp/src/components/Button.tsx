import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import {colors, radii} from '@/theme/colors';

type Variant = 'primary' | 'green' | 'outline' | 'ghostWhite' | 'danger';

export default function Button({
  label,
  onPress,
  variant = 'primary',
  style,
  disabled,
  icon,
  loading,
}: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
}) {
  const v = variantStyle(variant);
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.base,
        {
          backgroundColor: v.bg,
          borderColor: v.border ?? 'transparent',
          borderWidth: v.border ? 1.5 : 0,
        },
        disabled && {opacity: 0.5},
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <>
          {icon}
          <Text style={[styles.label, {color: v.fg}]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

function variantStyle(variant: Variant) {
  switch (variant) {
    case 'green':
      return {bg: colors.green, fg: '#fff', border: null as string | null};
    case 'outline':
      return {bg: '#fff', fg: colors.text, border: colors.line};
    case 'ghostWhite':
      return {bg: 'rgba(255,255,255,0.94)', fg: colors.blue, border: null};
    case 'danger':
      return {bg: colors.redBg, fg: colors.red, border: null};
    case 'primary':
    default:
      return {bg: colors.blue, fg: '#fff', border: null};
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: radii.md,
  },
  label: {fontWeight: '700', fontSize: 14.5},
});
