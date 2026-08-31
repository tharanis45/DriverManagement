import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/types';
import {colors} from '@/theme/colors';
import {useApp} from '@/context/AppContext';
import Button from '@/components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'LogoutConfirm'>;

export default function LogoutConfirmModal({navigation}: Props) {
  const {logout} = useApp();

  const confirmLogout = () => {
    // RootNavigator swaps its whole screen set based on `isAuthenticated`,
    // so once this flips to false it re-renders straight into Login.
    // A manual reset() here would race that state update and fire before
    // the "Login" route exists in the (still authenticated) navigator.
    logout();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <View style={styles.iconBox}>
          <Icon name="log-out" size={24} color={colors.red} />
        </View>
        <Text style={styles.title}>Log out of Jayam Cars?</Text>
        <Text style={styles.subtitle}>
          You'll need to sign in again to access your dashboard.
        </Text>
        <View style={{flexDirection: 'row', gap: 10, marginTop: 22}}>
          <Button
            label="Cancel"
            variant="outline"
            style={{flex: 1}}
            onPress={() => navigation.goBack()}
          />
          <Button
            label="Log Out"
            variant="danger"
            style={{flex: 1}}
            icon={<Icon name="log-out" size={16} color={colors.red} />}
            onPress={confirmLogout}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10,12,25,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.redBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {fontWeight: '800', fontSize: 16.5},
  subtitle: {
    color: colors.muted,
    fontSize: 12.5,
    marginTop: 6,
    textAlign: 'center',
  },
});
