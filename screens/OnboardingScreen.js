import React, { useRef, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import styles from "../styles/OnboardingStyle";

const slides = [
  {
    key: 1,
    title: '1',
    text: '첫번째',
    image: require("../assets/icon.png")
  },
  {
    key: 2,
    title: "2",
    text: "두번째",
    image: require("../assets/icon.png")
  },
  {
    key: 3,
    title: "3",
    text: "세번째",
    image: require("../assets/icon.png")
  },
]

const OnboardingScreen = ({ onDone }) => {
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    startAutoSlide(); // 컴포넌트 마운트 시 자동 슬라이드 시작
    return () => clearInterval(intervalRef.current); // 언마운트 시 정리
  }, []);

  const startAutoSlide = () => {
    clearInterval(intervalRef.current); // 기존 타이머 제거
    intervalRef.current = setInterval(() => {
      if (sliderRef.current) {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % slides.length;
          sliderRef.current.goToSlide(nextIndex);
          return nextIndex;
        });
      }
    }, 2500);
  };

  const handleSlideChange = (index) => {
    clearInterval(intervalRef.current); // 수동 조작 시 기존 타이머 정리
    setCurrentIndex(index);
    startAutoSlide(); // 일정 시간 후 다시 자동 슬라이드 시작
  };

  const renderItem = ({ item, index }) => {
    return(
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
        {/* {index === slides.length - 1 && (
          <View style={[styles.buttonCircle, { marginTop: 30 }]}>
            <Text 
              style={styles.buttonText} 
              onPress={handleDone}
            >
              시작하기
            </Text>
          </View>
        )} */}
      </View>
    );
  };

  const handleDone = async () => {
    try{
      onDone();
    } catch(error){
      console.error('Error saving onboarding status:', error);
    }
  }

  return(
    // <AppIntroSlider
    //   renderItem={renderItem}
    //   data={slides}
    //   dotStyle={styles.dot}
    //   activeDotStyle={styles.activeDot}
    // />
    <View style={{ flex: 1, backgroundColor: "#EAF2FF" }}>
      <View style={{ flex: 3 }}>
        <AppIntroSlider
          ref={sliderRef}
          renderItem={renderItem}
          data={slides}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          onSlideChange={handleSlideChange} // 슬라이드 변경 감지
          currentIndex={currentIndex} // 현재 인덱스 전달
        />
      </View>

      {/* 하단 로그인 버튼 */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.kakaoButton} onPress={onDone}>
          <Text style={styles.kakaoButtonText}>카카오로 로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.naverButton} onPress={onDone}>
          <Text style={styles.naverLoginText}>네이버로 로그인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default OnboardingScreen;

