export const sendUserToServer = async (userPayload) => {
  const email = userPayload.email;

  try{
    // 먼저 사용자 조회 (GET)
    const checkRes = await fetch(`http://192.168.100.190:8883/api/users/${email}`);
    console.log(checkRes.status);

    if(checkRes.status === 200){
      // 이미 존재 -> 로그인 갱신
      console.log("기존 사용자입니다. 로그인 시간 갱신 중...");

      const loginRes = await fetch("http://192.168.100.190:8883/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userPayload),
      });

      if(!loginRes.ok){
        const errorData = await loginRes.json();
        console.error("로그인 갱신 실패:", errorData);
        return { success: false, error: errorData };
      }

      const data = await loginRes.json();
      console.log("로그인 시간 갱신 완료:", data);
      return { success: true, data };
    }

    if (checkRes.status === 404) {
      // 신규 사용자 → 회원가입
      console.log("신규 사용자입니다. 회원가입 진행 중...");

      const createRes = await fetch("http://192.168.100.190:8883/api/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userPayload),
      });

      if (!createRes.ok) {
        const errorData = await createRes.json();
        console.error("회원가입 실패:", errorData);
        return { success: false, error: errorData };
      }

      const data = await createRes.json();
      console.log("회원가입 성공:", data);
      return { success: true, data };
    }

    // 그 외 예외 상황
    const errorData = await checkRes.json();
    console.error("서버 응답 에러:", errorData);
    return { success: false, error: errorData };
  } catch(error){
    console.error("서버 요청 중 에러:", error);
    return { success: false, error };
  }
}

export const deleteUserFromServer = async (email) => {
  try{
    const response = await fetch(`http://192.168.100.190:8883/api/users/${email}`, {
      method: "DELETE",
    });

    if(!response.ok){
      const errorData = await response.json();
      console.error("서버 사용자 삭제 실패:", errorData);
      return { success: false, error: errorData };
    }

    console.log("서버 사용자 삭제 완료");
    return { success: true };
  } catch(error){
    console.error("서버 사용자 삭제 중 에러:", error);
    return { success: false, error };
  }
}

