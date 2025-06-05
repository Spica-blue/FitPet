import React from "react";
import { View, Text } from "react-native";
import styles from "../styles/PetStyle";

/**
 * SatietyBar 컴포넌트
 * @param {{ satiety: number, maxSatiety: number }} props
 */
const SatietyBar = ({ satiety, maxSatiety }) => {
  // 퍼센트 계산 (0~1)
  const percent = Math.min(Math.max(satiety / maxSatiety, 0), 1);
  const fillWidth = `${percent * 100}%`;

  // 1) 색상을 satiety 값에 따라 결정
  let fillColor = "#FFD54F"; // 기본(노란색)
  if (satiety < 20) {
    fillColor = "#E57373";   // 배고프면 빨간색
  } 
  else if (satiety >= 80) {
    fillColor = "#81C784";   // 포만하면 초록색
  }
  else{
    fillColor = "#FFD54F"; 
  }

  return (
    <View style={styles.satietyRow}>
      {/* 1) 왼쪽 “포만감” 레이블 */}
      <Text style={styles.satietyLabel}>포만감</Text>

      {/* 2) 바 전체 테두리 + 배경 (position:relative) */}
      <View style={styles.satietyContainer}>
        {/* 3) 채워진 부분: width를 percent * 100%로 지정 */}
        {/* <View style={[styles.satietyFill, { width: `${percent * 100}%` }]} /> */}
        <View style={[styles.satietyFill, { width: fillWidth, backgroundColor: fillColor },]} />

        {/* 4) 전체 바 안쪽 오른쪽 끝에 숫자 (절대위치) */}
        <Text style={styles.satietyValue}>{satiety}</Text>
      </View>
    </View>
  );
};

export default SatietyBar;
