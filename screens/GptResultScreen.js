import React from 'react';
import {  View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/GptResultStyle";

const GptResultComponent = ({ route }) => {
  const { result } = route.params;
  const navigation = useNavigation();

  if(!result || !result.식단) return null;

  const formatCell = (text) => {
    if (!text) return '';
    return text
      .replace(/\)\s*,\s*/g, ')\n')   // “),” → “)\n”
      .replace(/\s*\(\s*/g, '\n(');   // “(” 앞에 줄바꿈
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI 추천 식단(7일)</Text>

      <ScrollView style={styles.list} nestedScrollEnabled>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>날짜</Text>
            <Text style={styles.tableHeader}>아침</Text>
            <Text style={styles.tableHeader}>점심</Text>
            <Text style={styles.tableHeader}>저녁</Text>
          </View>
          {Object.keys(result.식단).map((day, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{day}</Text>
              <Text style={styles.tableCell}>{formatCell(result.식단[day].아침)}</Text>
              <Text style={styles.tableCell}>{formatCell(result.식단[day].점심)}</Text>
              <Text style={styles.tableCell}>{formatCell(result.식단[day].저녁)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {result.운동 && (
        <>
          <Text style={styles.title}>AI 추천 운동 목표</Text>
          <View style={styles.exercise}>
            <View style={styles.exerciseRow}>
              <Text style={styles.exerciseLabel}>하루 목표 빠른 걸음 수:</Text>
              <Text style={styles.exerciseValue}>{result.운동['하루 목표 빠른 걸음 수']}</Text>
            </View>
          </View>
        </>
      )}

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.replace('Main')}
      >
        <Text style={styles.nextButtonText}>완료</Text>
      </TouchableOpacity>

    </View>
  )
}

export default GptResultComponent

