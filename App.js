import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack"
import { initializeKakaoSDK } from '@react-native-kakao/core';
import Constants from 'expo-constants';
import NaverLogin from '@react-native-seoul/naver-login';

import TabNavigator from './navigation/TabNavigator';
import HomeScreen from './screens/HomeScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import GoalSetupScreen from './screens/GoalSetupScreen';
import GptResultScreen from "./screens/GptResultScreen";
import Pet from './components/Pet';
import SpringTest from "./screens/SpringTest";

// 1️⃣ 앱 실행 시 초기화할 네이버 키 설정
const NAVER_CLIENT_ID = Constants.expoConfig?.extra?.naverClientId;
const NAVER_CLIENT_SECRET = Constants.expoConfig?.extra?.naverClientSecret;

initializeKakaoSDK('ac08cd35c42272ec7b5586c128239a4f');

NaverLogin.initialize({
  appName: "FitPet",
  consumerKey: NAVER_CLIENT_ID,
  consumerSecret: NAVER_CLIENT_SECRET
});

const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="GoalSetup" component={GoalSetupScreen} />
        <Stack.Screen name="GptResult" component={GptResultScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
        {/* <Stack.Screen name="SpringTest" component={SpringTest} /> */}
        {/* <Stack.Screen name="Pet" component={Pet} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
