import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/types';
import {gradients} from '@/theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Launch'>;

export default function LaunchScreen({navigation}: Props) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Login'), 1600);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{flex: 1}}
      onPress={() => navigation.replace('Login')}>
      <LinearGradient
        colors={gradients.splash as unknown as string[]}
        style={styles.container}>
        <View style={styles.ringOuter} />
        <View style={styles.ringInner} />
        <View style={styles.iconBox}>
          <Icon name="truck" size={46} color="#2541c9" />
        </View>
        <Text style={styles.title}>Jayam Cars</Text>
        <Text style={styles.subtitle}>DRIVER MANAGEMENT</Text>
        <View style={styles.dots}>
          <View style={[styles.dot, {backgroundColor: '#fff'}]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <Text style={styles.footer}>ENTERPRISE EDITION</Text>
        <Text style={styles.tap}>tap to continue</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  ringOuter: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  ringInner: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  iconBox: {
    width: 96,
    height: 96,
    backgroundColor: '#fff',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  title: {fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -0.5},
  subtitle: {
    fontSize: 12.5,
    letterSpacing: 2,
    fontWeight: '700',
    color: '#c9d7ff',
    marginTop: 4,
  },
  dots: {flexDirection: 'row', gap: 6, marginTop: 22},
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  footer: {
    position: 'absolute',
    bottom: 44,
    fontSize: 11,
    letterSpacing: 3,
    color: '#a9bcf3',
    fontWeight: '700',
  },
  tap: {position: 'absolute', bottom: 16, fontSize: 11, color: '#89a0ea'},
});
