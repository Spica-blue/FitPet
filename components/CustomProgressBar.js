import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import styles from "../styles/CustomProgressBarStyle";

const CustomProgressBar = ({ progress, barWidth = 300, height = 12, color = '#4CAF50' }) => {
  // progress: 0.0 ~ 1.0
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // 전체 바 너머에 progress 곱해서 실제 픽셀 너비 계산
  const widthInterpolated = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, barWidth],
  });

  return (
    <View style={[styles.container, { width: barWidth, height }]}>
      
      {/* 트랙 */}
      <View style={styles.track} />

      {/* 채워진 부분 */}
      <Animated.View
        style={[
          styles.fill,
          {
            width: widthInterpolated,
            backgroundColor: color,
            height,
          }
        ]}
      />

      {/* 우측 끝에 퍼센트 텍스트 */}
      <Text style={styles.label}>
        {Math.round(progress * 100)}%
      </Text>
    </View>
  );
}

export default CustomProgressBar;