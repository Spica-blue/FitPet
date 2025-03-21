import React, { useState, useEffect} from "react";
import { View, Button, Text, Image } from "react-native";
import NaverLogin from "@react-native-seoul/naver-login";
import Constants from "expo-constants";

const NaverLoginScreen = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // 로그인 함수
  const handleLogin = async () => {
    try {
      console.log("네이버 로그인 시작!");

      const { successResponse, failureResponse } = await NaverLogin.login();

      if(successResponse){
        const token = successResponse.accessToken;
        console.log("로그인 성공! accessToken:", token);
        setAccessToken(token);

        // 사용자 정보 가져오기
        const profile = await NaverLogin.getProfile(token);
        console.log("사용자 정보:", profile);
        setUserInfo(profile.response);
      }
      else{
        console.error("로그인 실패:", failureResponse?.message);
      }
    } catch (err) {
      console.error("네이버 로그인 중 예외 발생:", err);
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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%" }}>
      {userInfo ? (
        <>
          <Text>닉네임: {userInfo?.nickname}</Text>
          <Text>이메일: {userInfo?.email}</Text>
          {userInfo?.profile_image && (
            <Image 
              source={{ uri: userInfo.profile_image }} 
              style={{ width: 100, height: 100, borderRadius: 50, marginVertical: 10 }}
            />
          )}
          <Button title="로그아웃" onPress={handleLogout} />
          <Button title="연동 해제 (탈퇴)" onPress={handleUnlink} color="red" />
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

export default NaverLoginScreen;

