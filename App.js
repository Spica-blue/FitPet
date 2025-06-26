import { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack"
import { initializeKakaoSDK } from '@react-native-kakao/core';
import { LocaleConfig } from 'react-native-calendars';
import Constants from 'expo-constants';
import NaverLogin from '@react-native-seoul/naver-login';

import PullToRefresh from './components/PullToRefresh';
import TabNavigator from './navigation/TabNavigator';
import HomeScreen from './screens/HomeScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import GoalSetupScreen from './screens/GoalSetupScreen';
import GptResultScreen from "./screens/GptResultScreen";
import Pet from './components/Pet';
import SpringTest from "./screens/SpringTest";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DiaryEntryScreen from './screens/DiaryEntryScreen';
import PetSelectionScreen from './screens/PetSelectionScreen';
import SettingsScreen from './screens/SettingsScreen';

// 한국어 로케일 정의
LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월','2월','3월','4월','5월','6월',
    '7월','8월','9월','10월','11월','12월'
  ],
  monthNamesShort: [
    '1월','2월','3월','4월','5월','6월',
    '7월','8월','9월','10월','11월','12월'
  ],
  dayNames: [
    '일요일','월요일','화요일','수요일','목요일','금요일','토요일'
  ],
  dayNamesShort: ['일','월','화','수','목','금','토'],
  today: '오늘'
};

// 기본 로케일을 한국어로 설정
LocaleConfig.defaultLocale = 'ko';

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
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Onboarding');

  const navigationRef = useRef();

  useEffect(() => {
    const checkLogin = async () => {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if(userInfo){
        setInitialRoute('Main');
      }
      else{
        setInitialRoute('Onboarding');
      }
      setIsReady(true);
    };

    checkLogin();
  }, []);

  if(!isReady) return null; // 로딩 중엔 아무것도 렌더링하지 않음

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        {/* <PullToRefresh
          onRefresh={async () => {
            // 현재 라우트 다시 네비게이트해서 remount
            const current = navigationRef.current.getCurrentRoute()?.name;
            if(current){
              navigationRef.current.reset({
                index: 0,
                routes: [{ name: current }],
              });
            }
          }}
        > */}
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="GoalSetup" component={GoalSetupScreen} />
              <Stack.Screen name="GptResult" component={GptResultScreen} />
              <Stack.Screen name="Main">
                {props => (
                  <PullToRefresh
                    onRefresh={async () => {
                      const current = navigationRef.current.getCurrentRoute()?.name;
                      if(current){
                        navigationRef.current.reset({
                          index: 0,
                          routes: [{ name: current }],
                        });
                      }
                    }}
                  >
                    <TabNavigator {...props} />
                  </PullToRefresh>
                )}
              </Stack.Screen>
              {/* Settings는 탭 바 숨기고 뒤로가기 헤더만 표시 */}
              <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                  headerShown: true,
                  headerTitle: '설정',
                  headerBackTitle: '뒤로',
                }}
              />
              <Stack.Screen name="DiaryEntry" component={DiaryEntryScreen} />
              <Stack.Screen name="PetSelection" component={PetSelectionScreen} options={{ title: "캐릭터 선택" }} />
              {/* <Stack.Screen name="SpringTest" component={SpringTest} /> */}
              {/* <Stack.Screen name="Pet" component={Pet} /> */}
            </Stack.Navigator>
          </NavigationContainer>
        {/* </PullToRefresh> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  // },
  safeArea: {
     flex: 1,
     backgroundColor: '#fff',
  },
});
