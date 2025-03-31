import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import styles from "../../styles/StepStyle";

const Step3GoalCalories = ({ data, setData, onNext, onBack }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [customCalories, setCustomCalories] = useState(data.targetCalories?.toString() || '');
  const [bmr, setBmr] = useState(0);
  const [tdee, setTdee] = useState(0);
  const [recommended, setRecommended] = useState(0);

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
    const target = tdeeVal - 200; // 예시: 감량 목표로 200kcal 감산

    setBmr(bmrVal);
    setTdee(tdeeVal);
    setRecommended(target);
    setCustomCalories(String(target));
  }, [data]);

  const handleNext = () => {
    setData(prev => ({ ...prev, targetCalories: Number(customCalories) || recommendedCalories }));
    onNext();
  };

  const isValid = customCalories;
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

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
        
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={{ color: '#007AFF', fontWeight: '500' }}>목표 수정</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ color: '#888', marginBottom: 32 }}>
        목표 달성까지 약 19주 걸려요
      </Text>

      <TouchableOpacity
        style={[styles.nextButton, !isValid && styles.disabledButton]}
        onPress={handleNext}
        disabled={!isValid}
      >
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>

      {/* 목표 수정 모달 */}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            width: '80%',
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: 16, marginBottom: 12 }}>목표 섭취 칼로리 입력</Text>
            <TextInput
              style={{
                width: '100%',
                borderBottomWidth: 1,
                borderColor: '#ccc',
                fontSize: 20,
                paddingVertical: 8,
                textAlign: 'center',
                marginBottom: 16,
              }}
              keyboardType="numeric"
              value={customCalories}
              onChangeText={setCustomCalories}
            />
            <TouchableOpacity
              style={[styles.nextButton, { width: '100%' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.nextButtonText}>완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Step3GoalCalories