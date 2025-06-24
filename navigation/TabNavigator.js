import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import RecordScreen from '../screens/RecordScreen';
import CalendarScreen from '../screens/CalendarScreen';
import UserScreen from '../screens/UserScreen';

import PetIcon from '../assets/icons/pet_icon.png';
import DietIcon from '../assets/icons/diet_icon.png';
import CalendarIcon from '../assets/icons/calendar_icon.png';
import UserIcon from '../assets/icons/user_icon.png';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="펫" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color }) => (
            <Image source={PetIcon} style={{ width: 45, height: 45, tintColor: color }} />
          )
        }}
      />
      <Tab.Screen 
        name="식단" 
        component={RecordScreen} 
        options={{
          tabBarIcon: ({ color }) => (
            <Image source={DietIcon} style={{ width: 40, height: 40, tintColor: color }} />
          )
        }}
      />
      <Tab.Screen 
        name="달력" 
        component={CalendarScreen} 
        options={{
          tabBarIcon: ({ color }) => (
            <Image source={CalendarIcon} style={{ width: 40, height: 40, tintColor: color }} />
          )
        }}
      />
      <Tab.Screen 
        name="사용자" 
        component={UserScreen} 
        options={{
          tabBarIcon: ({ color }) => (
            <Image source={UserIcon} style={{ width: 40, height: 40, tintColor: color }} />
          )
        }}
      />
    </Tab.Navigator>
  )
}

export default TabNavigator