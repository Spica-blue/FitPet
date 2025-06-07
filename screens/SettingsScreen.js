import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { kakaoLogout, kakaoUnlink } from '../utils/KakaoAuth';
import { naverLogout, naverUnlink } from '../utils/NaverAuth';
import styles from "../styles/SettingsScreenStyle";

const SettingsScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loginType, setLoginType] = useState(null);

  // 로컬 캐시에서 userInfo 불러와 이메일만 추출
  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem('userInfo');
      const type = await AsyncStorage.getItem('loginType');
      if (stored) {
        const info = JSON.parse(stored);
        const e =
          info.email ??
          info.kakao_account?.email ??
          info.naver_account?.email ??
          '';
        setEmail(e);
        setLoginType(type);
      }
    };
    loadUser();
  }, []);

  // 실제 로그아웃 로직만 담당하는 함수 분리
  const doLogout = async () => {
    try {
      if (loginType === 'kakao') {
        await kakaoLogout();
      } else if (loginType === 'naver') {
        await naverLogout();
      }
      await AsyncStorage.multiRemove(['userInfo','loginType']);
      navigation.replace('Onboarding');
    } catch (e) {
      console.warn(e);
      Alert.alert('오류', '로그아웃에 실패했습니다.');
    }
  };

  // 확인창을 띄우는 함수
  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '확인', onPress: doLogout }
      ],
      { cancelable: true }
    );
  };

  const handleUnlink = async () => {
    Alert.alert(
      '탈퇴 확인',
      '정말 탈퇴 하시겠습니까?',
      [
        { text:'취소', style:'cancel' },
        {
          text:'탈퇴하기',
          style:'destructive',
          onPress: async () => {
            try {
              if (loginType === 'kakao') {
                await kakaoUnlink();
              } else if (loginType === 'naver') {
                await naverUnlink();
              }
              await AsyncStorage.multiRemove(['userInfo','loginType']);
              navigation.replace('Onboarding');
            } catch (e) {
              console.warn(e);
              Alert.alert('오류', '탈퇴에 실패했습니다.');
            }
          }
        }
      ]
    );
  };

  const options = [
    { key: 'account', label: '계정', value: email },
    { key: 'appInfo', label: '앱 정보', value: '1.0.0 (Build 1)' },
    { key: 'theme', label: '테마 설정' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.row} onPress={() => {/* TODO: 테마 설정 등 */}}>
      <Text style={styles.label}>{item.label}</Text>
      {item.value && <Text style={styles.value}>{item.value}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={options}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />

      {/* 하단 고정 버튼 바 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.btn, styles.logoutBtn]}
          onPress={handleLogout}
        >
          <Text style={styles.btnText}>로그아웃</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.unlinkBtn]}
          onPress={handleUnlink}
        >
          <Text style={styles.btnText}>연결 끊기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SettingsScreen