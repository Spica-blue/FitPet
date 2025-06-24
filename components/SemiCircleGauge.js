import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import styles, { DEFAULT_SIZE, DEFAULT_STROKE } from '../styles/SemiCircleGaugeStyle';

// SVG Path를 Animated 전용으로 감싸기
const AnimatedPath = Animated.createAnimatedComponent(Path);

// radius, strokeWidth, 색상 등을 props로 조절할 수 있도록 설계
export default function SemiCircleGauge({ 
  size = DEFAULT_SIZE,
  strokeWidth = DEFAULT_STROKE,
  backgroundColor = '#eee',
  // 그라데이션 컬러 배열, offset 0~1
  gradientColors = [
    { offset: '0%', color: '#62eb9b' },
    { offset: '100%', color: '#8dcef8' },
  ],
  progress = 0.4, // 0~1
  animationDuration = 800,
}) {
  const animated = useRef(new Animated.Value(0)).current;

  // 반원 둘레 길이 = π * r
  const r = (size - DEFAULT_STROKE) / 2;
  const circumference = Math.PI * r;

  // 시작 각도 180도로 반원을 그리고 180° → 0° 방향이 오른쪽 끝
  const offset = DEFAULT_STROKE / 2;
  const path = `
    M ${offset + (size/2 - r)} ${offset + size/2}
    A ${r} ${r} 0 0 1 ${offset + (size/2 + r)} ${offset + size/2}
  `;

  // 애니메이션 시작
  useEffect(() => {
    Animated.timing(animated, {
      toValue: progress,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  // Dashoffset 애니메이션: 0→ circumference
  const strokeDashoffset = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  // SVG 전체 크기: strokeWidth 만큼 여백 포함
  const svgWidth = size + DEFAULT_STROKE;
  const svgHeight = size/2 + DEFAULT_STROKE/2;

  return (
    <View style={[styles.wrapper, { width: svgWidth, height: svgHeight }]}>
      <Svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={styles.svg}>
        <Defs>
          <LinearGradient id="grad" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%">
            {gradientColors.map((g, i) => (
              <Stop
                key={i}
                offset={g.offset}
                stopColor={g.color}
                stopOpacity="1"
              />
            ))}
          </LinearGradient>
        </Defs>

        {/* 트랙(연한 회색 반원) */}
        <Path
          d={path}
          stroke={backgroundColor}
          // strokeWidth={30}
          strokeWidth={DEFAULT_STROKE} 
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* 그라데이션 채움 반원 */}
        <AnimatedPath
          d={path}
          // stroke={fillColor}
          stroke="url(#grad)"
          // strokeWidth={30}
          strokeWidth={DEFAULT_STROKE} 
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset} 
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}
