import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import styles from "../../styles/StepStyle";

const Step1BasicInfo = ({ data, setData, onNext }) => {
  const [localData, setLocalData] = useState({
    gender: data.gender || '',
    age: data.age || '',
    height: data.height || '',
    activityLevel: data.activityLevel || '',
  });

  const activityLevels = ['매우 적음', '적음', '보통', '많음', '매우 많음'];
  const activityIcons = [
    require('../../assets/icons/activity1.png'),
    require('../../assets/icons/activity2.png'),
    require('../../assets/icons/activity3.png'),
    require('../../assets/icons/activity4.png'),
    require('../../assets/icons/activity5.png'),
  ];

  const handleSelect = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  }

  const handleNext = () => {
    setData(prev => ({ ...prev, ...localData }));
    onNext();
  };

  const isValid = localData.gender && localData.age && localData.height && localData.activityLevel;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>맞춤 목표 계산 시작!{'\n'}기본 정보를 알려주세요</Text>

      {/* 성별 선택 */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.genderButton, localData.gender === '여성' && styles.genderButtonActive]}
          onPress={() => handleSelect('gender', '여성')}
        >
          <Image source={require('../../assets/icons/female.png')} style={styles.genderIcon} />
          <Text style={styles.genderText}>여성</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[styles.genderButton, localData.gender === '남성' && styles.genderButtonActive]}
            onPress={() => handleSelect('gender', '남성')}
          >
          <Image source={require('../../assets/icons/male.png')} style={styles.genderIcon} />
          <Text style={styles.genderText}>남성</Text>
        </TouchableOpacity>
      </View>

      {/* 나이 / 키 입력 */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="나이"
          value={localData.age.toString()}
          onChangeText={(text) => handleSelect('age', text)}
        />
        <Text style={styles.unitText}>세</Text>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="키"
          value={localData.height.toString()}
          onChangeText={(text) => handleSelect('height', text)}
        />
        <Text style={styles.unitText}>cm</Text>
      </View>

      {/* 활동량 선택 */}
      <View style={styles.activityRow}>
        {activityLevels.map((level, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.activityButton,
              localData.activityLevel === level && styles.activityButtonActive,
            ]}
            onPress={() => handleSelect('activityLevel', level)}
          >
            <Image source={activityIcons[idx]} style={styles.activityIcon} />
            <Text style={styles.activityLabel}>{level}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 다음 버튼 */}
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

export default Step1BasicInfo