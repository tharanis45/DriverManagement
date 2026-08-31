import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colorForName} from '@/theme/colors';
import {initials} from '@/utils/format';

export default function Avatar({
  name,
  size = 44,
  radius,
}: {
  name: string;
  size?: number;
  radius?: number;
}) {
  const bg = colorForName(name);
  const br = radius ?? size / 2;
  return (
    <View
      style={[
        styles.avatar,
        {width: size, height: size, borderRadius: br, backgroundColor: bg},
      ]}>
      <Text style={[styles.text, {fontSize: size * 0.36}]}>
        {initials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {alignItems: 'center', justifyContent: 'center'},
  text: {color: '#fff', fontWeight: '800'},
});
