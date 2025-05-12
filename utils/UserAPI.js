const SPRING_URL = "http://192.168.100.196:8883";
const FASTAPI_URL = "http://192.168.100.190:8883";  
// const FASTAPI_URL = "http://172.30.1.67:8883";
// const FASTAPI_URL = "http://192.168.35.137:8883";   

const SERVER_URLS = [
  FASTAPI_URL,  // FastAPI (메인)
  SPRING_URL,  // SpringBoot (백업)
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
    // 사용자 조회
    const checkRes = await fetchWithTimeout(`${SERVER_URL}/api/users/${email}`);

    // 사용자 조회 시 있으면 로그인
    if(checkRes.status === 200){
      const loginRes = await fetchWithTimeout(`${SERVER_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(userPayload),
      });

      const data = await loginRes.json();
      return loginRes.ok
        ? { success: true, data, isNew: false }
        : { success: false, error: data };
    }

    // 사용자 조회 시 없으면 회원가입
    if (checkRes.status === 404) {
      const createRes = await fetchWithTimeout(`${SERVER_URL}/api/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });

      const data = await createRes.json();
      return createRes.ok
        ? { success: true, data, isNew: true }
        : { success: false, error: data };
    }

    const errorData = await checkRes.json();
    return { success: false, error: errorData };
  })
}

// 탈퇴
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
}

// 유저 정보 서버에 저장
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
}

// gpt에 정보 보내기
export const requestGptRecommendation = async (userInfoPayload) => {

  return tryServers(async (SERVER_URL) => {
    const url = `${SERVER_URL}/api/gpt/recommend`;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfoPayload),
    };
    const timeout = 30000;

    const res = await fetchWithTimeout(url, options, timeout);

    if (!res.ok) {
      const error = await res.json();
      console.error("GPT 추천 요청 실패:", error);
      return { success: false, error };
    }

    const data = await res.json();
    console.log("GPT 추천 요청 성공:", data);
    return { success: true, data };
  });
};

// gpt 추천 결과 받아오기
export async function fetchRecommendationByDate(email, date) {
  return tryServers(async (SERVER_URL) => {
    const res = await fetchWithTimeout(`${SERVER_URL}/api/gpt/recommend?email=${email}&date=${date}`);
    
    // 404는 “데이터 없음” 처리
    if (res.status === 404) {
      return { success: true, data: null };
    }
    
    const data = await res.json();

    // 의도치 않은 에러(500 등)면 실패 처리
    if (!res.ok) {
      console.error("gpt 추천 결과 조회 실패:", data);
      return { success: false, error: data };
    } 

    console.log("✅ gpt 추천 결과 조회 완료:", data);
    return { success: true, data: data };
  })
}

// 만보기 기록 서버에 보내기
export const sendStepToServer = async (email, stepCount) => {
  return tryServers(async (SERVER_URL) => {
    const res = await fetchWithTimeout(`${SERVER_URL}/api/pedometer/record`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, step_count: stepCount }),
    });

    const data = await res.json();
  
    if (!res.ok) {
      console.error("걸음 수 저장 실패:", data);
      return { success: false, error: data };
    } 

    console.log("✅ 걸음 수 서버 전송 완료:", data);
    return { success: true, data };
  })
};

// 하루 한 끼 또는 전체 끼니를 저장/업데이트 합니다.
// @param {{ email: string, date: string, breakfast?: string, lunch?: string, dinner?: string }} payload
export const saveDiet = async (payload) => {
  return tryServers(async (SERVER_URL) => {
    const res = await fetchWithTimeout(`${SERVER_URL}/api/diet`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    
    if(!res.ok){
      console.log("식단 저장 실패: ", data);
      return { success: false, error: data }
    }

    console.log("식단 저장 완료: ", data);
    return { success: true, data: data}
  })
}

/**
 * 특정 날짜의 식단 기록을 가져옵니다.
 * @param {string} email  - 사용자 이메일
 * @param {string} date   - 조회할 날짜 (YYYY-MM-DD)
 * @returns {Promise<{success: boolean, data?: { email, date, breakfast, lunch, dinner, created_at }, error?: any }>}
*/
export const fetchDietByDate = async (email, date) => {
  return tryServers(async (SERVER_URL) => {
    const res = await fetchWithTimeout(`${SERVER_URL}/api/diet?email=${encodeURIComponent(email)}&date=${date}`);

    // 404면 “해당 날짜에 식단이 없음”으로 처리
    if (res.status === 404) {
      return { success: true, data: null };
    }

    const data = await res.json();

    if (!res.ok) {
      // 500 등 실제 에러
      console.log("식단 조회 실패: ", data);
      return { success: false, error: data };
    }

    // 정상 응답: DietResponse 형태
    console.log("식단 조회 완료: ", data);
    return { success: true, data: data };
  });
}

