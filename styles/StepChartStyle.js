// import { StyleSheet, Dimensions, Platform } from 'react-native';

// const screenWidth = Dimensions.get('window').width;

// export default StyleSheet.create({
//   container: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     marginHorizontal: 16,
//     marginVertical: 8,
//   },
//   chart: {
//     borderRadius: 12,
//     backgroundColor: '#fff',
//   },
//   loaderContainer: {
//     height: 240,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   caption: {
//     marginTop: 8,
//     fontSize: 12,
//     color: '#666',
//     textAlign: 'center',
//   },
//   // chart-kit에 넘길 config (JS 객체)
//   chartConfig: {
//     backgroundGradientFrom: '#fff',
//     backgroundGradientTo: '#fff',
//     decimalPlaces: 0,
//     propsForLabels: { fontSize: 12, fill: '#333' },
//     barPercentage: 1,
//     color: (opacity = 1) => `rgba(60,60,60, ${opacity})`, // bar outline / label
//     fillShadowGradient: '#888',         // bar 채우기 시작 색
//     fillShadowGradientOpacity: 0.4,     // bar 채우기 투명도
//   },
//   // BarChart에 바로 spread 할 props
//   chartProps: {
//     width: screenWidth - 32,
//     height: 240,
//     fromZero: true,
//     showValuesOnTopOfBars: true,
//     withInnerLines: true,
//     withCustomBarColorFromData: true,
//     flatColor: true,
//   },
//   // 막대 위에 표시되는 값 텍스트 스타일
//   valueLabel: {
//     fontSize: 10,
//     color: '#444',
//     fontWeight: '600',
//     position: 'absolute',    // 필요에 따라 decorator로 위치 조정
//     top: 4,
//     alignSelf: 'center',
//     ...Platform.select({
//       ios: { textShadowColor: 'rgba(0,0,0,0.1)', textShadowOffset: {width:0,height:1}, textShadowRadius:1 },
//       android: { textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: {width:0,height:1}, textShadowRadius:1 },
//     }),
//   },
// });

import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 32; // 좌우 여백 16씩
const chartHeight = 200;
const barCount = 7;
const barSpacing = 8;
const barWidth = (chartWidth - barSpacing * (barCount - 1)) / barCount;

export default StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
  },
  loader: {
    height: chartHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    width: chartWidth,
    height: chartHeight,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  label: {
    fontSize: 12,
    color: '#666',
    width: barWidth,   // Text가 바 중앙에 위치
    textAlign: 'center',
  },
  caption: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});