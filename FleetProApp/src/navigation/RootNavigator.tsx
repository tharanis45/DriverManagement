import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {useApp} from '@/context/AppContext';
import {colors} from '@/theme/colors';

import MainTabs from './MainTabs';
import LaunchScreen from '@/screens/LaunchScreen';
import LoginScreen from '@/screens/LoginScreen';
import DriverProfileScreen from '@/screens/DriverProfileScreen';
import EditDriverScreen from '@/screens/EditDriverScreen';
import AddDriverScreen from '@/screens/AddDriverScreen';
import EditVehicleScreen from '@/screens/EditVehicleScreen';
import SalaryManagementScreen from '@/screens/SalaryManagementScreen';

import AddSalaryEntryModal from '@/modals/AddSalaryEntryModal';
import AddAdvanceModal from '@/modals/AddAdvanceModal';
import AddVehicleModal from '@/modals/AddVehicleModal';
import AssignVehicleModal from '@/modals/AssignVehicleModal';
import LogoutConfirmModal from '@/modals/LogoutConfirmModal';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const {isAuthenticated, isReady} = useApp();

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Launch" component={LaunchScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="DriverProfile" component={DriverProfileScreen} />
          <Stack.Screen name="EditDriver" component={EditDriverScreen} />
          <Stack.Screen name="AddDriver" component={AddDriverScreen} />
          <Stack.Screen name="EditVehicle" component={EditVehicleScreen} />
          <Stack.Screen
            name="SalaryManagement"
            component={SalaryManagementScreen}
          />

          {/* Modal-presentation group — reachable from anywhere once authenticated.
              It must live inside this branch (not rendered unconditionally) so that
              logging out removes it along with every other authenticated screen.
              Otherwise "LogoutConfirm" would survive the auth-state screen swap
              (it'd still be a registered route name) and React Navigation's
              auth-flow auto-reset — which only kicks in when *no* routes from the
              old screen set survive — would never fire, stranding the user on the
              logout confirmation sheet with no path back to Login. */}
          <Stack.Group
            screenOptions={{
              presentation: 'transparentModal',
              animation: 'fade',
            }}>
            <Stack.Screen
              name="AddSalaryEntry"
              component={AddSalaryEntryModal}
            />
            <Stack.Screen name="AddAdvance" component={AddAdvanceModal} />
            <Stack.Screen name="AddVehicleModal" component={AddVehicleModal} />
            <Stack.Screen
              name="AssignVehicleModal"
              component={AssignVehicleModal}
            />
            <Stack.Screen name="LogoutConfirm" component={LogoutConfirmModal} />
          </Stack.Group>
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.navy,
  },
});
