import React, { useState, useEffect} from "react";
import { View, Button, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { naverLogin } from "../utils/NaverAuth";
import NaverLogin from "@react-native-seoul/naver-login";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/NaverLoginButtonStyle";

const NaverLoginButton = () => {
  const navigation = useNavigation();

  // 로그인 함수
  const handleLogin = async () => {
    try {
      const user = await naverLogin();
      await AsyncStorage.setItem("userInfo", JSON.stringify(user));
      await AsyncStorage.setItem("loginType", "naver");
      navigation.replace("GoalSetup");
    } catch (e) {
      console.error("네이버 로그인 실패:", e);
    }
  };

  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      await NaverLogin.logout();
      console.log("로그아웃 성공!");
      setUserInfo(null);
      setAccessToken(null);
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
  };

  // 탈퇴 (연동 해제) 함수
  const handleUnlink = async () => {
    try {
      console.log("네이버 계정 연동 해제 요청 중...");
      await NaverLogin.deleteToken(); // 네이버 연동 해제
      console.log("네이버 계정 연동 해제 완료!");

      // 사용자 정보 초기화
      setUserInfo(null);
      setAccessToken(null);
    } catch (err) {
      console.error("네이버 계정 연동 해제 실패:", err);
    }
  };

  return(
    <TouchableOpacity style={styles.naverButton} onPress={handleLogin}>
      <Text style={styles.naverLoginText}>네이버로 로그인</Text>
    </TouchableOpacity>
  );
}

export default NaverLoginButton;

