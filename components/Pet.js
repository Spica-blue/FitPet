import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/PetStyle";

// 이펙트별 위치 보정값
const EFFECT_OFFSETS = {
  heart: { top: -110 },
  star:  { top: -130, width: 180, height: 180 },
};

const Pet = () => {
  const [pet, setPet] = useState(null);
  const [effect, setEffect] = useState(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const getEmail = async () => {
    const ui = await AsyncStorage.getItem('userInfo');
    const p = JSON.parse(ui) || {};
    return p.email || p.kakao_account?.email || '';
  };

  useEffect(() => {
    (async () => {
      const email = await getEmail();
      if(!email) return;

      const stored = await AsyncStorage.getItem(`pet_${email}`);
      if(stored) setPet(stored);
    })();
  }, [isFocused]);

  const handlePress = () => {
    navigation.navigate("PetSelection");
  };

  // 캐릭터 터치 시 호출
  const handleCharacterTap = () => {
    // 랜덤으로 heart or star
    const choice = Math.random() < 0.5 ? "heart" : "star";
    setEffect(choice);
  };

  // 이펙트 애니메이션 완료 시
  const onEffectFinish = () => {
    setEffect(null);
  };

  return(
    <View style={styles.container}>
      {/* <LottieView
        source={require("../assets/pet/happy_dog.json")}
        autoPlay
        loop
        style={styles.animation}
      /> */}
      {pet ? (
        <>
          {/* 캐릭터 터치 영역 */}
          <View style={styles.charWrapper}>
            <TouchableOpacity activeOpacity={0.8} onPress={handleCharacterTap}>
              <LottieView
                source={
                  pet === "happy_dog"
                    ? require("../assets/pet/happy_dog.json") 
                    : pet === "happy_cat"
                    ? require("../assets/pet/happy_cat.json")
                    : require("../assets/pet/smile_emoji.json")
                }
                autoPlay
                loop
                style={styles.animation}
              />
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

          <TouchableOpacity onPress={handlePress} style={styles.changeButton}>
            <Text style={styles.changeButtonText}>캐릭터 변경</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity onPress={handlePress} style={styles.addButton}>
          <MaterialIcons name="add-circle-outline" size={64} color="#bbb" />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default Pet;
