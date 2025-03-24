import React, {useState}  from "react";
import { View, Button, Text, Image } from "react-native";
import { kakaoLogin, kakaoLogout, kakaoUnlink } from "../utils/KakaoAuth";

const KakaoLoginButton = () => {
  const [userInfo, setUserInfo] = useState(null);

  // 로그인 함수
  const handleLogin = async () => {
    console.log("카카오 로그인 버튼 클릭됨!");
    try{
      const user = await kakaoLogin();
      setUserInfo(user);
    } catch(e){}
  };

  // 로그아웃 함수
  const handleLogout = async () => {
    try{
      await kakaoLogout();
      setUserInfo(null);
    } catch(e){}
  };

  // 연결 끊기 (회원 탈퇴)
  const handleUnlink = async () => {
    try{
      await kakaoUnlink();
      setUserInfo(null);
    } catch(e){}
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
