import React from 'react';
import {  View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/GptResultStyle";

const GptResultComponent = ({ route }) => {
  const { result } = route.params;
  const navigation = useNavigation();

  if(!result || !result.식단) return null;

  return (
    <View style={styles.resultContainer}>
      <Text style={styles.resultTitle}>AI 추천 식단</Text>

      <ScrollView style={{ maxHeight: 300 }} nestedScrollEnabled>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>일</Text>
            <Text style={styles.tableHeader}>아침</Text>
            <Text style={styles.tableHeader}>점심</Text>
            <Text style={styles.tableHeader}>저녁</Text>
          </View>
          {Object.keys(result.식단).map((day, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{day}</Text>
              <Text style={styles.tableCell}>{result.식단[day].아침}</Text>
              <Text style={styles.tableCell}>{result.식단[day].점심}</Text>
              <Text style={styles.tableCell}>{result.식단[day].저녁}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {result.운동 && (
        <View style={styles.exerciseContainer}>
          <Text style={styles.exerciseTitle}>AI 추천 운동 목표</Text>
          <View style={styles.exerciseRow}>
            <Text style={styles.exerciseLabel}>하루 목표 빠른 걸음 수:</Text>
            <Text style={styles.exerciseValue}>{result.운동['하루 목표 빠른 걸음 수']}</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.replace('Home')}
      >
        <Text style={styles.nextButtonText}>완료</Text>
      </TouchableOpacity>

    </View>
  )
}

export default GptResultComponent

