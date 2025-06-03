import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, TouchableWithoutFeedback, Text, FlatList, ToastAndroid, Platform, Alert } from "react-native";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import styles from "../styles/PetStyle";

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
const Pet = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  
  // ─────────────────────────────────────────────────────────────
  // 1) pet 불러오기 (AsyncStorage: pet_{email} 키)
  const [pet, setPet] = useState(null);

  const getEmail = async () => {
    const ui = await AsyncStorage.getItem('userInfo');
    const p = JSON.parse(ui) || {};
    return p.email || p.kakao_account?.email || '';
  };

  const loadPet = async () => {
    const email = await getEmail();
    if(!email) return;

    const stored = await AsyncStorage.getItem(`pet_${email}`);
    if(stored) setPet(stored);
  };

  useEffect(() => {
    loadPet();
  }, [isFocused]);

  // ─────────────────────────────────────────────────────────────
  // 2) stepCount, goalSteps 불러오기 (AsyncStorage: stepCount_{email}, goalSteps_{email})
  const [currentSteps, setCurrentSteps] = useState(0);
  const [goalSteps, setGoalSteps] = useState(10000);

  const loadStepsAndGoal = async () => {
    const email = await getEmail();
    if(!email) return;

    // 2-1) goalSteps 읽기
    const stored = await AsyncStorage.getItem(`goalSteps_${email}`);
    if(stored){
      const num = parseInt(stored, 10);
      if(!isNaN(num) && num > 0){
        setGoalSteps(num);
      }
    }

    // 2-2) stepCount 읽기
    const storedSteps = await AsyncStorage.getItem(`stepCount_${email}`);
    if(storedSteps){
      const s = parseInt(storedSteps, 10);
      if (!isNaN(s) && s >= 0) {
        setCurrentSteps(s);
      }
    }
  };

  useEffect(() => {
    loadStepsAndGoal();
  }, [isFocused]);

  // ─────────────────────────────────────────────────────────────
  // 3) React state 정의
  const [effect, setEffect] = useState(null);
  const [satiety, setSatiety] = useState(50);
  const [inventory, setInventory] = useState([]);
  const [animateJson, setAnimateJson] = useState(null);
  const [lastRewardMul, setLastRewardMul] = useState(0);

  // “먹이 보관함”을 화면 하단에서 토글로 보여줄지 여부
  const [isInventoryVisible, setIsInventoryVisible] = useState(false);

  // ─────────────────────────────────────────────────────────────
  // 4) 테스트용 걸음 수 증가 시뮬레이션
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentSteps((prev) => {
  //       const next = prev + 3000;
  //       return next > goalSteps * 2 ? goalSteps * 2 : next;
  //     });
  //   }, 3000);
  //   console.log("step:", currentSteps);

  //   return () => clearInterval(timer);
  // }, [goalSteps]);

  // ─────────────────────────────────────────────────────────────
  // 5) 걸음 수가 바뀔 때마다 “목표 배수” 계산 → inventory에만 무작위 먹이 추가
  useEffect(() => {
    if(goalSteps <= 0) return;

    const newMul = Math.floor(currentSteps / goalSteps);
    if(newMul > lastRewardMul){
      // lastRewardMul+1 부터 newMul까지 “먹이 얻기”만 수행
      for(let m=lastRewardMul+1;m<=newMul;m++){
        obtainRandomFood();
      }
      setLastRewardMul(newMul);
    }
  }, [currentSteps, goalSteps]);

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
  const feedPet = (foodKey, index) => {
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

    // 선택한 index의 아이템만 제거
    setInventory((prev) => {
      const arr = [...prev];
      arr.splice(index, 1);
      return arr;
    });

    Alert.alert(
      "🍽 먹이 주기 성공!",
      `펫(${pet})이 '${foodKey}'을(를) 먹고, 포만감이 ${finalValue}만큼 증가했습니다.`
    );
  };

  // ─────────────────────────────────────────────────────────────
  // 9) obtainRandomFood(): 목표 배수 달성 시 “먹이 얻기”
  //    - inventory 배열에 itemKey만 추가 (포만감 변화 없음)
  const obtainRandomFood = () => {
    const idx = Math.floor(Math.random() * FOOD_LIST.length);
    const randomFood = FOOD_LIST[idx];

    // 보관함에 새 먹이 추가
    setInventory((prev) => [...prev, randomFood]);
    
    // 토스트 알림 띄우기
    const message = `새 먹이를 얻었습니다: ${randomFood}`;
    if(Platform.OS === "android"){
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
    else{
      // iOS에는 ToastAndroid가 없으므로 간단히 Alert로 대체하거나,
      // react-native-root-toast 같은 라이브러리를 사용해도 됩니다.
      Alert.alert("새 먹이 획득", message);
    }
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
                  // source={
                  //   pet === "happy_dog"
                  //     ? require("../assets/pet/happy_dog.json") 
                  //     : pet === "happy_cat"
                  //     ? require("../assets/pet/happy_cat.json")
                  //     : require("../assets/pet/smile_emoji.json")
                  // }
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

          {/* 12-4) 포만감 & 걸음 수 표시 */}
          <Text style={styles.satietyText}>
            포만감 : {satiety} / {MAX_SATIETY}
          </Text>

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
