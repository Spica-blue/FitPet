import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from "../../styles/StepStyle";

const Step2WeightInfo = ({ data, setData, onNext, onBack }) => {
  const [localData, setLocalData] = useState({
    currentWeight: data.currentWeight || '',
    targetWeight: data.targetWeight || '',
    targetDate: data.targetDate || '',
  });

  const handleChange = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value}));
  };

  const handleNext = () => {
    setData(prev => ({ ...prev, ...localData }));
    onNext();
  };

  // 목표 체중 검사
  const heightNum = parseFloat(data.height);
  const minAllowed = (13 * heightNum * heightNum / 10000).toFixed(1);
  const maxAllowed = (35 * heightNum * heightNum / 10000).toFixed(1);
  const targetNum = parseFloat(localData.targetWeight);
  const isInSafeRange = targetNum >= minAllowed && targetNum <= maxAllowed;

  const isValid = localData.currentWeight && localData.targetWeight && isInSafeRange;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>목표 체중도 알려주시면{'\n'}추천 계획을 짜볼게요</Text>

      {/* 시작 체중 */}
      <View style={styles.inputBlock}>
        <Text style={styles.inputLabel}>시작 체중</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="00.0"
            value={localData.currentWeight.toString()}
            onChangeText={(text) => handleChange('currentWeight', text)}
          />
          <Text style={styles.unitText}>kg</Text>
        </View>
      </View>

      {/* 목표 체중 */}
      <View style={styles.inputBlock}>
        <Text style={styles.inputLabel}>목표 체중</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="00.0"
            value={localData.targetWeight.toString()}
            onChangeText={(text) => handleChange('targetWeight', text)}
          />
          <Text style={styles.unitText}>kg</Text>
        </View>
      </View>
      
      {/* BMI 경고 */}
      {heightNum && localData.targetWeight && !isInSafeRange && (
        <Text style={{ color: 'tomato', marginBottom: 16 }}>
          신체 정보로 정상 체중 범위를 계산했어요{'\n'}
          <Text style={{ fontWeight: 'bold' }}>{minAllowed}kg ~ {maxAllowed}kg</Text> 내에서 목표를 입력해 주세요
        </Text>
      )}

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

export default Step2WeightInfo