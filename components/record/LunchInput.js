import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from "../../styles/MealStyles";

const LunchInput = ({ value, onChange }) => {
  return (
    <View style={styles.mealContainer}>
      <View style={styles.mealHeader}>
        <FontAwesome5 name="hamburger" size={20} />
        <Text style={styles.mealTitle}>점심 식단</Text>
      </View>

      <TextInput
        style={styles.textInput}
        placeholder="오늘 점심에 드신 식단을 입력하세요"
        multiline
        value={value}
        onChangeText={onChange}
      />
    </View>
  )
}

export default LunchInput