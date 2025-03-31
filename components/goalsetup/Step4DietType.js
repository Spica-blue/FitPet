import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from "../../styles/StepStyle";

const Step4DietType = ({ data, setData, onFinish, onBack }) => {
  const [selectedType, setSelectedType] = useState(data.dietType || '');

  const dietOptions = [
    {
      key: '일반',
      label: '균형 잡힌 탄단지 구성',
      icon: require('../../assets/icons/diet_normal.png'),
    },
    {
      key: '운동',
      label: '단백질을 늘려 근육 생성에 집중',
      icon: require('../../assets/icons/diet_exercise.png'),
    },
    {
      key: '키토',
      label: '탄수화물 제한 & 건강한 지방 섭취',
      icon: require('../../assets/icons/diet_keto.png'),
    },
    {
      key: '비건',
      label: '동물성 음식 대신 채식 위주로 진행',
      icon: require('../../assets/icons/diet_vegan.png'),
    },
  ];

  const handleNext = () => {
    setData(prev => ({ ...prev, dietType: selectedType }));
    onFinish();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        마지막으로 식단 계획 선택!{'\n'}식단에 맞는 탄단지 섭취량도 계산해 볼게요
      </Text>

      {dietOptions.map(option => (
        <TouchableOpacity
          key={option.key}
          style={[
            styles.dietOption,
            selectedType === option.key && styles.dietOptionActive,
          ]}
          onPress={() => setSelectedType(option.key)}
        >
          <Image source={option.icon} style={styles.dietIcon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.dietTitle}>{option.key}</Text>
            <Text style={styles.dietDesc}>{option.label}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.nextButton, !selectedType && styles.disabledButton]}
        onPress={handleNext}
        disabled={!selectedType}
      >
        <Text style={styles.nextButtonText}>완료</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Step4DietType