import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import styles from "../../styles/StepStyle";

const Step3GoalCalories = ({ data, setData, onNext, onBack }) => {
  const [customCalories, setCustomCalories] = useState(data.targetCalories?.toString() || '');
  const [bmr, setBmr] = useState(0);
  const [tdee, setTdee] = useState(0);
  const [recommended, setRecommended] = useState(0);
  const [weeks, setWeeks] = useState(0);
  const [dietIntensity, setDietIntensity] = useState(data.dietIntensity || '일반');
  const [finalTargetDate, setFinalTargetDate] = useState(null);

  const intensityOptions = ['느긋하게', '일반', '빠르게']; // 감량 강도 목록
  // 강도에 따라 하루 감산 kcal 정하기
  const intensityMap = {
    '느긋하게': 275,
    '일반': 550,
    '빠르게': 825,
  };
  
  const deficitPerDay = intensityMap[dietIntensity] || 550;

  // 활동량 -> 계수 매핑
  const activityFactors = {
    '매우 적음': 1.2,
    '적음': 1.375,
    '보통': 1.55,
    '많음': 1.725,
    '매우 많음': 1.9,
  };

  // 기초대사량 계산
  const calculateBMR = () => {
    const { gender, age, height, currentWeight } = data;
    if(!gender || !age || !height || !currentWeight) return 0;

    const w = parseFloat(currentWeight);
    const h = parseFloat(height);
    const a = parseInt(age);

    if(gender === '남성'){
      return Math.round(10 * w + 6.25 * h - 5 * a + 5);
    }
    else{
      return Math.round(10 * w + 6.25 * h - 5 * a - 161);
    }
  };

  useEffect(() => {
    const bmrVal = calculateBMR();
    const factor = activityFactors[data.activityLevel] || 1.2;
    const tdeeVal = Math.round(bmrVal * factor);
    // const target = tdeeVal - 200; // 예시: 감량 목표로 200kcal 감산

    let recommendedCal = tdeeVal - 200;
    let weeksToGoal = 0;

    const cw = parseFloat(data.currentWeight);
    const tw = parseFloat(data.targetWeight);
    const diff = cw - tw;

    weeksToGoal = Math.ceil(diff * 7700 / (deficitPerDay * 7));
    recommendedCal = tdeeVal - deficitPerDay;

    const future = new Date();
    future.setDate(future.getDate() + weeksToGoal * 7);
    const dateString = future.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    // }

    setBmr(bmrVal);
    setTdee(tdeeVal);
    setRecommended(recommendedCal);
    setCustomCalories(String(recommendedCal));
    setWeeks(weeksToGoal);
    setFinalTargetDate(dateString);
  }, [data, dietIntensity]);

  const handleNext = () => {
    setData(prev => ({ 
      ...prev, 
      targetCalories: recommended,
      dietIntensity,
      targetDate: finalTargetDate, 
    }));
    onNext();
  };

  const isValid = customCalories;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>추천 계획 완성!{'\n'}목표를 바꿀 수도 있어요</Text>

      <View style={styles.inputBlock}>
      <Text style={{ fontSize: 16, marginBottom: 4 }}>🔥 내 기초 대사량</Text>
        <Text style={{ fontSize: 18, fontWeight: '500', marginBottom: 12 }}>{bmr} kcal</Text>

        <Text style={{ fontSize: 16, marginBottom: 4 }}>👟 내 활동 대사량</Text>
        <Text style={{ fontSize: 18, fontWeight: '500', marginBottom: 12 }}>{tdee} kcal</Text>

        <Text style={{ fontSize: 16, marginBottom: 4 }}>🎯 내 목표 칼로리</Text>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 4 }}>
          {customCalories} kcal
        </Text>
      </View>

      <Text style={{ color: '#888', marginBottom: 32 }}>
        목표 달성까지 약 {weeks}주 걸려요
      </Text>

      <Text style={[styles.inputLabel, { marginTop: 24 }]}>다이어트 강도</Text>
      <View style={styles.row}>
        {intensityOptions.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.genderButton,
              dietIntensity === option && styles.genderButtonActive,
            ]}
            onPress={() => setDietIntensity(option)}
          >
            <Text style={styles.genderText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 버튼 Row: 이전 & 다음 */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.pairButton, styles.prevButton]}
          onPress={onBack}
        >
          <Text style={styles.prevButtonText}>이전</Text>
        </TouchableOpacity>

        <View style={styles.pairButtonSpacer} />

        <TouchableOpacity
          style={[styles.pairButton, styles.nextButton, !isValid && styles.disabledButton]}
          onPress={handleNext}
          disabled={!isValid}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Step3GoalCalories