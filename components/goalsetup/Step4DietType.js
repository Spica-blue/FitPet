import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Button, ScrollView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from "../../styles/StepStyle";
import { sendUserInfoToServer, requestGptRecommendation } from '../../utils/UserAPI';

const Step4DietType = ({ data, setData, navigation, onBack }) => {
  const [selectedType, setSelectedType] = useState(data.dietType || '');
  const [allergyInput, setAllergyInput] = useState('');
  const [allergy, setAllergy] = useState(data.allergy || []);
  const [loading, setLoading] = useState(false);
  const [gptResult, setGptResult] = useState(null);

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

  const handleAddAllergy = () => {
    if (allergyInput && !allergy.includes(allergyInput.trim())) {
      setAllergy([...allergy, allergyInput.trim()]);
      setAllergyInput(""); // 입력란 초기화
    } else {
      Alert.alert("알레르기 추가 실패", "이미 존재하는 알레르기입니다.");
    }
  };

  const handleRemoveAllergy = (item) => {
    setAllergy(allergy.filter((allergen) => allergen !== item));
  };

  const handleNext = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    const parsed = JSON.parse(userInfo);
    const email = parsed?.email || parsed?.kakao_account?.email || '';
    
    const finalData = {
      ...data,
      dietType: selectedType,
      age: Number(data.age),
      height: Number(data.height),
      currentWeight: Number(data.currentWeight),
      targetWeight: Number(data.targetWeight),
      email,
      allergy,
    };
    setData(finalData);
    console.log('✅ 최종 입력 데이터:', finalData);

    setLoading(true); // ✅ 로딩 시작
    
    const response = await sendUserInfoToServer(finalData);
    if (!response.success) {
      setLoading(false); // 실패 시 로딩 종료
      console.error("서버 전송 실패:", response.error);
      Alert.alert("서버 오류", "유저 정보를 저장하지 못했어요.");
      return;
    }

    const gptResponse = await requestGptRecommendation(finalData);
    setLoading(false);
      
    if (gptResponse.success) {
      console.log("📦 GPT 응답 타입:", typeof gptResponse.data.recommendation);
      
      // const parsedResult = JSON.parse(gptResponse.data.recommendation); // json 파싱
      navigation.replace("GptResult", { result: gptResponse.data.recommendation });
      // setGptResult(JSON.parse(gptResponse.data.recommendation));
      console.log("GPT 결과:", gptResponse.data);
    } else {
      console.error("GPT 요청 실패:", gptResponse.error);
      Alert.alert("오류", "GPT 추천 요청에 실패했어요.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        마지막으로 식단 계획 선택!{'\n'}식단에 맞는 탄단지 섭취량도 계산해 볼게요
      </Text>

      {/* 알레르기 입력 영역 */}
      <View style={styles.inputBlock}>
        <Text style={styles.inputLabel}>알레르기 입력</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="예: 유제품, 견과류"
            value={allergyInput}
            onChangeText={setAllergyInput}
          />
          <Button title="추가" onPress={handleAddAllergy} />
        </View>
        {/* {allergy.length > 0 && (
          <Text style={{ marginTop: 8, fontSize: 14, color: '#333' }}>
            입력한 알레르기: {allergy.join(', ')}
          </Text>
        )} */}
        <Text>알레르기 목록</Text>
        {allergy.length > 0 && (
          <ScrollView style={styles.allergyList}>
            {allergy.map((item, index) => (
              <View key={index} style={styles.allergyItem}>
                <Text>{item}</Text>
                <TouchableOpacity onPress={() => handleRemoveAllergy(item)}>
                  <Text style={styles.removeText}>삭제</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

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
          style={[styles.pairButton, styles.nextButton, !selectedType && styles.disabledButton]}
          onPress={handleNext}
          disabled={!selectedType}
        >
          <Text style={styles.nextButtonText}>완료</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        // <View style={{ marginVertical: 24, alignItems: 'center' }}>
        //   <ActivityIndicator size="large" color="#007AFF" />
        //   <Text style={{ marginTop: 12, fontSize: 16 }}>AI 추천을 생성 중입니다...</Text>
        // </View>
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>
              AI 식단/운동 추천 중...{"\n"}(약 30초 소요)
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}

export default Step4DietType