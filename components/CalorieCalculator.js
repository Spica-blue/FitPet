// 1 걸음당 칼로리 소모량(뛰는 기준)
const CALORIE_PER_STEP = 0.1;

/**
 * 사용자의 키와 몸무게를 기반으로 칼로리를 계산하는 함수
 * @param {number} steps - 현재 걸음 수
 * @param {number} height - 키(cm)
 * @param {number} weight - 몸무게(kg)
 * @returns {number} - 계산된 칼로리(소수점 1자리까지)
 */

export const CalorieCalculator = (steps, height, weight) => {
  if(!height || !weight) return 0; // 입력값 없으면 0

  const METS_RUNNING = 7.0; // 뛰는 기준 MET 값
  const STEP_LENGTH = height * 0.415 / 100; // 1걸음당 거리(m)
  const totalDistance = steps * STEP_LENGTH; // 총 거리(m)
  const avgSpeed = 8.0; // 평균 시속 8km (m/s로 변환)
  const timeInHours = totalDistance / (avgSpeed * 1000); // 시간(시간 단위)

  const caloriesBurned = (METS_RUNNING * weight * timeInHours * 60).toFixed(1); // 칼로리 계산
  return parseFloat(caloriesBurned);
};