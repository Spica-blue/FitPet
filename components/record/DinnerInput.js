import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from "../../styles/MealStyles";

const DinnerInput = ({ value, onChange, onSave }) => {
  return (
    <View style={styles.mealContainer}>
      <View style={styles.mealHeader}>
        <FontAwesome5 name="fish" size={20} />
        <Text style={styles.mealTitle}>저녁 식단</Text>
      </View>
      <TextInput
        style={styles.textInput}
        placeholder="저녁에 먹은 식단을 입력하세요"
        multiline
        value={value}
        onChangeText={onChange}
      />
      <TouchableOpacity
        style={styles.saveButton}
        onPress={async () => {
          try {
            await onSave();  // RecordScreen에서 넘어온 저장 함수
            Alert.alert('저장 완료', '저녁 식단이 저장되었습니다.');
          } catch (e) {
            console.error(e);
            Alert.alert('저장 실패', '서버에 저장하는 중 오류가 발생했습니다.');
          }
        }}
      >
        <Text style={styles.saveButtonText}>저장</Text>
      </TouchableOpacity>
    </View>
  )
}

export default DinnerInput