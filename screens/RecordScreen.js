import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BreakfastInput from '../components/record/BreakfastInput';
import LunchInput from '../components/record/LunchInput';
import DinnerInput from '../components/record/DinnerInput';
import RecommendationCard from '../components/record/RecommendationCard';
import { fetchDietByDate, fetchRecommendationByDate, saveDiet } from '../utils/UserAPI';
import styles from "../styles/tab/RecordScreenStyle";
import { me } from '@react-native-kakao/user';

const RecordScreen = () => {
  const [date, setDate] = useState(new Date());
  const [meals, setMeals] = useState({ breakfast: '', lunch: '', dinner: '' });
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllData(date);
  }, [date]);

  // 전체 데이터 불러오기 (식단 + GPT 추천)
  const loadAllData = async (targetDate) => {
    setLoading(true);

    const userInfo = await AsyncStorage.getItem('userInfo');
    const parsed = JSON.parse(userInfo);
    const email = parsed?.email || parsed?.kakao_account?.email || '';
    const dateStr = targetDate.toISOString().slice(0,10);

    // 1) 식단 불러오기
    const dietRes = await fetchDietByDate(email, dateStr);
    if (dietRes.success && dietRes.data){
      setMeals(dietRes.data);
    }
    else{
      // 404이거나 오류 시 모두 빈 입력 상태로 초기화
      setMeals({ breakfast: '', lunch: '', dinner: '' });
    }

    // 2) GPT 추천 결과 불러오기 (없으면 하루씩 뒤로 가면서 탐색)
    let rec = null;
    let cursor = new Date(targetDate);
    for(let i=0;i<7;i++){   // 최대 7일 이전까지
      const d = cursor.toISOString().slice(0,10);
      console.log("d:",d);
      const r = await fetchRecommendationByDate(email, d);
      if(r.success && r.data){
        rec = { ...r.data, asOf: d };
        break;
      }
      cursor.setDate(cursor.getDate() - 1);
    }

    setRecommendation(rec);
    console.log(rec);
    setLoading(false);
  };

  // 날짜 변경
  const changeDate = (offset) => {
    setDate(d => {
      const next = new Date(d);
      next.setDate(next.getDate() + offset);
      return next;
    });
  };

  // === 아침 식단만 저장하는 핸들러 ===
  const handleSaveBreakfast = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    const parsed = JSON.parse(userInfo);
    const email = parsed?.email || parsed?.kakao_account?.email || '';
    const payload = {
      email,
      date: formatted,
      breakfast: meals.breakfast,
      // lunch, dinner 는 기존에 setMeals 로 채워진 값을 그대로 보냄
      lunch: meals.lunch,
      dinner: meals.dinner,
    };
    const res = await saveDiet(payload);
    if(!res.success) throw res.error;

    // 로컬 상태도 업데이트
    setMeals(prev => ({ ...prev, breakfast: meals.breakfast }));
  }

  // === 점심 식단만 저장하는 핸들러 ===
  const handleSaveLunch = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    const parsed = JSON.parse(userInfo);
    const email = parsed?.email || parsed?.kakao_account?.email || '';
    const payload = {
      email,
      date: formatted,
      breakfast: meals.breakfast,
      lunch: meals.lunch,
      dinner: meals.dinner,
    };
    const res = await saveDiet(payload);
    if(!res.success) throw res.error;

    // 로컬 상태도 업데이트
    setMeals(prev => ({ ...prev, lunch: meals.lunch }));
  }

  // === 저녁 식단만 저장하는 핸들러 ===
  const handleSaveDinner = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    const parsed = JSON.parse(userInfo);
    const email = parsed?.email || parsed?.kakao_account?.email || '';
    const payload = {
      email,
      date: formatted,
      breakfast: meals.breakfast,
      lunch: meals.lunch,
      dinner: meals.dinner,
    };
    const res = await saveDiet(payload);
    if(!res.success) throw res.error;

    // 로컬 상태도 업데이트
    setMeals(prev => ({ ...prev, dinner: meals.dinner }));
  }

  const formatted = date.toISOString().slice(0,10);

  return (
    <GestureRecognizer
      onSwipeLeft={() => changeDate(1)}
      onSwipeRight={() => changeDate(-1)}
      config={{ velocityThreshold: 0.3, directionalOffsetThreshold: 80 }}
      style={styles.container}
    >
      <View style={styles.dateHeader}>
        <AntDesign name="left" size={24} onPress={() => changeDate(-1)} />
        <Text style={styles.dateText}>{formatted}</Text>
        <AntDesign name="right" size={24} onPress={() => changeDate(1)} />
      </View>

      {loading
        ? <ActivityIndicator style={{ marginTop: 50 }} size="large" />
        :
        <ScrollView contentContainerStyle={styles.content}>
          <RecommendationCard recommendation={recommendation} />
          <BreakfastInput
            value={meals.breakfast}
            onChange={text => setMeals(m => ({ ...m, breakfast: text }))}
            onSave={handleSaveBreakfast}
          />
          <LunchInput
            value={meals.lunch}
            onChange={text => setMeals(m => ({ ...m, lunch: text }))}
            onSave={handleSaveLunch}
          />
          <DinnerInput
            value={meals.dinner}
            onChange={text => setMeals(m => ({ ...m, dinner: text }))}
            onSave={handleSaveDinner}
          />
        </ScrollView>
      }
    </GestureRecognizer>
  )
}

export default RecordScreen