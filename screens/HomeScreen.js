import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { kakaoLogout, kakaoUnlink } from "../utils/KakaoAuth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // 로그인된 유저 정보 불러오기
    const fetchUserInfo = async () => {
      const storedUser = await AsyncStorage.getItem('userInfo');
      if (storedUser) {
        setUserInfo(JSON.parse(storedUser));
      }
    };
    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await kakaoLogout();
      await AsyncStorage.removeItem('userInfo');
      navigation.replace("Onboarding"); // 온보딩 화면으로 이동
    } catch (e) {
      console.log(e);
    }
  };

  const handleUnlink = async () => {
    try {
      await kakaoUnlink();
      await AsyncStorage.removeItem('userInfo');
      navigation.replace("Onboarding");
    } catch (e) {
      console.log(e);
    }
  };

  if (!userInfo) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>닉네임: {userInfo.kakao_account.profile.nickname}</Text>
      <Text style={styles.text}>이메일: {userInfo.kakao_account.email}</Text>
      {userInfo.kakao_account.profile.profile_image_url && (
        <Image
          source={{ uri: userInfo.kakao_account.profile.profile_image_url }}
          style={styles.profileImage}
        />
      )}
      <Button title="로그아웃" onPress={handleLogout} />
      <Button title="연결 끊기" onPress={handleUnlink} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginVertical: 4,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginVertical: 10,
  },
});

export default HomeScreen;
