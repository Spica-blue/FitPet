import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import KakaoLoginButton from "./components/KakaoLoginButton";
import Constants from 'expo-constants';
import NaverLogin from '@react-native-seoul/naver-login';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import NaverLoginButton from './components/NaverLoginButton';

// 1️⃣ 앱 실행 시 초기화할 네이버 키 설정
const NAVER_CLIENT_ID = Constants.expoConfig?.extra?.naverClientId;
const NAVER_CLIENT_SECRET = Constants.expoConfig?.extra?.naverClientSecret;
const NAVER_SCHEME = "fitpet"; // app.json에서 설정한 scheme과 일치

initializeKakaoSDK('ac08cd35c42272ec7b5586c128239a4f');
NaverLogin.initialize({
  appName: "FitPet",
  consumerKey: NAVER_CLIENT_ID,
  consumerSecret: NAVER_CLIENT_SECRET
});

export default function App() {

  return (
    <View style={styles.container}>
      {/* <HomeScreen /> */}
      {/* <OnboardingScreen /> */}
      <KakaoLoginButton />
      <NaverLoginButton />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
