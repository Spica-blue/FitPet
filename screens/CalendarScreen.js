import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, AppState, Alert, TouchableOpacity, ScrollView, Dimensions, Modal, Pressable } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import GestureRecognizer from 'react-native-swipe-gestures';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchCalendarNote, deleteCalendarNote, fetchAllCalendarNotes } from '../utils/UserAPI';
import Calendar from '../components/Calendar';
import styles from "../styles/tab/CalendarScreenStyle";
import { modalStyles } from '../styles/ModalStyle';
import DiaryEntryScreen from './DiaryEntryScreen';

const { height: screenH } = Dimensions.get('window');

const CalenderScreen = ({ navigation }) => {
  // const [selectedDate, setSelectedDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [diary, setDiary] = useState(null);
  const [workoutSuccess, setWorkoutSuccess] = useState(null);
  const [loadingDiary, setLoadingDiary] = useState(false);
  const [isDiaryModalVisible, setDiaryModalVisible] = useState(false);

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
    // console.log("res:",res.data);
    let success;
    if (res.success && res.data?.note) {
      console.log("일기 조회 성공");
      content = res.data.note;
      success = res.data.workout_success;
      // console.log("success:", success);
    }
    setDiary(content);
    setWorkoutSuccess(success);
    console.log("workout:", workoutSuccess);
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

  // 실제 기록된 날짜에 해당하는 키 markedDates 생성
  const loadMarks = async () => {
    setLoading(true);

    const email = await getEmail();
    const marks = {};

    // 1) 로컬 캐시에서 일기 키 읽기
    const allKeys = await AsyncStorage.getAllKeys();
    console.log('🍱 AsyncStorage Keys:', allKeys);

    // 2) 일기 작성된 날짜 찾기
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

    // 3) 서버에서 전체 일기 목록 가져오기
    const res = await fetchAllCalendarNotes(email);
    if (res.success && Array.isArray(res.data)) {
      res.data.forEach(({ date }) => {
        // 로컬에 이미 표시된 날짜는 중복 추가하지 않음
        if (!marks[date]) {
          marks[date] = { dots: [] };
        }
        // 2) 로컬 점(diary)이 이미 있으면 서버 점은 추가하지 않음
        // marks[date].dots.push({ key: 'diary-server', color: '#2196F3' });
        const hasLocal = marks[date].dots.some(dot => dot.key === 'diary');
        if (!hasLocal) {
          marks[date].dots.push({ key: 'diary-server', color: '#2196F3' });
        }
      });
    } 
    else {
      console.warn('서버 일기 목록 로드 실패:', res.error);
    }

    setMarkedDates(marks);
    setLoading(false);
  };

  // diary 캐시 삭제
  async function clearLocalDiaryCache() {
    // 1) 저장된 모든 키를 가져와서
    const allKeys = await AsyncStorage.getAllKeys();
    // 2) diary- 로 시작하는 키만 필터
    const diaryKeys = allKeys.filter(k => k.startsWith('diary-'));
    if (diaryKeys.length > 0) {
      // 3) 한 번에 제거
      await AsyncStorage.multiRemove(diaryKeys);
      console.log(`로컬 캐시 삭제: ${diaryKeys.join(', ')}`);
    }
  }

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

  const openDiaryModal = dateString => {
    setSelectedDate(dateString);
    setDiaryModalVisible(true);
  };

  const closeDiaryModal = () => {
    setDiaryModalVisible(false);
    // 모달에서 저장하고 돌아왔으므로, 다시 일기 로드
    loadDiary(selectedDate);
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
          </View>

          {selectedDate && (
            // <View style={styles.footer}>
              loadingDiary ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#007AFF" />
                </View>
              ) : diary ? (
                <View style={styles.footer}>
                  <Text style={styles.dateLabel}>{selectedDate} 일기</Text>
                  {/* <Text style={styles.diaryContent}>{diary}</Text> */}
                  <ScrollView 
                    style={styles.diaryScroll} 
                    nestedScrollEnabled
                    contentContainerStyle={{ padding: 8 }}
                    // 터치 이벤트 우선권
                    keyboardShouldPersistTaps="handled"
                  >
                    <Text style={styles.diaryContent}>{diary}</Text>
                  </ScrollView>
                  <Text style={styles.workoutStatus}>
                    운동 여부: {workoutSuccess ? "✅ 완료" : "❌ 미완료"}
                  </Text>
                  
                  <View style={styles.buttonRow}>
                    {/* “수정” 버튼을 눌렀을 때 모달 오픈 */}
                    <TouchableOpacity
                      style={styles.primaryButton}
                      // onPress={() =>
                      //   navigation.navigate('DiaryEntry', { date: selectedDate })
                      // }
                      onPress={() => openDiaryModal(selectedDate)}
                    >
                      <Text style={styles.primaryButtonText}>수정</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={onDelete}
                    >
                      <Text style={styles.secondaryButtonText}>삭제</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  {/* “일기 쓰기” 버튼을 눌렀을 때 모달 오픈 */}
                  <TouchableOpacity
                    style={styles.emptyButton}
                    // onPress={() =>
                    //   navigation.navigate('DiaryEntry', { date: selectedDate })
                    // }
                    onPress={() => openDiaryModal(selectedDate)}
                  >
                    <Text style={styles.emptyButtonText}>일기 쓰기</Text>
                  </TouchableOpacity>
                </View>
              )
          )}
        </GestureRecognizer>
      )}
      <Modal
        visible={isDiaryModalVisible}
        transparent
        animationType='slide'
        onRequestClose={closeDiaryModal}
      >
        <Pressable
          style={modalStyles.backdrop}
          onPress={closeDiaryModal}
        >
          <Pressable onPress={() => { /* do nothing */ }} style={modalStyles.modalCard}>
            <DiaryEntryScreen
              route={{ params: { date: selectedDate } }}
              navigation={{ goBack: closeDiaryModal }}
            />
          </Pressable>
        </Pressable>
        {/* <View style={modalStyles.backdrop}>
          <View style={modalStyles.modalCard}>
          </View>
        </View> */}
      </Modal>
    </View>
  )
}

export default CalenderScreen