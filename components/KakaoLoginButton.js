import React, {useState}  from "react";
import { View, Button, Text, Image } from "react-native";
import { login, logout, unlink } from "@react-native-kakao/user";

const KakaoLoginButton = () => {
  const [userInfo, setUserInfo] = useState(null);

  // 로그인 함수
  const handleLogin = async () => {
    console.log("카카오 로그인 버튼 클릭됨!");
    try{
      const result = await login(); // 카카오 로그인 실행
      console.log("로그인 성공:", result);

      // accessToken으로 사용자 정보 요청
      const response = await fetch("https://kapi.kakao.com/v2/user/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${result.accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });

      // 로그인 성공 시, 사용자 정보 가져오기
      const user = await response.json();
      console.log("사용자 정보:", user);
      setUserInfo(user);
    } catch(error){
      console.error("카카오 로그인 실패:", error);
    }
  };

  // 로그아웃 함수
  const handleLogout = async () => {
    try{
      await logout();
      console.log("로그아웃 성공");
      setUserInfo(null);
    } catch(error){
      console.error("로그아웃 실패:", error);
    }
  };

  // 연결 끊기 (회원 탈퇴)
  const handleUnlink = async () => {
    try{
      await unlink();
      console.log("탈퇴 성공");
      setUserInfo(null);
    } catch(error){
      console.error("탈퇴 실패:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%" }}>
      {userInfo ? (
        <>
          <Text>닉네임: {userInfo?.kakao_account?.profile?.nickname}</Text>
          <Text>이메일: {userInfo?.kakao_account?.email}</Text>
          {userInfo?.kakao_account?.profile?.profile_image_url && (
            <Image 
              source={{ uri: userInfo.kakao_account.profile.profile_image_url }} 
              style={{ width: 100, height: 100, borderRadius: 50, marginVertical: 10 }}
            />
          )}
          <Button title="로그아웃" onPress={handleLogout} />
          <Button title="연결 끊기" onPress={handleUnlink} color="red" />
        </>
      ) : (
        <Button 
          title="카카오 로그인" 
          onPress={() => {
            console.log("카카오 로그인 버튼 눌림"); // 버튼 클릭 시 로그 출력
            handleLogin();
          }} 
          color="#FEE500" 
        />
      )}
    </View>
  );
}

export default KakaoLoginButton;
