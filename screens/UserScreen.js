import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import styles from "../styles/tab/UserScreenStyle";
import Account from '../components/Account';

const screenWidth = Dimensions.get('window').width;

const UserScreen = () => {
  const navigation = useNavigation();
  const [stepsData] = useState([2000, 4509, 1811, 4103, 2907, 10502, 385]);
  const labels = ['일','월','화','수','목','금','오늘'];

  return (
    <View style={styles.container}>
      <Account navigation={navigation} />
    </View>
    // <ScrollView contentContainerStyle={styles.container}>
    //   {/* 상단 프로필 영역 */}
    //   <View style={styles.profileCard}>
    //     <View style={styles.statsRow}>
    //       <View style={styles.stat}>
    //         <Text style={styles.statIcon}>🍽️</Text>
    //         <Text style={styles.statLabel}>일반식단</Text>
    //       </View>
    //       <View style={styles.stat}>
    //         <Text style={styles.statIcon}>🎯</Text>
    //         <Text style={styles.statValue}>50kg</Text>
    //       </View>
    //       <View style={styles.stat}>
    //         <Text style={styles.statIcon}>😊</Text>
    //         <Text style={styles.statValue}>-0kg</Text>
    //       </View>
    //     </View>
    //     <View style={styles.avatar}>
    //       <Text style={{ fontSize: 40 }}>🙂</Text>
    //     </View>
    //     <Text style={styles.username}>은진1bba5f!</Text>
    //     <Text style={styles.subText}>피드 0 · 팔로워 0 · 팔로잉 0</Text>
    //     <Text style={styles.subText}>소개말이 없어요</Text>
    //     <View style={styles.buttons}>
    //       <TouchableOpacity style={styles.outlineBtn}>
    //         <Text>목표 변경</Text>
    //       </TouchableOpacity>
    //       <TouchableOpacity
    //         style={styles.filledBtn}
    //         onPress={() => navigation.navigate('Settings')}
    //       >
    //         <Text style={{ color: '#fff' }}>프로필 수정</Text>
    //       </TouchableOpacity>
    //     </View>
    //   </View>

    //   {/* 하단 걸음 차트 */}
    //   <View style={styles.chartCard}>
    //     <Text style={styles.chartTitle}>내 걸음 분석</Text>
    //     <BarChart
    //       data={{ labels, datasets: [{ data: stepsData }] }}
    //       width={screenWidth - 32}
    //       height={220}
    //       fromZero
    //       showValuesOnTopOfBars
    //       chartConfig={{
    //         backgroundGradientFrom: '#fff',
    //         backgroundGradientTo: '#fff',
    //         decimalPlaces: 0,
    //         propsForLabels: { fontSize: 12 },
    //         fillShadowGradientOpacity: 1,
    //         barPercentage: 0.5,
    //         color: () => `rgba(0,0,0,0.8)`,
    //       }}
    //       style={{ borderRadius: 8 }}
    //     />
    //   </View>
    // </ScrollView>
  )
}

export default UserScreen;