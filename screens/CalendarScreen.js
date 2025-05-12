import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Calendar from '../components/Calendar';
import styles from "../styles/tab/CalendarScreenStyle";

const CalenderScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  // AsyncStorage에서 이미 작성된 일기 날짜 로드
  useEffect(() => {
    (async () =>{
      const keys = await AsyncStorage.getAllKeys();
      const dateKeys = keys.filter(k => k.startsWith('diary-'));
      const marks = {};
      
      dateKeys.forEach(k => {
        const date = k.replace('diary-', '');
        marks[date] = { marked: true, dotColor: '#F44336' };
      });

      setMarkedDates(marks);
      setLoading(false);
    })();
  }, []);

  const onDayPress = day => {
    setSelectedDate(day.dateString);
  }

  // 한 달 전/다음 월로 이동
  const changeMonth = offset => {
    setCurrentDate(prev => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + offset);
      return next;
    });
    // 선택일 초기화 (원하면 지우거나 유지하세요)
    setSelectedDate(null);
  };

  // GestureRecognizer 설정
  const swipeConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <GestureRecognizer
          style={{ flex: 1 }}
          onSwipeLeft={() => changeMonth(1)}
          onSwipeRight={() => changeMonth(-1)}
          config={swipeConfig}
        >
          <View style={styles.calendarContainer}>
            <Calendar
              key={currentDate.toISOString().slice(0, 7)}
              // 현재 렌더링할 월 지정 (YYYY-MM-DD)
              current={currentDate.toISOString().slice(0, 10)}
              markedDates={{
                ...markedDates,
                ...(selectedDate
                  ? { [selectedDate]: { selected: true, selectedColor: '#2196F3' } }
                  : {}
                ),
              }}
              onDayPress={onDayPress}
            />
          </View>

          {selectedDate && (
            <View style={styles.footer}>
              <Text style={styles.dateLabel}>
                {selectedDate} 일기
              </Text>
              <Button
                title='일기 쓰기'
                onPress={() => navigation.navigate('DiaryEntry', { date: selectedDate })}
              />
            </View>
          )}
        </GestureRecognizer>
      )}
    </View>
  )
}

export default CalenderScreen