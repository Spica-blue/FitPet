import { login, logout, unlink } from "@react-native-kakao/user";

// 로그인 & 사용자 정보 가져오기
export const kakaoLogin = async () => {
  try{
    const result = await login();
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
    return user;
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
    await unlink();
    console.log("탈퇴 성공");
  } catch (error) {
    console.error("연결 끊기 실패:", error);
    throw error;
  }
};


