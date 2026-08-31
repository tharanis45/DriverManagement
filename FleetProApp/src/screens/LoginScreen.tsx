import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/types';
import {colors, gradients} from '@/theme/colors';
import Button from '@/components/Button';
import {useApp} from '@/context/AppContext';
import {mobileError, onlyDigits} from '@/utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen(_props: Props) {
  const {login} = useApp();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = () => {
    let valid = true;

    const phoneErr = mobileError(phone);
    if (phoneErr) {
      setPhoneError(phoneErr);
      valid = false;
    } else {
      setPhoneError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 4) {
      setPasswordError('Password must be at least 4 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleLogin = () => {
    if (!validate()) {
      return;
    }
    // RootNavigator swaps its whole screen set based on `isAuthenticated`,
    // so once this flips to true it re-renders straight into MainTabs.
    // A manual reset() here would race that state update and fire before
    // the "MainTabs" route exists in the (still unauthenticated) navigator.
    login();
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient
        colors={gradients.loginTop as unknown as string[]}
        style={styles.top}>
        <View style={styles.iconBox}>
          <Icon name="truck" size={36} color="#fff" />
        </View>
        <Text style={styles.brand}>Jayam Cars</Text>
        <Text style={styles.brandSub}>DRIVER MANAGEMENT</Text>
        <View style={styles.statsRow}>
          {[
            ['500+', 'Drivers'],
            ['98%', 'Uptime'],
            ['4.9★', 'Rating'],
          ].map(([a, b]) => (
            <View key={b} style={styles.statPill}>
              <Text style={styles.statValue}>{a}</Text>
              <Text style={styles.statLabel}>{b}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.welcome}>Welcome back</Text>
        <Text style={styles.welcomeSub}>Sign in to your admin account</Text>

        <View
          style={[styles.inputWrap, phoneError ? styles.inputWrapError : null]}>
          <View style={styles.inputIcon}>
            <Icon name="phone" size={14} color={colors.blue} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="10-digit phone number"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={text => {
              setPhone(onlyDigits(text).slice(0, 10));
              if (phoneError) {
                setPhoneError('');
              }
            }}
          />
        </View>
        {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

        <View
          style={[
            styles.inputWrap,
            passwordError ? styles.inputWrapError : null,
          ]}>
          <View style={styles.inputIcon}>
            <Icon name="lock" size={14} color={colors.blue} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={text => {
              setPassword(text);
              if (passwordError) {
                setPasswordError('');
              }
            }}
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPassword(s => !s)}>
            <Icon
              name={showPassword ? 'eye-off' : 'eye'}
              size={18}
              color={colors.muted}
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <View style={styles.rowBetween}>
          <Text style={styles.rememberMe}>Remember me</Text>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </View>

        <Button
          label="Sign In to Jayam Cars"
          onPress={handleLogin}
          style={{marginTop: 6}}
        />

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.orLine} />
        </View>

        <Button
          label="Biometric Login"
          variant="outline"
          onPress={handleLogin}
          icon={
            <Icon
              name="smartphone"
              size={18}
              color={colors.blue}
              style={{marginRight: 4}}
            />
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  top: {paddingTop: 60, paddingBottom: 24, alignItems: 'center'},
  iconBox: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  brand: {fontSize: 26, fontWeight: '900', color: '#fff'},
  brandSub: {
    fontSize: 11.5,
    letterSpacing: 2,
    fontWeight: '700',
    color: '#c9d7ff',
    marginTop: 2,
  },
  statsRow: {flexDirection: 'row', gap: 10, marginTop: 16},
  statPill: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  statValue: {color: '#fff', fontWeight: '800', fontSize: 13},
  statLabel: {color: '#c9d7ff', fontSize: 10},
  sheet: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    marginTop: -16,
    padding: 22,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#e5e7f0',
    borderRadius: 99,
    alignSelf: 'center',
    marginBottom: 18,
  },
  welcome: {fontSize: 22, fontWeight: '900', color: colors.text},
  welcomeSub: {
    fontSize: 13.5,
    color: colors.muted,
    marginTop: 2,
    marginBottom: 20,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3fa',
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  inputIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#e7edff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  input: {flex: 1, paddingVertical: 14, fontSize: 14.5, color: colors.text},
  inputWrapError: {borderWidth: 1, borderColor: '#ef4444'},
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: -6,
    marginBottom: 10,
    marginLeft: 4,
  },
  eyeBtn: {padding: 4},
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
  },
  rememberMe: {fontSize: 13, color: colors.muted, fontWeight: '600'},
  forgot: {fontSize: 13, color: colors.blue, fontWeight: '700'},
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 16,
  },
  orLine: {flex: 1, height: 1, backgroundColor: colors.line},
  orText: {color: colors.muted2, fontSize: 12},
});
