import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import KakaoLogin from "./components/KakaoLogin";
import { initializeKakaoSDK } from '@react-native-kakao/core';
import NaverLogin from './components/NaverLogin';

initializeKakaoSDK('ac08cd35c42272ec7b5586c128239a4f');

export default function App() {

  return (
    <View style={styles.container}>
      {/* <HomeScreen /> */}
      {/* <OnboardingScreen /> */}
      {/* <KakaoLogin /> */}
      <NaverLogin />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
