import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from "../../styles/StepStyle";

const Step2WeightInfo = ({ data, setData, onNext, onBack }) => {
  const [localData, setLocalData] = useState({
    currentWeight: data.currentWeight || '',
    targetWeight: data.targetWeight || ''
  });

  const handleChange = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value}));
  };

  const handleNext = () => {
    setData(prev => ({ ...prev, ...localData }));
    onNext();
  };

  const isValid = localData.currentWeight && localData.targetWeight;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>목표 체중도 알려주시면{'\n'}추천 계획을 짜볼게요</Text>

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

      <TouchableOpacity
        style={[styles.nextButton, !isValid && styles.disabledButton]}
        onPress={handleNext}
        disabled={!isValid}
      >
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Step2WeightInfo