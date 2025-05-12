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
      const { user, isNew } = await kakaoLogin();
      await AsyncStorage.setItem('userInfo', JSON.stringify(user));
      await AsyncStorage.setItem('loginType', 'kakao');
      // navigation.replace("GoalSetup");
      // setUserInfo(user);

      // 서버에 사용자 전송 후, isNew 플래그로 분기
      if(isNew){
        navigation.replace("GoalSetup");
      }
      else{
        navigation.replace("Main");
      }
    } catch(e){
      console.error("카카오 로그인 처리 중 오류:", e);
    }
  };

  return (
    <TouchableOpacity style={styles.kakaoButton} onPress={handleLogin}>
      <Text style={styles.kakaoButtonText}>카카오로 로그인</Text>
    </TouchableOpacity>
  );
}

export default KakaoLoginButton;
