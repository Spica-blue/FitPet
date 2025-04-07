// const SPRING_URL = "http://192.168.100.196:8883";
// const FASTAPI_URL = "http://192.168.100.190:8883";  
// const FASTAPI_URL = "http://172.30.1.67:8883";

const SERVER_URLS = [
  "http://192.168.100.190:8883",  // FastAPI (메인)
  "http://192.168.100.196:8883",  // SpringBoot (백업)
];

const tryServers = async (callback) => {
  for(let url of SERVER_URLS){
    try{
      const result = await callback(url);
      if(result?.success !== false){
        return result;
      }
    } catch(err){
      console.log(`서버 실패 (${url}), 다음 서버로 시도...`);
    }
  }

  return { success: false, error: "모든 서버 요청 실패" };
}

const fetchWithTimeout = (url, options = {}, timeout = 1500) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => clearTimeout(timer));
};

export const sendUserToServer = async (userPayload) => {
  const email = userPayload.email;

  return tryServers(async (SERVER_URL) => {
    const checkRes = await fetchWithTimeout(`${SERVER_URL}/api/users/${email}`);

    if(checkRes.status === 200){
      const loginRes = await fetchWithTimeout(`${SERVER_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(userPayload),
      });

      const data = await loginRes.json();
      return loginRes.ok
        ? { success: true, data }
        : { success: false, error: data };
    }

    if (checkRes.status === 404) {
      const createRes = await fetchWithTimeout(`${SERVER_URL}/api/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });

      const data = await createRes.json();
      return createRes.ok
        ? { success: true, data }
        : { success: false, error: data };
    }

    const errorData = await checkRes.json();
    return { success: false, error: errorData };
  })

  // try{
  //   // 먼저 사용자 조회 (GET)
  //   const checkRes = await fetch(`${SERVER_URL}/api/users/${email}`);
  //   console.log(checkRes.status);

  //   if(checkRes.status === 200){
  //     // 이미 존재 -> 로그인 갱신
  //     console.log("기존 사용자입니다. 로그인 시간 갱신 중...");

  //     const loginRes = await fetch(`${SERVER_URL}/api/users/login`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(userPayload),
  //     });

  //     if(!loginRes.ok){
  //       const errorData = await loginRes.json();
  //       console.error("로그인 갱신 실패:", errorData);
  //       return { success: false, error: errorData };
  //     }

  //     const data = await loginRes.json();
  //     console.log("로그인 시간 갱신 완료:", data);
  //     return { success: true, data };
  //   }

  //   if (checkRes.status === 404) {
  //     // 신규 사용자 → 회원가입
  //     console.log("신규 사용자입니다. 회원가입 진행 중...");

  //     const createRes = await fetch(`${SERVER_URL}/api/users/`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(userPayload),
  //     });

  //     if (!createRes.ok) {
  //       const errorData = await createRes.json();
  //       console.error("회원가입 실패:", errorData);
  //       return { success: false, error: errorData };
  //     }

  //     const data = await createRes.json();
  //     console.log("회원가입 성공:", data);
  //     return { success: true, data };
  //   }

  //   // 그 외 예외 상황
  //   const errorData = await checkRes.json();
  //   console.error("서버 응답 에러:", errorData);
  //   return { success: false, error: errorData };
  // } catch(error){
  //   console.error("서버 요청 중 에러:", error);
  //   return { success: false, error };
  // }
}

export const deleteUserFromServer = async (email) => {
  return tryServers(async (SERVER_URL) => {
    const res = await fetchWithTimeout(`${SERVER_URL}/api/users/${email}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error };
    }
    return { success: true };
  });
  // try{
  //   const response = await fetch(`${SERVER_URL}/api/users/${email}`, {
  //     method: "DELETE",
  //   });

  //   if(!response.ok){
  //     const errorData = await response.json();
  //     console.error("서버 사용자 삭제 실패:", errorData);
  //     return { success: false, error: errorData };
  //   }

  //   console.log("서버 사용자 삭제 완료");
  //   return { success: true };
  // } catch(error){
  //   console.error("서버 사용자 삭제 중 에러:", error);
  //   return { success: false, error };
  // }
}

export const sendUserInfoToServer = async (userInfoPayload) => {
  return tryServers(async (SERVER_URL) => {
    const res = await fetchWithTimeout(`${SERVER_URL}/api/users/user-info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfoPayload),
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error };
    }

    return { success: true };
  });
  // try{
  //   const response = await fetch(`${SERVER_URL}/api/users/user-info`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(userInfoPayload),
  //   });

  //   if(!response.ok){
  //     const errorData = await response.json();
  //     console.error("서버 사용자 정보 저장 실패:", errorData);
  //     return { success: false, error: errorData };
  //   }

  //   console.log("서버 사용자 정보 저장 완료");
  //   return { success: true };
  // } catch(error){
  //   console.error("서버 사용자 정보 저장 중 에러:", error);
  //   return { success: false, error };
  // }
}

