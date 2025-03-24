import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack"
import { initializeKakaoSDK } from '@react-native-kakao/core';
import Constants from 'expo-constants';
import NaverLogin from '@react-native-seoul/naver-login';

import HomeScreen from './screens/HomeScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import KakaoLoginButton from "./components/KakaoLoginButton";
import NaverLoginButton from './components/NaverLoginButton';

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
    // <View style={styles.container}>
    //   {/* <HomeScreen /> */}
    //   {/* <OnboardingScreen /> */}
    //   {/* <KakaoLoginButton /> */}
    //   {/* <NaverLoginButton /> */}
    //   <StatusBar style="auto" />
    // </View>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
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
