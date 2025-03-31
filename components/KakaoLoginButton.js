import React, {useState}  from "react";
import { View, Button, Text, Image, TouchableOpacity } from "react-native";
import { kakaoLogin, kakaoLogout, kakaoUnlink } from "../utils/KakaoAuth";
import styles from "../styles/KakaoLoginButtonStyle";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const KakaoLoginButton = () => {
  // const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation();

  // 로그인 함수
  const handleLogin = async () => {
    try{
      const user = await kakaoLogin();
      await AsyncStorage.setItem('userInfo', JSON.stringify(user));
      await AsyncStorage.setItem('loginType', 'kakao');
      navigation.replace("GoalSetup"); // Home 화면으로 이동
      // setUserInfo(user);
    } catch(e){}
  };

  // 로그아웃 함수
  const handleLogout = async () => {
    try{
      await kakaoLogout();
      // setUserInfo(null);
    } catch(e){}
  };

  // 연결 끊기 (회원 탈퇴)
  const handleUnlink = async () => {
    try{
      await kakaoUnlink();
      // setUserInfo(null);
    } catch(e){}
  };

  return (
    <TouchableOpacity style={styles.kakaoButton} onPress={handleLogin}>
      <Text style={styles.kakaoButtonText}>카카오로 로그인</Text>
    </TouchableOpacity>
  );
}

export default KakaoLoginButton;
