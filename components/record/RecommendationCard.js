import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from "../../styles/GptResultStyle";

const RecommendationCard = ({ recommendation }) => {
  // console.log('[RecommendationCard]', recommendation);

  // recommendation 자체가 없거나, recommendations 프로퍼티가 없으면 아무것도 렌더링하지 않음
  if(!recommendation || !recommendation.recommendations){
    return(
      <View style={styles.recommendationContainer}>
        <MaterialCommunityIcons name="robot" size={36} />
        <Text style={styles.placeholder}>AI 추천 결과가 없습니다.</Text>
      </View>
    );
  }

  // 실제 데이터는 recommendation.recommendations 안에 들어있음
  const { recommendations, createdAt, created_at } = recommendation;

  // 날짜 표시용: asOf(사용자가 지정한 기준) 또는 created_at(저장된 타임스탬프)
  // const 기준날짜 = created_at.split('T')[0];
  const 기준날짜 = created_at
    ? created_at.split("T")[0]
    : createdAt
    ? createdAt.split("T")[0]
    : "";

  // guard: 혹시 안 찍혀있으면 빈 객체
  const 식단 = recommendations.식단 || {};
  const 운동 = recommendations.운동 || {};

  const formatCell = (text) => {
    if (!text) return '';
    return text
      .replace(/\)\s*,\s*/g, ')\n')   // “),” → “)\n”
      .replace(/\s*\(\s*/g, '\n(');   // “(” 앞에 줄바꿈
  };

  return (
    <View style={styles.recommendationContainer}>
      <Text style={styles.subtitle}>추천 받은 날짜: {기준날짜}</Text>
      <Text style={styles.title}>AI 추천 식단</Text>
      <ScrollView style={styles.recList} nestedScrollEnabled>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>날짜</Text>
            <Text style={styles.tableHeader}>아침</Text>
            <Text style={styles.tableHeader}>점심</Text>
            <Text style={styles.tableHeader}>저녁</Text>
          </View>
          {Object.entries(식단).map(([day, meals], idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.tableCell}>{day}</Text>
              <Text style={styles.tableCell}>{formatCell(meals.아침)}</Text>
              <Text style={styles.tableCell}>{formatCell(meals.점심)}</Text>
              <Text style={styles.tableCell}>{formatCell(meals.저녁)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {Object.keys(운동).length > 0 && (
        <>
          <Text style={styles.title}>AI 추천 운동</Text>
          <View style={styles.exercise}>
            {Object.entries(운동).map(([label, value], i) => (
              <View key={i} style={styles.exerciseRow}>
                <Text style={styles.exerciseLabel}>{label} :</Text>
                <Text style={styles.exerciseValue}>{value}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  )
}

export default RecommendationCard