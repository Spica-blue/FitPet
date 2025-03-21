import React, { useState } from "react";
import { View, Button, Text, Platform } from "react-native";
import { login, logout, getProfile } from "@react-native-seoul/naver-login";
import Constants from "expo-constants";

// extra에서 네이버 키 불러오기
const NAVER_CLIENT_ID = Constants.expoConfig?.extra?.naverClientId;
const NAVER_CLIENT_SECRET = Constants.expoConfig?.extra?.naverClientSecret;

// 네이버 api 키 설정
const androidKeys = {
  kConsumerKey: NAVER_CLIENT_ID,
  kConsumerSecret: NAVER_CLIENT_SECRET,
  kServiceAppName: "FitPet"
};

const NaverLogin = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // 로그인 함수
  const handleLogin = async () => {
    try {
      console.log("네이버 로그인 시작!");
      const token = await login(naverKeys);
      console.log("로그인 성공:", token);
      setAccessToken(token.accessToken);

      // 사용자 정보 가져오기
      const profile = await getProfile(token.accessToken);
      console.log("사용자 정보:", profile);
      setUserInfo(profile.response);
    } catch (err) {
      console.error("네이버 로그인 실패:", err);
    }
  };

  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      await logout();
      console.log("로그아웃 성공!");
      setUserInfo(null);
      setAccessToken(null);
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
  };

  return(
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%" }}>
      {userInfo ? (
        <>
          <Text>닉네임: {userInfo?.nickname}</Text>
          <Text>이메일: {userInfo?.email}</Text>
          <Button title="로그아웃" onPress={handleLogout} />
        </>
      ) : (
        <Button 
          title="네이버 로그인" 
          onPress={handleLogin} 
          color="#03C75A" 
        />
      )}
    </View>
  );
}

export default NaverLogin;

