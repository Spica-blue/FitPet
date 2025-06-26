import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from "../../styles/MealStyles";

const DinnerInput = ({ value, onChange }) => {
  return (
    <View style={styles.mealContainer}>
      <View style={styles.mealHeader}>
        <FontAwesome5 name="fish" size={20} />
        <Text style={styles.mealTitle}>저녁 식단</Text>
      </View>

      <TextInput
        style={styles.textInput}
        placeholder="오늘 저녁에 드신 식단을 입력하세요"
        multiline
        value={value}
        onChangeText={onChange}
      />
    </View>
  )
}

export default DinnerInput