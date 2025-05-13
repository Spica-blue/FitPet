import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, ActivityIndicator, AppState, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import GestureRecognizer from 'react-native-swipe-gestures';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchCalendarNote, deleteCalendarNote } from '../utils/UserAPI';
import Calendar from '../components/Calendar';
import styles from "../styles/tab/CalendarScreenStyle";

const CalenderScreen = ({ navigation }) => {
  // const [selectedDate, setSelectedDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [diary, setDiary] = useState(null);
  const [loadingDiary, setLoadingDiary] = useState(false);

  const appState = useRef(AppState.currentState);
  const isFocused = useIsFocused();

  // 서버에서 email 불러오는 유틸
  const getEmail = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    const parsed = JSON.parse(userInfo) || {};
    return parsed.email || parsed.kakao_account?.email || '';
  };

  // 날짜 선택 시 → 로컬/서버에서 일기 불러오기
  const loadDiary = async (date) => {
    setLoadingDiary(true);
    const email = await getEmail();
    // 1) 로컬
    const local = await AsyncStorage.getItem(`diary-${date}`);
    let content = local || '';
    // 2) 서버
    const res = await fetchCalendarNote(email, date);
    // console.log("res:",res);
    if (res.success && res.data?.note) {
      console.log("일기 조회 성공");
      content = res.data.note;
    }
    setDiary(content);
    setLoadingDiary(false);
  };

  // 달력에서 날짜 누르면
  const onDayPress = ({ dateString }) => {
    setSelectedDate(dateString);
    loadDiary(dateString);
  };

  // 삭제 버튼
  const onDelete = async () => {
    Alert.alert(
      '정말 삭제할까요?',
      `${selectedDate} 일기를 삭제합니다.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            const email = await getEmail();
            // 1) 서버 삭제
            const res = await deleteCalendarNote(email, selectedDate);
            if (!res.success) {
              return Alert.alert('삭제 실패', '서버에서 삭제하지 못했습니다.');
            }
            // 2) 로컬 삭제
            await AsyncStorage.removeItem(`diary-${selectedDate}`);
            // 화면 업데이트
            setDiary(null);
            // (원하면 마킹 리프레시 호출)
            Alert.alert('삭제 완료');
          }
        }
      ]
    );
  };

  // 로컬에 실제 기록된 날짜에 해당하는 키 markedDates 생성
  const loadMarks = async () => {
    setLoading(true);
    const email = await getEmail();

    // 1) 앱에 저장된 모든 키 가져오기
    const allKeys = await AsyncStorage.getAllKeys();
    console.log('🍱 AsyncStorage Keys:', allKeys);

    // 2) 이번 달(예: "2025-05")에 해당하는 step과 goal 키만 필터링
    // const year  = currentDate.getFullYear();
    // const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // "05"
    // const prefixStep = `stepCount_${email}_${year}-${month}-`;
    // const prefixGoal = `goalSteps_${email}_${year}-${month}-`;

    // step 키들 (날짜별로 하나씩)
    // const stepKeys = allKeys.filter(k => k.startsWith(prefixStep));
    const stepKeys = allKeys.filter(k => k.startsWith(`stepCount_${email}_`));
    // goal 키들
    // const goalKeys = allKeys.filter(k => k.startsWith(prefixGoal));
    const goalKeys = allKeys.filter(k => k.startsWith(`goalSteps_${email}_`));

    // 3) multiGet 으로 한 번에 불러오기
    const stores = await AsyncStorage.multiGet([...stepKeys, ...goalKeys]);
    const cache  = Object.fromEntries(stores);

    // 4) 날짜별로 marks 생성
    const marks = {};
    stepKeys.forEach(key => {
      // key = "stepCount_email_2025-05-12"
      // const dateStr = key.slice(prefixStep.length); // "12" 이후 포함, actually "2025-05-12"
      // 'stepCount_email_2025-05-13' → ['stepCount', 'email', '2025-05-13']
      // const parts = key.split('_');
      // const dateStr = parts[parts.length - 1];  
      const dateStr = key.split('_').pop();
      const steps = parseInt(cache[key], 10) || 0;
      const goalKey = `goalSteps_${email}_${dateStr}`;
      const goal = parseInt(cache[goalKey], 10) || 0;
      const success = goal > 0 && steps >= goal;

      marks[dateStr] = {
        customStyles: {
          container: { 
            backgroundColor: success ? '#4CAF50' : '#F44336' 
          },
          text: { 
            color: 'white' 
          },
        },
        dots: []
      };
    });

    // const monthStart = new Date(currentDate);
    // monthStart.setDate(1);
    // const base = monthStart.toISOString().slice(0,10);
    // // const marks = {};

    // // 31일치 키 목록 생성
    // const dates = Array.from({ length: 31 }, (_, i) => 
    //   offsetDateString(base, -i)
    // );
    // const stepKeys = dates.map(d => `stepCount_${email}_${d}`);
    // const goalKeys = dates.map(d => `goalSteps_${email}_${d}`);
    // const allKeys = [...stepKeys, ...goalKeys];

    // // multiGet으로 한 번에 불러오기
    // const stores = await AsyncStorage.multiGet(allKeys);

    // // { key: value } 형태로 변환
    // const cache = Object.fromEntries(stores);

    // const marks = {};
    // dates.forEach(dateStr => {
    //   const steps   = parseInt(cache[`stepCount_${email}_${dateStr}`], 10) || 0;
    //   const goal    = parseInt(cache[`goalSteps_${email}_${dateStr}`], 10)  || 0;
    //   const succeeded = goal > 0 && steps >= goal;

    //   marks[dateStr] = {
    //     customStyles: {
    //       container: {
    //         backgroundColor: succeeded ? '#4CAF50' : '#F44336',
    //       },
    //       text: { color: 'white' },
    //     }
    //   };
    // });

    // for(let i=0;i<31;i++){
    //   const dateStr = offsetDateString(base, -i);
      
    //   // 1) 걸음 수
    //   const stepRes = await fetchStepByDate(email, dateStr);

    //   // 2) 목표 걸음 수
    //   const recRes = await fetchRecommendationByDate(email, dateStr);
    //   if(!stepRes.success || !recRes.success) continue;

    //   const steps = stepRes.data.steps;
    //   const rawGoal = recRes.data?.recommendations?.운동?.["하루 목표 빠른 걸음 수"] ?? '';
    //   const goal = parseInt(rawGoal.split('(')[0],10) || 0;

    //   // 달성 여부 : 목표 > 0 && steps >= goal
    //   const succeeded = goal > 0 && steps >= goal;

    //   marks[dateStr] = {
    //     customStyles: {
    //       container: {
    //         backgroundColor: succeeded ? '#4CAF50' : '#F44336',
    //       },
    //       text: {
    //         color: 'white',
    //       },
    //     }
    //   };
    // }

    // 3) 일기 작성된 날짜 찾기
    const diaryKeys = allKeys.filter(k => k.startsWith('diary-'));
    diaryKeys.forEach(key => {
      const dateStr = key.replace('diary-','');
      // 이미 step 표시된 날짜라면 기존 스타일에 테두리 추가
      if(!marks[dateStr]){
        // 만보기 기록이 없던 날도 dots만 표시 가능하도록 초기화
        marks[dateStr] = { dots: [] };
      }
      marks[dateStr].dots.push({ key: 'diary', color: '#2196F3' });
    });

    setMarkedDates(marks);
    setLoading(false);
  };

  // diary 캐시 삭제
  // async function clearLocalDiaryCache() {
  //   // 1) 저장된 모든 키를 가져와서
  //   const allKeys = await AsyncStorage.getAllKeys();
  //   // 2) diary- 로 시작하는 키만 필터
  //   const diaryKeys = allKeys.filter(k => k.startsWith('diary-'));
  //   if (diaryKeys.length > 0) {
  //     // 3) 한 번에 제거
  //     await AsyncStorage.multiRemove(diaryKeys);
  //     console.log(`로컬 캐시 삭제: ${diaryKeys.join(', ')}`);
  //   }
  // }

  // 앱 활성화 될 때마다 다시 로드
  useEffect(() => {
    // diary 캐시 삭제
    // clearLocalDiaryCache();
    const sub = AppState.addEventListener('change', next => {
      if(appState.current.match(/inactive|background/) && next === 'active'){
        loadMarks();
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, []);

  // 탭 포커스될 때마다 다시 로드
  useEffect(() => {
    if(isFocused) loadMarks();
    
    if (isFocused && selectedDate) {
      loadDiary(selectedDate);
    }
  }, [isFocused]);

  // 한 달 전/다음 월로 이동
  const changeMonth = offset => {
    setCurrentDate(prev => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + offset);
      return next;
    });
    // 선택일 초기화 (원하면 지우거나 유지하세요)
    // setSelectedDate(null);
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
            {(() => {
              // 1) 기존 markedDates 복사
              const displayMarks = { ...markedDates };
              // 2) 선택된 날짜가 있으면 파란색 선택 마킹 추가
              if (selectedDate) {
                displayMarks[selectedDate] = {
                  ...(displayMarks[selectedDate] || {}),
                  selected: true,
                  selectedColor: '#2196F3',
                };
              }
              return (
                <Calendar
                  key={currentDate.toISOString().slice(0, 7)}
                  current={currentDate.toISOString().slice(0, 10)}
                  markingType="multi-dot"
                  markedDates={displayMarks}
                  onDayPress={onDayPress}
                />
              );
            })()}
            {/* <Calendar
              key={currentDate.toISOString().slice(0, 7)}
              // 현재 렌더링할 월 지정 (YYYY-MM-DD)
              current={currentDate.toISOString().slice(0, 10)}
              markingType="custom"
              markedDates={markedDates}
              onDayPress={onDayPress}
              // onDayPress={({ dateString }) => {
              //   navigation.navigate('DiaryEntry', { date: dateString })
              // }}
            /> */}
          </View>

          {selectedDate && (
            <View style={styles.footer}>
              {loadingDiary ? (
                <ActivityIndicator />
              ) : diary ? (
                <>
                  <Text style={styles.dateLabel}>{selectedDate} 일기</Text>
                  <Text style={styles.diaryContent}>{diary}</Text>
                  <View style={styles.buttonRow}>
                    <Button
                      title="수정"
                      onPress={() =>
                        navigation.navigate('DiaryEntry', { date: selectedDate })
                      }
                    />
                    <Button
                      title="삭제"
                      color="red"
                      onPress={onDelete}
                    />
                  </View>
                </>
              ) : (
                <Button
                  title="일기 쓰기"
                  onPress={() =>
                    navigation.navigate('DiaryEntry', { date: selectedDate })
                  }
                />
              )}
            </View>
          )}

          {/* {selectedDate && (
            <View style={styles.footer}>
              <Text style={styles.dateLabel}>
                {selectedDate} 일기
              </Text>
              <Button
                title='일기 쓰기'
                onPress={() => navigation.navigate('DiaryEntry', { date: selectedDate })}
              />
            </View>
          )} */}
        </GestureRecognizer>
      )}
    </View>
  )
}

export default CalenderScreen