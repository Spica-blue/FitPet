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
      const { user, isNew } = await naverLogin();
      await AsyncStorage.setItem("userInfo", JSON.stringify(user));
      await AsyncStorage.setItem("loginType", "naver");
      // navigation.replace("GoalSetup");
      
      // 서버에 사용자 전송 후, isNew 플래그로 분기
      if(isNew){
        navigation.replace("GoalSetup");
      }
      else{
        navigation.replace("Main");
      }
    } catch (e) {
      console.error("네이버 로그인 실패:", e);
    }
  };

  return(
    <TouchableOpacity style={styles.naverButton} onPress={handleLogin}>
      <Text style={styles.naverLoginText}>네이버로 로그인</Text>
    </TouchableOpacity>
  );
}

export default NaverLoginButton;

