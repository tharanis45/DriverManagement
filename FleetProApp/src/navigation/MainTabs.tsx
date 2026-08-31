import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import {colors} from '@/theme/colors';
import {MainTabParamList} from './types';

import HomeScreen from '@/screens/HomeScreen';
import DriversScreen from '@/screens/DriversScreen';
import VehiclesScreen from '@/screens/VehiclesScreen';
import ReportsScreen from '@/screens/ReportsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, string> = {
  Home: 'grid',
  Drivers: 'users',
  Vehicles: 'truck',
  Reports: 'bar-chart-2',
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.navbar,
          borderTopWidth: 0,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#8b93b8',
        tabBarLabelStyle: {fontSize: 11, fontWeight: '600'},
        tabBarIcon: ({color, size}) => (
          <Icon
            name={ICONS[route.name as keyof MainTabParamList]}
            color={color}
            size={size ?? 20}
          />
        ),
        tabBarActiveBackgroundColor: 'transparent',
        tabBarItemStyle: {marginHorizontal: 4, borderRadius: 14},
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Drivers" component={DriversScreen} />
      <Tab.Screen name="Vehicles" component={VehiclesScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
    </Tab.Navigator>
  );
}
