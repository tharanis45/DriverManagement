import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {gradients} from '@/theme/colors';

export default function ScreenHeader({
  title,
  eyebrow,
  subtitle,
  onBack,
  right,
  children,
}: {
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={gradients.header as unknown as string[]}
      locations={gradients.headerLocations as unknown as number[]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={[styles.header, {paddingTop: insets.top + 14}]}>
      <View style={styles.row}>
        <View style={{flex: 1}}>
          {onBack ? (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={onBack}
              hitSlop={10}>
              <Icon name="arrow-left" size={18} color="#dbe4ff" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          ) : (
            <>
              {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
              {title ? <Text style={styles.title}>{title}</Text> : null}
              {subtitle ? (
                <Text style={styles.subtitle}>{subtitle}</Text>
              ) : null}
            </>
          )}
        </View>
        {right}
      </View>
      {onBack && title ? (
        <Text style={[styles.title, {marginTop: 10}]}>{title}</Text>
      ) : null}
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {paddingHorizontal: 20, paddingBottom: 20},
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  backBtn: {flexDirection: 'row', alignItems: 'center', gap: 6},
  backText: {color: '#dbe4ff', fontWeight: '700', fontSize: 15},
  eyebrow: {
    fontSize: 10,
    letterSpacing: 1.2,
    color: '#c9d7ff',
    fontWeight: '700',
  },
  title: {fontSize: 21, fontWeight: '800', color: '#fff', marginTop: 2},
  subtitle: {fontSize: 11.5, color: '#c9d7ff', marginTop: 2},
});
