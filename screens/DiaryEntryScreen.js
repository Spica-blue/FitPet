import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "../styles/DiaryStyle";
import { saveCalendarNote, fetchCalendarNote } from '../utils/UserAPI';

const DiaryEntryScreen = ({ route, navigation }) => {
  const { date } = route.params;
  const [note, setNote] = useState('');
  const [workoutSuccess, setWorkoutSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const storageKey = `diary-${date}`;
  // const [text, setText] = useState('');

  const getEmail = async () => {
    const ui = await AsyncStorage.getItem('userInfo');
    const p = JSON.parse(ui) || {};
    return p.email || p.kakao_account?.email || '';
  };

  // 기존 일기 불러오기
  useEffect(() => {
    (async () => {
      const email = await getEmail();

      // const saved = await AsyncStorage.getItem(storageKey);
      // if(saved) setText(saved);

      // 1) 로컬 캐시에서 먼저 불러오기
      const savedLocal = await AsyncStorage.getItem(storageKey);
      if (savedLocal !== null) {
        // 로컬에 있던 값이 있으면 미리 세팅
        const parsed = JSON.parse(savedLocal);
        setNote(parsed.note  || '');
        setWorkoutSuccess(parsed.workoutSuccess || false);
      }

      // 2) 서버에서 최신 데이터 가져오기
      const res = await fetchCalendarNote(email, date);
      if(res.success && res.data){
        setNote(res.data.note || '');
        setWorkoutSuccess(res.data.workout_success || false);
      }
      setLoading(false);
    })();
  }, []);

  const onSave = async () => {
    const email = await getEmail();

     // 1) 로컬 캐시에도 저장
    // await AsyncStorage.setItem(storageKey, JSON.stringify({ note, workoutSuccess }));

    // 2) 서버 저장
    const res = await saveCalendarNote({ email, date, note, workout_success: workoutSuccess });
    
    if(!res.success){
      return Alert.alert('저장 실패', '서버에 저장하지 못했습니다.');
    }

    Alert.alert('저장 완료', `${date} 일기가 저장되었습니다.`);
    navigation.goBack();
  };

  if(loading) return null;

  // const saveDiary = async () => {
  //   await AsyncStorage.setItem(storageKey, text);
  //   Alert.alert("저장 완료", `${date} 일기가 저장되었습니다.`);
  //   navigation.goBack();
  // };
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{date} 일기</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder='오늘의 일상을 기록해보세요.'
        value={note}
        onChangeText={setNote}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
        <Text>운동 성공 여부: </Text>
        <Switch
          value={workoutSuccess}
          onValueChange={setWorkoutSuccess}
        />
      </View>
      <Button title='저장' onPress={onSave} />
    </View>
  )
}

export default DiaryEntryScreen