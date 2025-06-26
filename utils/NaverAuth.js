import NaverLogin from "@react-native-seoul/naver-login";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

export const naverLogin = async () => {
  try{
    const { successResponse, failureResponse } = await NaverLogin.login();

    if(successResponse){
      const token = successResponse.accessToken;
      // console.log("로그인 성공! accessToken:", token);
      console.log("로그인 성공!");

      // 사용자 정보 가져오기
      const profile = await NaverLogin.getProfile(token);
      console.log("사용자 정보:", profile);

      const user = profile.response;

      // 서버로 사용자 정보 전송
      const payload = {
        login_type: "naver",
        nickname: user?.nickname,
        email: user?.email,
        profile_image: user.profile_image,
      };

      const { success, data, isNew } = await sendUserToServer(payload);
      if (!success) throw new Error("서버 로그인/회원가입 실패");

      // 최종으로 사용자 정보와 신규 여부를 리턴
    return { user, isNew };
    }
    else{
      throw new Error(failureResponse?.message || "네이버 로그인 실패");
    }
  } catch(err){
    console.error("네이버 로그인 오류:", err);
    throw err;
  }
};

export const naverLogout = async () => {
  try{
    await NaverLogin.logout();
    await AsyncStorage.removeItem("userInfo");
  } catch(err){
    console.error("네이버 로그아웃 오류:", err);
    throw err;
  }
};

export const naverUnlink = async () => {
  try{
    await NaverLogin.deleteToken();
    console.log("탈퇴 성공");

    // 저장된 이메일 꺼내기
    const storedUser = await AsyncStorage.getItem("userInfo");
    const userInfo = storedUser ? JSON.parse(storedUser) : null;
    const email = userInfo?.email; 

    if (!email) {
      console.warn("저장된 이메일이 없어 서버 삭제 요청 생략됨");
      return;
    }

    // 서버에 삭제 요청
    await deleteUserFromServer(email);

    // 로컬 캐시 전부 삭제
    await clearLocalDataForEmail(email);
  } catch(err){
    console.error("네이버 연동 해제 오류:", err);
    throw err;
  }
};




