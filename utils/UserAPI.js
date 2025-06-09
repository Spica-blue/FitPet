const SPRING_URL = "http://192.168.100.196:8883";
const FASTAPI_URL = "http://192.168.100.190:8883";  
// const FASTAPI_URL = "http://172.30.1.22:8883";
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

// 유저 정보(목표 설정) 서버에 저장
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

/**
 * 유저 정보(목표 설정) 조회
 * @param {string} email
 * @returns {Promise<{ success: boolean, data?: { diet_type: string, target_weight: number }, error?: any }>}
 */
export const fetchUserInfoFromServer = async (email) => {
  return tryServers(async (SERVER_URL) => {
    const res = await fetchWithTimeout(`${SERVER_URL}/api/users/user-info?email=${encodeURIComponent(email)}`);
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('user_info 조회 실패:', err);
      return { success: false, error: err };
    }
    const data = await res.json();
    // { email, gender, age, height, activity_level, current_weight,
    //   target_weight, target_date, target_calories, diet_intensity,
    //   diet_type, allergy, created_at, updated_at }
    return { success: true, data };
  });
};

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

/**
 * 지난 기간(시작일 ~ 종료일)의 만보기 기록을 서버에서 조회합니다.
 * @param {string} email          - 사용자 이메일
 * @param {string} startDate      - 조회 시작일 "YYYY-MM-DD"
 * @param {string} endDate        - 조회 종료일 "YYYY-MM-DD"
 * @returns {Promise<{ success: boolean, data?: Array<{ email: string, step_count: number, date: string }>, error?: any }>}
 */
export async function fetchPedometerRecords(email, startDate, endDate) {
  return tryServers(async (SERVER_URL) => {
    const url = `${SERVER_URL}/api/pedometer/records`
      + `?email=${encodeURIComponent(email)}`
      + `&start=${startDate}`
      + `&end=${endDate}`;

    const res = await fetchWithTimeout(url, {}, 5000);
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('만보기 범위 조회 실패:', err);
      return { success: false, error: err };
    }
    
    const list = await res.json();
    // 서버가 [{ email, step_count, date }, …] 형태로 내려줍니다.
    return { success: true, data: list };
  });
}

/** 
 *  하루 한 끼 또는 전체 끼니를 저장/업데이트 합니다.
 * @param {{ email: string, date: string, breakfast?: string, lunch?: string, dinner?: string }} payload
*/
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

// 일기 저장
export const saveCalendarNote = async ({ email, date, note, workout_success }) => {
  return tryServers(async (SERVER_URL) => {
    const res = await fetchWithTimeout(`${SERVER_URL}/api/calendar/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, date, note, workout_success }),
    },
    5000  
    );

    const data = await res.json();

    if(!res.ok){
      console.error("캘린더 저장 실패: ", data);
      return { success: false, error: data };
    }

    return { success: true, data };
  });
};

// 일기 조회
export const fetchCalendarNote = async (email, date) => {
  return tryServers(async (SERVER_URL) => {
    const res = await fetchWithTimeout(`${SERVER_URL}/api/calendar/?email=${encodeURIComponent(email)}&date=${date}`);

    if(res.status === 404){
      return { success: true, data: null};
    }

    const data = await res.json();
    if(!res.ok){
      console.error("캘린더 조회 실패: ", data);
      return { success: false, error: data };
    }
    // console.log("data: ", data);
    return { success: true, data };
  });
};

/**
 * @description 이메일에 해당하는 모든 캘린더 노트를 가져옵니다.
 * @param {string} email
 * @returns {Promise<{ success: boolean, data?: Array<{ date: string, note: string, workout_success?: boolean }>, error?: any }>}
 */
export const fetchAllCalendarNotes = async (email) => {
  return tryServers(async (SERVER_URL) => {
    // 날짜 파라미터 없이 호출해서 전체 리스트를 받는다
    const res = await fetchWithTimeout(`${SERVER_URL}/api/calendar/all?email=${encodeURIComponent(email)}`);

    if (!res.ok) {
      const error = await res.json();
      console.error("전체 일기 조회 실패:", error);
      return { success: false, error };
    }

    // const data = await res.json();
    // // data는 [{ date: '2025-06-07', note: '...', workout_success: true }, ...]
    // console.log("전체 일기 조회 성공:", data);
    // return { success: true, data };
    const json = await res.json();
    // FastAPI: json이 곧 Array<…>, SpringBoot: json.data가 Array<…>
    const dataList = Array.isArray(json)
      ? json
      : (json.data && Array.isArray(json.data))
        ? json.data
        : [];
    
    console.log("전체 일기 조회 성공:", dataList);
    return { success: true, data: dataList };
  });
}

// 일기 삭제
export const deleteCalendarNote = async (email, date) => {
  return tryServers(async (SERVER_URL) => {
    const res = await fetchWithTimeout(`${SERVER_URL}/api/calendar/?email=${encodeURIComponent(email)}&date=${date}`, {
      method: 'DELETE'
    });

    if(res.status === 404){
      return { success: true };
    }

    if(!res.ok){
      const data = await res.json();
      console.error("캘린더 삭제 실패: ", data);
      return { success: false, error: data };
    }

    return { success: true };
  });
};

// ─────────────────────────────────────────────────
// 새 펫(Pet) 정보를 서버에 저장하는 함수 추가
// - email, pet_type, satiety 값을 서버로 전달
// ─────────────────────────────────────────────────
export const sendPetToServer = async ({ email, pet_type, satiety }) => {
  return tryServers(async (SERVER_URL) => {
    const res = await fetchWithTimeout(`${SERVER_URL}/api/pet/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pet_type, satiety }),
    }, 2000);

    const data = await res.json();

    if(!res.ok){
      console.error("펫 저장 실패:", data);
      return { success: false, error: data };
    }

    console.log("펫 정보 서버 저장 완료:", data);
    return { success: true, data };
  });
};

/**
 * 서버에서 해당 이메일의 Pet 정보를 가져옵니다.
 * @param {string} email
 * @returns {Promise<{ success: boolean, data?: { email, pet_type, satiety, created_at }, error?: any }>}
 */
export const fetchPetFromServer = async (email) => {
  return tryServers(async (SERVER_URL) => {
    const res = await fetchWithTimeout(`${SERVER_URL}/api/pet/${encodeURIComponent(email)}`, { 
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }, 2000);
    
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    } 
    
    if (res.status === 404) {
      // 아직 펫이 없다는 의미 → 성공으로 간주, data는 null
      return { success: true, data: null };
    }

    // 그 외는 진짜 에러로 처리
    const error = await res.json();
    return { success: false, error };
  });
};

/**
 * 펫 정보 업데이트 (satiety, pet_type 등)
 * @param {{ email: string, pet_type?: string, satiety?: number }} payload
 */
export const updatePetOnServer = async ({ email, pet_type, satiety }) => {
  return tryServers(async (SERVER_URL) => {
    const body = {};
    if (pet_type !== undefined) body.pet_type = pet_type;
    if (satiety !== undefined) body.satiety = satiety;

    const res = await fetchWithTimeout(`${SERVER_URL}/api/pet/${encodeURIComponent(email)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      // satiety 필드는 선택사항으로 처리
      body: JSON.stringify(body),
    }, 2000);

    const data = await res.json().catch(() => ({}));
    
    if (!res.ok) {
      console.error("펫 업데이트 실패:", data);
      return { success: false, error: data };
    }
    
    console.log("✅ 펫 업데이트 완료:", data);
    return { success: true, data };
  });
};

// Feed Inventory 조회
export const fetchFeedInventory = async (email) => {
  return tryServers(async (SERVER_URL) => {
    const res = await fetchWithTimeout(`${SERVER_URL}/api/feed_inventory/${encodeURIComponent(email)}`);
    if (res.status === 404) {
      // 없으면 생성
      await createFeedInventory(email);
      return { success: true, data: await fetchFeedInventory(email) };
    }
    const data = await res.json();
    return res.ok
      ? { success: true, data }
      : { success: false, error: data };
  });
};

// Feed Inventory 최초 생성
export const createFeedInventory = async (email) => {
  return tryServers(async (SERVER_URL) => {
    const res = await fetchWithTimeout(`${SERVER_URL}/api/feed_inventory/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    return res.ok
      ? { success: true, data }
      : { success: false, error: data };
  });
};

// Feed Inventory 업데이트 (먹이 획득/사용)
export const updateFeedInventoryOnServer = async (email, updatePayload) => {
  // updatePayload 예: { steak_count: 3 } 또는 { apple_count: prev -1 }
  return tryServers(async (SERVER_URL) => {
    const res = await fetchWithTimeout(`${SERVER_URL}/api/feed_inventory/${encodeURIComponent(email)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload),
    });
    const data = await res.json();
    return res.ok
      ? { success: true, data }
      : { success: false, error: data };
  });
};
