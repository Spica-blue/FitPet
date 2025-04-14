import React, { useState, useEffect, useRef } from "react";
import { View, Text, Alert } from "react-native";
import { Pedometer as ExpoPedometer } from "expo-sensors";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from "../styles/PedometerStyle";
import { sendStepToServer } from "../utils/UserAPI";

const Pedometer = () => {
  const [stepCount, setStepCount] = useState(0);
  // const startDateRef = useRef(null); // 테스트용
  const baseStepsRef = useRef(null);
  const savedRef = useRef(0);
  const latestStepsRef = useRef(0); // 최신 steps 저장용

  const KST_NOW = () => {
    const now = new Date();
    return new Date(now.getTime() + 9 * 60 * 60 * 1000) // UTC + 9
  };

  // 테스트용 (현재부터 1분 뒤에 리셋되게) → 실제 사용 시 이건 제거
  const TEST_RESET_AFTER_SECONDS = 20;

  // 하루 기준 시각 비교 (KST 00:00)
  const getKstDateString = (date) => {
    // return "2025-04-14"
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  };

  // 리셋 시점에 기준점도 최신 걸음 수로 재설정
  const resetStepCount = async () => {
    setStepCount(0);
    baseStepsRef.current = latestStepsRef.current; // 기준점 갱신
    savedRef.current = 0;
    await AsyncStorage.setItem("stepCount", "0");
    await AsyncStorage.setItem("lastResetDate", getKstDateString(KST_NOW()));
  };

  const checkAndResetDaily = async () => {
    const now = KST_NOW();
    const today = getKstDateString(now);
    const lastReset = await AsyncStorage.getItem("lastResetDate");

    // 실제 로직 : 하루 지났으면 리셋
    if(lastReset !== today){
      const userInfo = await AsyncStorage.getItem('userInfo');
      const parsed = JSON.parse(userInfo);
      const email = parsed?.email || parsed?.kakao_account?.email || '';
      console.log("하루동안의 만보기 누적 기록 : ", stepCount);
      
      const response = await sendStepToServer(email, stepCount);
      if(!response.success){
        console.error("서버 전송 실패:", response.error);
        Alert.alert("서버 오류", "만보기 기록을 저장하지 못했어요.");
        return;
      }

      Alert.alert("리셋", "걸음 수를 리셋합니다");
      await resetStepCount();
    }

    // 테스트용 리셋(지금부터 60초 후 강제 리셋)
    // if(startDateRef.current){
    //   const elapsed = (now.getTime() - startDateRef.current.getTime()) / 1000;
    //   if(elapsed >= TEST_RESET_AFTER_SECONDS){
    //     Alert.alert("테스트 리셋", "걸음 수를 리셋합니다");
    //     await resetStepCount();
    //     startDateRef.current = KST_NOW();
    //   }
    // }
  };

  useEffect(() => {
    let subscription;
    let checkInterval;

    const init = async () => {
      // Expo SDK 51에서는 Motion 권한을 직접 요청 가능
      const { granted } = await ExpoPedometer.requestPermissionsAsync();

      if (!granted) {
        Alert.alert("권한 필요", "만보기 사용 권한이 없습니다.");
        return;
      }

      // 저장된 값 불러우기
      const saved = await AsyncStorage.getItem("stepCount");
      if(saved){
        const parsed = parseInt(saved);
        setStepCount(parsed);
        savedRef.current = parsed;
      }

      // startDateRef.current = KST_NOW();

      subscription = ExpoPedometer.watchStepCount(async ({ steps }) => {
        latestStepsRef.current = steps;
        // 첫 호출 시 기준점 설정
        if (baseStepsRef.current === null) {
          baseStepsRef.current = steps;
        }
        
        // const newCount = steps <= 1 ? 0 : steps;
        const adjusted = steps - baseStepsRef.current;
        const total = savedRef.current + adjusted;

        setStepCount(total);
        await AsyncStorage.setItem("stepCount", total.toString());
      });

      // 10초마다 리셋 여부 확인
      checkInterval = setInterval(() => {
        checkAndResetDaily();
        // console.log("리셋여부 확인");
      }, 10000);
    };

    init();

    return () => {
      if(subscription) subscription.remove();
      // if(checkInterval) clearInterval(checkInterval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📱 만보기 테스트</Text>
      <Text style={styles.steps}>👣 현재 걸음 수: {stepCount.toLocaleString()}</Text>
    </View>
  );
};

export default Pedometer;