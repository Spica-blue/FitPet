import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { kakaoLogout, kakaoUnlink } from "../utils/KakaoAuth";
import { naverLogout, naverUnlink } from "../utils/NaverAuth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Account = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loginType, setLoginType] = useState(null);

  useEffect(() => {
    // 로그인된 유저 정보 불러오기
    const fetchUserInfo = async () => {
      const storedUser = await AsyncStorage.getItem('userInfo');
      const storedLoginType = await AsyncStorage.getItem('loginType');
      if (storedUser) {
        setUserInfo(JSON.parse(storedUser));
        setLoginType(storedLoginType); // 로그인 타입도 저장
      }
    };
    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      if (loginType === 'kakao') {
        await kakaoLogout();
      } 
      else if (loginType === 'naver') {
        await naverLogout();
      }
      await AsyncStorage.multiRemove(['userInfo', 'loginType']);
      navigation.replace("Onboarding");
    } catch (e) {
      console.log(e);
    }
  };

  const handleUnlink = async () => {
    try {
      if (loginType === 'kakao') {
        await kakaoUnlink();
      } 
      else if (loginType === 'naver') {
        await naverUnlink();
      }
      await AsyncStorage.multiRemove(['userInfo', 'loginType']);
      navigation.replace("Onboarding");
    } catch (e) {
      console.log(e);
    }
  };

  if (!userInfo) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>닉네임: {userInfo?.nickname || userInfo?.kakao_account?.profile?.nickname}</Text>
      <Text style={styles.text}>이메일: {userInfo?.email || userInfo?.kakao_account?.email}</Text>
      {(userInfo?.profile_image || userInfo?.kakao_account?.profile?.profile_image_url) && (
        <Image
          source={{ uri: userInfo.profile_image || userInfo.kakao_account.profile.profile_image_url }}
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

export default Account;
