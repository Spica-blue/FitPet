import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from "../styles/tab/HomeScreenStyle";
import Pet from '../components/Pet';
import Pedometer from "../components/Pedometer";
import { fetchRecommendationByDate } from "../utils/UserAPI";
import CustomProgressBar from '../components/CustomProgressBar';
import SemiCircleGauge from '../components/SemiCircleGauge';

const { width: screenW } = Dimensions.get('window');

const HomeScreen = () => {
  const [goalSteps, setGoalSteps] = useState(0);
  const [currentSteps, setCurrentSteps] = useState(0);
  const [loading, setLoading] = useState(true);

  // 날짜 문자열 반환 헬퍼
  const todayString = () => {
    const d = new Date(Date.now() + 9 * 60 * 60_000); // KST
    return d.toISOString().slice(0, 10);
  };

  // n일 전 날짜 문자열 생성
  const offsetDateString = (base, offset) => {
    const d = new Date(base);
    d.setDate(d.getDate() - offset);
    return d.toISOString().slice(0, 10);
  };

  useEffect(() => {
    (async () => {
      const userInfo = await AsyncStorage.getItem('userInfo');
      const parsed = JSON.parse(userInfo);
      const email = parsed?.email || parsed?.kakao_account?.email || '';

      const today = todayString();
      let recommendation = null;
      for (let i = 0; i < 7; i++) {
        const date = i === 0 ? today : offsetDateString(today, i);
        const res = await fetchRecommendationByDate(email, date);
        if (res.success && res.data) {
          recommendation = res.data.recommendations;
          console.log(`✅ ${date} 추천 결과 사용`);
          break;
        }
      }

      if (recommendation?.운동?.["하루 목표 빠른 걸음 수"]) {
        const raw = recommendation.운동["하루 목표 빠른 걸음 수"];
        const goal = parseInt(raw.split('(')[0], 10) || 0;
        // setGoalSteps(isNaN(goal) ? 0 : goal);

        // 로컬에도 저장
        // const dateKey = todayString();
        // await AsyncStorage.setItem(`goalSteps_${email}_${dateKey}`, goal.toString());

        await AsyncStorage.setItem(`goalSteps_${email}`, goal.toString());
        setGoalSteps(goal);
      }

      setLoading(false);
    })();
  }, []);

  if(loading){
    return (
      <View style={[styles.container, styles.loading]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const progress = goalSteps > 0 ? currentSteps / goalSteps : 0;

  return (
    <View style={styles.container}>
      {/* 1) 반원 게이지 */}
      <View style={styles.gaugeWrapper}>
        <SemiCircleGauge
          size={screenW * 0.8}
          strokeWidth={14}
          backgroundColor="#ddd"
          fillColor="#4CAF50"
          progress={Math.min(progress, 1)}
          animationDuration={600}
        />
      </View>

      <Pedometer goal={goalSteps} onStepCountChange={(steps) => setCurrentSteps(steps)} />

      {/* 커스텀 프로그레스 바 */}
      {/* <View style={{ alignItems: 'center', marginTop: 20 }}>
        <CustomProgressBar
          progress={Math.min(progress, 1)}
          barWidth={260}
          height={12}
          color="#4CAF50"
        />
      </View> */}

      <Pet currentSteps={currentSteps} goalSteps={goalSteps} />
    </View>
  );
};

export default HomeScreen;
