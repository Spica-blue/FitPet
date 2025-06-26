import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, logout, unlink } from "@react-native-kakao/user";
import { sendUserToServer, deleteUserFromServer } from "../utils/UserAPI";

// 공통: 로컬 캐시 삭제 함수
const clearLocalDataForEmail = async (email) => {
  const allKeys = await AsyncStorage.getAllKeys();
  // 해당 이메일이 포함된 키 전부
  const emailKeys = allKeys.filter(key => key.includes(email));
  // 추가로 삭제할 전역 키
  const globalKeys = ['userInfo', 'loginType'];
  const keysToRemove = [...new Set([...emailKeys, ...globalKeys])];
  if (keysToRemove.length) {
    await AsyncStorage.multiRemove(keysToRemove);
    console.log('삭제된 로컬 키:', keysToRemove);
  }
};

// 로그인 & 사용자 정보 가져오기
export const kakaoLogin = async () => {
  try{
    const result = await login();
    // console.log("로그인 성공:", result);
    console.log("로그인 성공");

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
    // console.log("사용자 정보:", user);

    const payload = {
      login_type: "kakao",
      nickname: user.kakao_account?.profile?.nickname,
      email: user.kakao_account?.email,
      profile_image: user.kakao_account?.profile?.profile_image_url,
    };

    const { success, data, isNew } = await sendUserToServer(payload);
    if (!success) throw new Error("서버 로그인/회원가입 실패");

    // 최종으로 사용자 정보와 신규 여부를 리턴
    return { user, isNew };
  } catch(error){
    console.error("카카오 로그인 실패:", error);
  }
};

export const kakaoLogout = async () => {
  try{
    await logout();
    console.log("로그아웃 성공");
  } catch (error) {
    console.error("로그아웃 실패:", error);
    throw error;
  }
};

export const kakaoUnlink = async () => {
  try{
    // 카카오 연결 끊기
    await unlink();
    console.log("탈퇴 성공");

    // 저장된 이메일 꺼내기
    const storedUser = await AsyncStorage.getItem("userInfo");
    const userInfo = storedUser ? JSON.parse(storedUser) : null;
    const email = userInfo?.kakao_account?.email;

    if(!email){
      console.warn("저장된 이메일이 없어 서버 삭제 요청 생략됨");
      return;
    }

    // 서버에 삭제 요청 보내기
    await deleteUserFromServer(email);

    // 로컬 캐시 전부 삭제
    await clearLocalDataForEmail(email);
  } catch (error) {
    console.error("탈퇴 실패:", error);
    throw error;
  }
};


