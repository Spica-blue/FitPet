import NaverLogin from "@react-native-seoul/naver-login";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const naverLogin = async () => {
  try{
    const { successResponse, failureResponse } = await NaverLogin.login();

    if(successResponse){
      const token = successResponse.accessToken;
      console.log("로그인 성공! accessToken:", token);

      // 사용자 정보 가져오기
      const profile = await NaverLogin.getProfile(token);
      console.log("사용자 정보:", profile);

      const userInfo = profile.response;
      await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));

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
    await AsyncStorage.removeItem("userInfo");
  } catch(err){
    console.error("네이버 연동 해제 오류:", err);
    throw err;
  }
};




