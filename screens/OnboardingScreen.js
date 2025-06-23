import React, { useRef, useEffect, useState } from "react";
import { View, Text, Image, FlatList, Dimensions, Animated } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import styles from "../styles/OnboardingStyle";
import KakaoLoginButton from "../components/KakaoLoginButton";
import NaverLoginButton from "../components/NaverLoginButton";

const { width } = Dimensions.get("window");

const realSlides = [
  {
    key: 1,
    title: "함께 걸어요!",
    text: "당신의 건강 여정,\n귀여운 펫과 함께 시작해요!",
    image: require("../assets/slides/slides_1.png")
  },
  {
    key: 2,
    title: "매일의 걸음",
    text: "걸을수록 배부른 펫!\n매일의 걸음이 성장으로 이어져요.",
    image: require("../assets/slides/slides_2.png")
  },
  {
    key: 3,
    title: "기록하기",
    text: "식단과 운동 목표도 관리하고,\n나만의 펫과 함께 꾸준히!",
    image: require("../assets/slides/slides_3.png")
  },
]

const slides = [
  ...realSlides,
  { ...realSlides[0], key: 'loop' }  // 고유 key
];

const OnboardingScreen = ({ onDone }) => {
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const isResettingRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;

      if (nextIndex >= slides.length) return; // guard

      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });

      // 다음 인덱스가 가짜 첫 번째일 경우, reset 예정
      if (nextIndex === slides.length - 1) {
        setTimeout(() => {
          flatListRef.current.scrollToIndex({ index: 0, animated: false });
          isResettingRef.current = false;
          setCurrentIndex(0);
        }, 250); // 애니메이션 끝나고 0으로 jump
      } 
      else {
        setCurrentIndex(nextIndex);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const renderItem = ({ item }) => (
    <View style={[styles.slide, { width }]}> 
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  return(
    <View style={{ flex: 1, backgroundColor: "#EAF2FF" }}>
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.key.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          if (index === slides.length - 1 && !isResettingRef.current) {
            // reset
            flatListRef.current.scrollToIndex({ index: 0, animated: false });
            setCurrentIndex(0);
          } 
          else {
            setCurrentIndex(index);
          }
        }}
        removeClippedSubviews={false} // <-- 깜빡임 방지에 도움됨
        windowSize={slides.length + 1} // 렌더 버퍼 확장
      />

      {/* 페이지 인디케이터 (흰 배경) */}
      <View style={{ backgroundColor: "white", paddingVertical: 16 }}>
        <View style={styles.dotContainer}>
          {realSlides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, currentIndex === i ? styles.activeDot : null]}
            />
          ))}
        </View>
      </View>

      {/* 하단 로그인 버튼 */}
      <View style={styles.bottomContainer}>
        <KakaoLoginButton />
        <NaverLoginButton />
      </View>
    </View>
  );
}

export default OnboardingScreen;

