import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "../styles/DiaryStyle";

const DiaryEntryScreen = ({ route, navigation }) => {
  const { date } = route.params;
  const storageKey = `diary-${date}`;
  const [text, setText] = useState('');

  // 기존 일기 불러오기
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(storageKey);
      if(saved) setText(saved);
    })();
  }, []);

  const saveDiary = async () => {
    await AsyncStorage.setItem(storageKey, text);
    Alert.alert("저장 완료", `${date} 일기가 저장되었습니다.`);
    navigation.goBack();
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{date} 일기</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder='오늘의 일상을 기록해보세요.'
        value={text}
        onChangeText={setText}
      />
      <Button title='저장하기' onPress={saveDiary} />
    </View>
  )
}

export default DiaryEntryScreen