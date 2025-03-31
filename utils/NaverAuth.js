import NaverLogin from "@react-native-seoul/naver-login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendUserToServer, deleteUserFromServer } from "../utils/UserAPI";

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

      const userInfo = profile.response;
      await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));

      // 서버로 사용자 정보 전송
      const payload = {
        login_type: "naver",
        nickname: userInfo?.nickname,
        email: userInfo?.email,
        profile_image: userInfo.profile_image,
      };

      await sendUserToServer(payload);

      return userInfo;
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

    await AsyncStorage.removeItem("userInfo");
  } catch(err){
    console.error("네이버 연동 해제 오류:", err);
    throw err;
  }
};




