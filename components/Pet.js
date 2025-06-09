import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, TouchableWithoutFeedback, Text, FlatList, ToastAndroid, Platform, Alert } from "react-native";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import styles from "../styles/PetStyle";
import SatietyBar from "./SatietyBar";
import { updatePetOnServer, fetchFeedInventory, updateFeedInventoryOnServer, fetchPetFromServer } from "../utils/UserAPI";
import { getTodayKstString } from "../utils/DateUtils";

/** ───────────────────────────────────────────────────────────────
 * 1) 상수 정의
 * ───────────────────────────────────────────────────────────────
 */

/** ▶ FOOD_VALUES
 *   먹이 아이템별 기본 포만감 증가량 (예시)
 */
const FOOD_VALUES = {
  steak: 35,    // 스테이크 (강아지 선호)
  bone: 15,     // 뼈다귀 (강아지 선호)
  kibble: 20,   // 사료 (강아지 선호)
  fish: 25,     // 생선 (고양이 선호)
  catnip: 30,   // 캣닢 (고양이 선호)
  milk: 10,     // 우유 (고양이 선호)
  apple: 20,    // 사과 (이모지/일반 선호)
  candy: 5,     // 사탕 (이모지 선호)
  carrot: 8,    // 당근 (이모지 선호)
};

/** ▶ PET_FOOD_PREFERENCES
 *   반려동물별 선호 먹이와 보너스 배수(multiplier) 또는 가감량(addition)
 *   key: petType (asyncStorage에 저장된 값, ex. "happy_dog", "happy_cat", "smile_emoji")
 */
const PET_FOOD_PREFERENCES = {
  // ▷ happy_dog 선호: steak x1.5 / bone x1.2 / kibble x1.1
  happy_dog: {
    multiplier: { steak: 1.5, bone: 1.2, kibble: 1.1 },
    addition: {},
  },
  // ▷ happy_cat 선호: fish x1.4 / catnip x2.0 / milk x1.2
  happy_cat: {
    multiplier: { fish: 1.4, catnip: 2.0, milk: 1.2 },
    addition: {},
  },
  // ▷ smile_emoji 선호: apple x1.3 / candy x1.7 / carrot x1.1
  smile_emoji: {
    multiplier: { apple: 1.3, candy: 1.7, carrot: 1.1 },
    addition: {},
  },
};

/** ▶ MAX_SATIETY, MIN_SATIETY
 *   포만감 범위 (0~100)
 */
const MAX_SATIETY = 100;
const MIN_SATIETY = 0;

/** ▶ PET_ANIMATIONS
 *   포만감 상태별 Lottie JSON 경로
 *   - happy   : 포만감 ≥ 80    → very_happy_dog / love_cat / happy_emoji
 *   - normal  : 20 ≤ 포만감 < 80 → happy_dog / happy_cat / smile_emoji
 *   - hungry  : 포만감 < 20     → angry_dog / hungry_cat / angry_emoji
 *
 *   JSON 파일 경로: 프로젝트 root 기준으로 표현
 */
const PET_ANIMATIONS = {
  happy: {
    happy_dog: require("../assets/pet/very_happy_dog.json"),
    happy_cat: require("../assets/pet/love_cat.json"),
    smile_emoji: require("../assets/pet/happy_emoji.json"),
  },
  normal: {
    happy_dog: require("../assets/pet/happy_dog.json"),
    happy_cat: require("../assets/pet/happy_cat.json"),
    smile_emoji: require("../assets/pet/smile_emoji.json"),
  },
  hungry: {
    happy_dog: require("../assets/pet/angry_dog.json"),
    happy_cat: require("../assets/pet/hungry_cat.json"),
    smile_emoji: require("../assets/pet/angry_emoji.json"),
  },
};

/** ▶ FOOD_LIST
 *   FOOD_VALUES 객체의 key 목록 (["steak","bone",…])
 */
const FOOD_LIST = Object.keys(FOOD_VALUES);

/** ▶ EFFECT_OFFSETS
 *   이펙트(heart, star)별 Lottie 오프셋 보정값
 *   (styles.effectContainer 위치를 override)
 */
const EFFECT_OFFSETS = {
  heart: { top: -110 },
  star:  { top: -130, width: 180, height: 180 },
};

/** ▶ ICON_MAP + getIconNameForFood
 *   MaterialCommunityIcons 용 먹이 아이콘 이름 매핑
 */
const ICON_MAP = {
  steak: "hamburger",
  bone: "bone",
  kibble: "food",
  fish: "fish",
  catnip: "flower-tulip",
  milk: "cup",
  apple: "apple",
  candy: "candy",
  carrot: "carrot",
};
const getIconNameForFood = (foodKey) => ICON_MAP[foodKey] || "food";

/** ───────────────────────────────────────────────────────────────
 * Pet 컴포넌트
 *  - AsyncStorage에서 goalSteps_{email}을 가져와 상태에 저장
 *  - 걸음 목표 배수마다 자동으로 랜덤 먹이를 지급
 *  - 반려동물별 선호도 보너스 적용 → 포만감 계산
 *  - 포만감 상태별 Lottie 애니메이션 전환
 *  - 캐릭터 터치 시 하트/별 이펙트
 *  - 보관함(inventory) 관리
 * ───────────────────────────────────────────────────────────────
 */
const Pet = (props) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  
  // ─────────────────────────────────────────────────────────────
  // 1) pet 불러오기 (AsyncStorage: pet_{email} 키)
  const [pet, setPet] = useState(null);
  const [visitedChecked, setVisitedChecked] = useState(false);
  const [feedInv, setFeedInv] = useState(null);

  const getEmail = async () => {
    const ui = await AsyncStorage.getItem('userInfo');
    const p = JSON.parse(ui) || {};
    return p.email || p.kakao_account?.email || '';
  };

  /** 1) 로컬 AsyncStorage에서 pet_{email} 읽어오기 **/
  const loadPet = async () => {
    const email = await getEmail();
    if(!email) return;

    // 1) 서버에서 pet_type + satiety 가져오기
    const { success, data, error } = await fetchPetFromServer(email);
    if (!success) {
      // console.warn("펫 조회 실패:", error);
      return;
    }

    // ★ data가 null이면 아직 서버에 펫이 없는 상태
    if (data === null) {
      // 로컬에서 pet 키가 남아있을 수도 있으니 초기화
      await AsyncStorage.removeItem(`pet_${email}`);
      setPet(null);
      setSatiety(0);
      setVisitedChecked(true);
      return;
    }

    // 2) 로컬 pet 타입이 바뀌었으면 AsyncStorage 갱신
    const storedPet = await AsyncStorage.getItem(`pet_${email}`);
    if (storedPet && data.pet_type !== storedPet) {
      // 서버에 pet_type 업데이트
      await updatePetOnServer({ email, pet_type: storedPet });
      data.pet_type = storedPet;
    }

    // ③ 상태 동기화
    setPet(data.pet_type);
    setSatiety(data.satiety);
    setVisitedChecked(true);  // 이후 hunger 체크 허용
  };

  // Pet 화면이 포커스될 때마다 loadPet 실행
  useEffect(() => {
    loadPet();
  }, [isFocused]);

  // 1) Pet이 로드될 때 inventory 초기화
  useEffect(() => {
    const init = async () => {
      const email = await getEmail();
      const res = await fetchFeedInventory(email);
      if (res.success) {
        setFeedInv(res.data);
        setInventory(buildArrayFromCounts(res.data)); // 화면용 배열 생성
      }
    };
    init();
  }, [pet]);

  // 헬퍼: 서버의 counts → 배열 변환
  const buildArrayFromCounts = (inv) => {
    const arr = [];
    Object.entries(inv).forEach(([key, count]) => {
      if (key.endsWith("_count") && count > 0) {
        const foodKey = key.replace("_count", "");
        for (let i = 0; i < count; i++) arr.push(foodKey);
      }
    });
    return arr;
  };

  // 현재 시각을 한국 표준시(KST)로 변환하여 Date 객체로 반환
  const nowKst = () => {
    const d = new Date();
    return new Date(d.getTime() + 9 * 60 * 60_000);
  }

  // useEffect(async () => {
  //   const email = await getEmail();
  //   const KEY = `lastVisitDate_${email}`;
  //   const stored = await AsyncStorage.getItem(KEY);
  //   console.log("last:", stored);
  // }, []);

  // --- 하루 이상 미접속 시 satiety 감소 처리 ---
  useEffect(() => {
    const checkHunger = async () => {
      if(!visitedChecked || pet == null) return;

      const email = await getEmail();
      const KEY = `lastVisitDate_${email}`;
      const stored = await AsyncStorage.getItem(KEY);

      // 오늘 날짜 (KST) YYYY-MM-DD
      // const today = nowKst();
      // today.setHours(0,0,0,0);
      // const todayStr = formatDateLocal(today);
      const todayStr = getTodayKstString();

      // console.log("today", today);
      console.log("todaystr", todayStr);

      // 1) 마지막 방문 날짜가 없으면 → 오늘로만 초기화, 감소 로직은 건너뛰기
      if (!stored) {
        await AsyncStorage.setItem(KEY, todayStr);
        return;
      }
      // 2) 이미 오늘 처리했으면 아무 작업 안 함
      if (stored === todayStr) {
        return;
      }

      // 3) 이전 날짜라면 경과일 계산
      const last = new Date(stored);
      last.setHours(0,0,0,0);
      // 여기서도 KST 문자열을 Date로 파싱하면 현지 TZ와 무관하게 00:00로 처리
      const diffMs = new Date(todayStr) - last;
      // const diffMs = today - last;
      const daysDiff = Math.floor(diffMs / (24*60*60*1000));

      if (daysDiff > 0) {
        // 하루당 10씩 감소
        setSatiety(prev => {
          const next = Math.max(0, prev - daysDiff * 10);
          // 서버에도 갱신
          updatePetOnServer({ email, satiety: next })
            .catch(e => console.warn("서버 satiety 업데이트 실패", e));
          return next;
        });
        // 마지막 방문을 오늘로 갱신
        await AsyncStorage.setItem(KEY, todayStr);
      }
    };

    checkHunger();
  }, [visitedChecked]);

  // ─────────────────────────────────────────────────────────────
  // 3) React state 정의
  const [effect, setEffect] = useState(null);
  const [satiety, setSatiety] = useState(10);
  const [inventory, setInventory] = useState([]);
  const [animateJson, setAnimateJson] = useState(null);
  const [lastRewardMul, setLastRewardMul] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // “먹이 보관함”을 화면 하단에서 토글로 보여줄지 여부
  const [isInventoryVisible, setIsInventoryVisible] = useState(false);

  // ─────────────────────────────────────────────────────────────
  // 5) 걸음 수가 바뀔 때마다 “목표 배수” 계산 → inventory에만 무작위 먹이 추가
  // 1) 하루가 바뀌었으면 lastRewardMul 초기화
  useEffect(() => {
    (async () => {
      const email = await getEmail();
      const todayKey = `lastVisitDate_${email}`;
      const lastDate = await AsyncStorage.getItem(todayKey);
      // const todayStr = formatDateLocal(new Date());
      const todayStr = getTodayKstString();
      if (lastDate !== todayStr) {
        await AsyncStorage.multiRemove([todayKey, `lastRewardMul_${email}`]);
        await AsyncStorage.setItem(todayKey, todayStr);
      }
    })();
  }, []);

  // 2) 마운트 시 AsyncStorage 에서 lastRewardMul 불러오기
  useEffect(() => {
    (async () => {
      const email = await getEmail();
      const stored = await AsyncStorage.getItem(`lastRewardMul_${email}`);
      setLastRewardMul(stored ? parseInt(stored, 10) : 0);
      setInitialized(true);
    })();
  }, []);

  // 3) 펫이 바뀔 때마다 lastRewardMul을
  //    '지금까지 달성된 배수'로 초기화
  useEffect(() => {
    if (!pet || props.goalSteps <= 0) return;

    (async () => {
      const email = await getEmail();
      const key = `lastRewardMul_${email}`;

      // 지금까지 달성된 배수
      const mul = Math.floor(props.currentSteps / props.goalSteps);

      // AsyncStorage와 state 동기화
      await AsyncStorage.setItem(key, mul.toString());
      setLastRewardMul(mul);
      setInitialized(true);
    })();
  }, [pet]);

  // 4) goalSteps 배수 달성 시만 먹이 지급
  useEffect(() => {
    if (!initialized || props.goalSteps <= 0) return;

    const newMul = Math.floor(props.currentSteps / props.goalSteps);
    if (newMul > lastRewardMul) {
      for (let m = lastRewardMul + 1; m <= newMul; m++) {
        obtainRandomFood();
      }
      setLastRewardMul(newMul);

      // AsyncStorage에도 꼭 저장!
      (async () => {
        const email = await getEmail();
        await AsyncStorage.setItem(
          `lastRewardMul_${email}`,
          newMul.toString()
        );
      })();
    }
  }, [props.currentSteps, props.goalSteps, lastRewardMul, initialized]);

  // ─────────────────────────────────────────────────────────────
  // 6) 포만감이 바뀔 때마다 애니메이션 전환
  useEffect(() => {
    if(!pet) return;

    if(satiety >= 80){
      setAnimateJson(PET_ANIMATIONS.happy[pet]);
    }
    else if(satiety < 20){
      setAnimateJson(PET_ANIMATIONS.hungry[pet]);
    }
    else{
      setAnimateJson(PET_ANIMATIONS.normal[pet]);
    }
  }, [satiety, pet]);

  // ─────────────────────────────────────────────────────────────
  // 7) 캐릭터 터치 시 하트/별 이펙트
  const handleCharacterTap = () => {
    // 랜덤으로 heart or star
    const choice = Math.random() < 0.5 ? "heart" : "star";
    setEffect(choice);
  };
  
  // 이펙트 애니메이션 완료 시
  const onEffectFinish = () => {
    setEffect(null);
  };

  // ─────────────────────────────────────────────────────────────
  // 8) feedPet(foodKey): 보관함에서 선택 시 호출
  //    - 포만감 증가 + inventory에서 해당 아이템 제거
  const feedPet = async (foodKey, index) => {
    if(!pet || !FOOD_VALUES[foodKey]) return;

    const baseValue = FOOD_VALUES[foodKey];
    const pref = PET_FOOD_PREFERENCES[pet] || {};
    const { multiplier = {}, addition = {} } = pref;

    let finalValue = baseValue;
    if(multiplier[foodKey] != null){
      finalValue = Math.round(baseValue * multiplier[foodKey]);
    }
    else if(addition[foodKey] != null){
      finalValue = baseValue + addition[foodKey];
    }

    let nextSat = satiety + finalValue;
    if(nextSat > MAX_SATIETY) nextSat = MAX_SATIETY;

    setSatiety(nextSat);

    // 서버에 satiety 업데이트
    getEmail().then((email) => {
      updatePetOnServer({ email, satiety: nextSat })
        .then(result => {
          if(!result.success){
            console.warn("서버에 satiety 업데이트 실패:", result.error);
          }
        });
    });

    // 선택한 index의 아이템만 제거
    setInventory((prev) => {
      const arr = [...prev];
      arr.splice(index, 1);
      return arr;
    });

    // 서버 업데이트
    const email = await getEmail();
    const field = `${foodKey}_count`;
    const newCount = (feedInv?.[field] ?? 1) - 1;
    const res = await updateFeedInventoryOnServer(email, { [field]: newCount });
    if (res.success) {
      setFeedInv(res.data);
    }

    Alert.alert(
      "🍽 먹이 주기 성공!",
      `펫(${pet})이 '${foodKey}'을(를) 먹고, 포만감이 ${finalValue}만큼 증가했습니다.`
    );
  };

  // ─────────────────────────────────────────────────────────────
  // 9) obtainRandomFood(): 목표 배수 달성 시 “먹이 얻기”
  //    - inventory 배열에 itemKey만 추가 (포만감 변화 없음)
  const obtainRandomFood = async () => {
    const idx = Math.floor(Math.random() * FOOD_LIST.length);
    const randomFood = FOOD_LIST[idx];

    // 보관함에 새 먹이 추가
    // setInventory((prev) => [...prev, randomFood]);

    // 서버 업데이트
    const email = await getEmail();
    const field = `${randomFood}_count`;
    const newCount = (feedInv?.[field] ?? 0) + 1;
    const res = await updateFeedInventoryOnServer(email, { [field]: newCount });
    if (res.success) {
      // 2) 서버 반영된 새 inventory로 로컬 state 동기화
      setFeedInv(res.data);
      setInventory(buildArrayFromCounts(res.data));

      // 3) 이 시점에만 “정말로 얻은” 먹이 알림
      const message = `새 먹이를 얻었습니다: ${randomFood}`;
      if (Platform.OS === "android") {
        ToastAndroid.show(message, ToastAndroid.SHORT);
      } 
      else {
        Alert.alert("새 먹이 획득", message);
      }
    }
    
    // 토스트 알림 띄우기
    // const message = `새 먹이를 얻었습니다: ${randomFood}`;
    // if(Platform.OS === "android"){
    //   ToastAndroid.show(message, ToastAndroid.SHORT);
    // }
    // else{
    //   // iOS에는 ToastAndroid가 없으므로 간단히 Alert로 대체하거나,
    //   // react-native-root-toast 같은 라이브러리를 사용해도 됩니다.
    //   Alert.alert("새 먹이 획득", message);
    // }
  };

  // ─────────────────────────────────────────────────────────────
  // 10) renderInventoryItem: 보관함 아이템 렌더링
  //     - 아이콘 + 이름 표시, 터치 시 Alert
  const renderInventoryItem = ({ item, index }) => (
    <TouchableOpacity 
      style={styles.invItem}
      onPress={() => {
        Alert.alert(
          "먹이 주기",
          `${item}을(를) 정말 먹이시겠습니까?`,
          [
            { text: "취소", style: "cancel"},
            {
              text: "예",
              onPress: () => feedPet(item, index),
            },
          ]
        );
      }}
    >
      <MaterialCommunityIcons
        name={getIconNameForFood(item)}
        size={28}
        color="#00796B"
        style={styles.invIcon}
      />
      <Text style={styles.invText}>{item}</Text>
    </TouchableOpacity>
  );

  // ─────────────────────────────────────────────────────────────
  // 11) 캐릭터 변경 화면으로 이동
  const handlePress = () => {
    navigation.navigate("PetSelection");
  };

  // ─────────────────────────────────────────────────────────────
  // 12) “먹이 보관함 열기/닫기” 버튼 토글 핸들러
  const toggleInventory = () => {
    setIsInventoryVisible((prev) => !prev);
  };

  // pet 캐시 삭제
  async function clearLocalPetCache() {
    // 1) 저장된 모든 키를 가져와서
    const allKeys = await AsyncStorage.getAllKeys();
    // 2) pet_ 로 시작하는 키만 필터
    const petKeys = allKeys.filter(k => k.startsWith('pet_'));
    const lastKeys = allKeys.filter(k => k.startsWith('lastVisitDate_'));
    const mulKeys = allKeys.filter(k => k.startsWith('lastRewardMul_'));
    
    if (petKeys.length > 0) {
      // 3) 한 번에 제거
      await AsyncStorage.multiRemove(petKeys);
      await AsyncStorage.multiRemove(lastKeys);
      await AsyncStorage.multiRemove(mulKeys);
      console.log(`로컬 캐시 삭제: ${petKeys.join(', ')}`);
      console.log(`로컬 캐시 삭제: ${lastKeys.join(', ')}`);
      console.log(`로컬 캐시 삭제: ${mulKeys.join(', ')}`);
    }
  }

  // useEffect(() => {
  //   clearLocalPetCache();
  // }, []);

  // ─────────────────────────────────────────────────────────────
  // 13) 최종 렌더링
  return(
    <View style={styles.container}>
      {pet ? (
        <>
          {/* 캐릭터 터치 영역 */}
          <View style={styles.charWrapper}>
            <TouchableOpacity activeOpacity={0.8} onPress={handleCharacterTap}>
              {animateJson && (
                <LottieView
                  source={animateJson}
                  autoPlay
                  loop
                  style={styles.animation}
                />
              )}
            </TouchableOpacity>

            {/* 하트/별 이펙트 */}
            {effect && (
              <LottieView
                source={
                  effect === "heart"
                    ? require("../assets/eff/heart.json")
                    : require("../assets/eff/star.json") 
                }
                autoPlay
                loop={false}
                onAnimationFinish={onEffectFinish}
                // 이펙트별 오프셋을 style 로 덮어쓰기
                style={[
                  styles.effectContainer,
                  EFFECT_OFFSETS[effect]
                ]}
              />
            )}
          </View>

          {/* 12-4) 포만감 레이블 + 바 */}
          <SatietyBar satiety={satiety} maxSatiety={MAX_SATIETY} />

          {/* 12-3) 캐릭터 변경 버튼 */}
          <TouchableOpacity onPress={handlePress} style={styles.changeButton}>
            <Text style={styles.changeButtonText}>캐릭터 변경</Text>
          </TouchableOpacity>

          {/* 12-5) “먹이 보관함 열기/닫기” 버튼 */}
          <TouchableOpacity
            onPress={toggleInventory}
            style={styles.inventoryToggleButton}
          >
            <Text style={styles.inventoryToggleButtonText}>
              {isInventoryVisible ? "먹이 보관함 닫기" : "먹이 보관함 열기"}
            </Text>
          </TouchableOpacity>

          {/* 12-6) Overlay + Bottom Sheet 형태의 보관함 */}
          {isInventoryVisible && (
            // 1) 겹쳐서 화면 전체를 덮는 반투명 오버레이
            <TouchableWithoutFeedback onPress={toggleInventory}>
              <View style={styles.overlay}>
                {/* 2) Bottom Sheet 영역: 내부만 터치 이벤트를 막기 위해 TouchableWithoutFeedback 둘러싸기 */}
                <TouchableWithoutFeedback>
                  <View style={styles.inventoryContainer}>
                    {inventory.length === 0 ? (
                      <Text style={styles.noInvText}>아직 먹이가 없습니다.</Text>
                    ) : (
                      <FlatList
                        data={inventory}
                        renderItem={renderInventoryItem}
                        keyExtractor={(item, idx) => item + "_" + idx}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.invContainer}
                      />
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          )}
        </>
      ) : (
        <TouchableOpacity onPress={handlePress} style={styles.addButton}>
          <MaterialCommunityIcons name="plus-circle-outline" size={64} color="#bbb" />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default Pet;
