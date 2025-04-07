import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from "../styles/GoalSetupScreenStyle";
import Step1BasicInfo from '../components/goalsetup/Step1BasicInfo';
import Step2WeightInfo from '../components/goalsetup/Step2WeightInfo';
import Step3GoalCalories from '../components/goalsetup/Step3GoalCalories';
import Step4DietType from '../components/goalsetup/Step4DietType';

const GoalSetupScreen = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    height: '',
    activityLevel: '',
    currentWeight: '',
    targetWeight: '',
    targetDate: '',
    targetCalories: '',
    dietIntensity: '',
    dietType: '',
    allergy: '',
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.replace("Onboarding")} style={styles.backStep}>
        <Text style={styles.backStepText}>← 뒤로가기</Text>
      </TouchableOpacity>
      {step === 1 && (
        <Step1BasicInfo data={formData} setData={setFormData} onNext={nextStep} />
      )}
      {step === 2 && (
        <Step2WeightInfo data={formData} setData={setFormData} onNext={nextStep} onBack={prevStep} />
      )}
      {step === 3 && (
        <Step3GoalCalories data={formData} setData={setFormData} onNext={nextStep} onBack={prevStep} />
      )}
      {step === 4 && (
        <Step4DietType
          data={formData}
          setData={setFormData}
          // onFinish={() => {
          //   console.log("최종 저장할 데이터 : ", formData);
          //   // TODO: 서버 전송 API 연결
          // }}
          onBack={prevStep}
          navigation={navigation}
        />
      )}
    </View>
  )
}

export default GoalSetupScreen