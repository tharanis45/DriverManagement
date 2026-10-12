import React from 'react';
import {View, ViewStyle, StyleSheet} from 'react-native';
import {colors, radii} from '@/theme/colors';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  noPadding?: boolean;
};

export default function Card({children, style, noPadding}: Props) {
  return (
    <View style={[styles.card, noPadding && {padding: 0}, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: 16,
    shadowColor: '#10142c',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 1},
    elevation: 1,
  },
});
