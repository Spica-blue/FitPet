import React, { useState, useEffect, useRef } from "react";
import { View, Text, Alert, AppState } from "react-native";
import { Pedometer as ExpoPedometer } from "expo-sensors";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from "../styles/PedometerStyle";
import { sendStepToServer } from "../utils/UserAPI";

const Pedometer = ({ goal = 0 }) => {
  const [stepCount, setStepCount] = useState(0);
  // const startDateRef = useRef(null); // 테스트용
  const baseStepsRef = useRef(null);
  const savedRef = useRef(0);
  const latestStepsRef = useRef(0); // 최신 steps 저장용
  const resetTimerRef  = useRef(null);

  // 현재 로그인된 유저 이메일을 가져옵니다.
  const getEmail = async () => {
    const userInfo = await AsyncStorage.getItem("userInfo");
    const parsed = JSON.parse(userInfo);
    return parsed?.email || parsed?.kakao_account?.email || "";
  };

  // 현재 시각을 한국 표준시(KST)로 변환하여 Date 객체로 반환
  const nowKst = () => {
    const d = new Date();
    return new Date(d.getTime() + 9 * 60 * 60_000);
  }

  // YYYY-MM-DD 형식의 오늘 날짜 문자열 반환
  const todayString = () => {
    return nowKst().toISOString().slice(0,10);
  }

  // --- performDailyReset, scheduleNextReset, checkMissedReset 모두 getEmail()로 키를 동적으로 생성 ---
  // 매일 자정에 실행할 리셋 함수
  const performDailyReset = async () => {
    const email = await getEmail();

    // const dateKey = todayString();
    // 어제 날짜를 key 로 사용
    const yesterday = nowKst();
    yesterday.setDate(yesterday.getDate() - 1);

    // 3. YYYY-MM-DD 포맷으로 직접 조합
    const yyyy = yesterday.getFullYear();
    const mm = String(yesterday.getMonth() + 1).padStart(2, '0');
    const dd = String(yesterday.getDate()).padStart(2, '0');
    const dateKey = `${yyyy}-${mm}-${dd}`;
    // const dateKey = yesterday.toISOString().slice(0,10);
    // const STEP_KEY = `stepCount_${email}_${dateKey}`;
    const RESET_DATE_KEY = `lastResetDate_${email}`;

    console.log("어제 걸음 수 업로드:", stepCount);
    const response = await sendStepToServer(email, stepCount);
    if (!response.success) {
      console.error("걸음 수 전송 실패:", response.error);
      Alert.alert("서버 오류", "만보기 기록을 저장하지 못했어요.");
      return;
    }

    // await AsyncStorage.setItem(STEP_KEY, stepCount.toString());
    await AsyncStorage.setItem(RESET_DATE_KEY, dateKey);

    Alert.alert("리셋", "걸음 수를 리셋합니다");
    // 메모리와 로컬 저장소 둘 다 초기화
    setStepCount(0);
    savedRef.current = 0;
    baseStepsRef.current = latestStepsRef.current;
  }

  // 다음 자정을 기준으로 한 번만 타이머를 예약
  const scheduleNextReset = async () => {
    // 이미 예약된 타이머가 있으면 해제
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    const now = nowKst();
    // 오늘 자정 이후 바로 5초 뒤 시각 계산
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24,0,5,0); // 5 seconds past midnight
    const msUntil = nextMidnight.getTime() - now.getTime();

    // 자정 시각에 performDailyReset 실행, 끝나면 다시 다음 날 예약
    resetTimerRef.current = setTimeout(async () => {
      await performDailyReset();
      await scheduleNextReset();
    }, msUntil);
  }

  const checkMissedReset = async () => {
    const email = await getEmail();
    const RESET_DATE_KEY = `lastResetDate_${email}`;
    const last = await AsyncStorage.getItem(RESET_DATE_KEY);
    const today = todayString();
    if (last !== today) {
      await performDailyReset();
    }
    await scheduleNextReset();
  }

  // 로컬 캐시 삭제
  async function clearDatedStepAndGoalCache() {
    // 1) 모든 키 가져오기
    const allKeys = await AsyncStorage.getAllKeys();

    // 2) 이메일 포함한 패턴으로 필터링
    //    예: goalSteps_heo1356@gmail.com_2025-05-12
    //         stepCount_heo1356@gmail.com_2025-05-13
    const datedKeys = allKeys.filter(key => {
      return (
        key.startsWith('goalSteps_') || key.startsWith('stepCount_')
      ) && /\d{4}-\d{2}-\d{2}$/.test(key);
    });

    // 3) 삭제
    if (datedKeys.length > 0) {
      await AsyncStorage.multiRemove(datedKeys);
      console.log('삭제된 로컬 캐시 키:', datedKeys);
    } else {
      console.log('삭제할 dated 캐시 키가 없습니다.');
    }
  }

  useEffect(() => {
    // 로컬 캐시 삭제
    // clearDatedStepAndGoalCache();
    let subscription;

    const subscriptionApp = AppState.addEventListener("change", state => {
      if (state === "active") checkMissedReset();
    });

    const init = async () => {
      const email = await getEmail();
      const STEP_KEY = `stepCount_${email}`;

      // Expo SDK 51에서는 Motion 권한을 직접 요청 가능
      const { granted } = await ExpoPedometer.requestPermissionsAsync();

      if (!granted) {
        Alert.alert("권한 필요", "만보기 사용 권한이 없습니다.");
        return;
      }

      // 계정별 저장된 값 불러우기
      const saved = await AsyncStorage.getItem(STEP_KEY);
      if(saved){
        const parsed = parseInt(saved,10);
        setStepCount(parsed);
        savedRef.current = parsed;
      }

      subscription = ExpoPedometer.watchStepCount(async ({ steps }) => {
        latestStepsRef.current = steps;
        // 첫 호출 시 기준점 설정
        if (baseStepsRef.current === null) {
          baseStepsRef.current = steps;
        }
        
        const adjusted = steps - baseStepsRef.current;
        const total = savedRef.current + adjusted;

        setStepCount(total);
        await AsyncStorage.setItem(STEP_KEY, total.toString());
      });

      await checkMissedReset();
    };

    init();

    return () => {
      if(subscription) subscription.remove();
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      subscriptionApp.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📱 만보기 테스트</Text>
      <Text style={styles.steps}>👣 현재 걸음 수: {stepCount.toLocaleString()} / {goal.toLocaleString()}</Text>
    </View>
  );
};

export default Pedometer;