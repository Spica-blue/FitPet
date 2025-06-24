import { StyleSheet, Dimensions } from 'react-native';

const { width: screenW } = Dimensions.get('window');
export const DEFAULT_SIZE = screenW * 0.8;
export const DEFAULT_STROKE = 30;

export default StyleSheet.create({
  wrapper: {
    width: DEFAULT_SIZE,
    height: DEFAULT_SIZE / 2,
  },
  svg: {
    // 필요시 터치 영역 확보 등
  },
});