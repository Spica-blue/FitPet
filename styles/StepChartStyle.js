import { StyleSheet, Dimensions } from 'react-native';

// const { width: screenWidth } = Dimensions.get('window');
// const chartWidth = screenWidth - 32; // 좌우 여백 16씩
// const chartHeight = 200;
// const barCount = 7;
// const barSpacing = 8;
// const barWidth = (chartWidth - barSpacing * (barCount - 1)) / barCount;

export default StyleSheet.create({
  container: {
    // paddingHorizontal: 16,
    // paddingVertical: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: "center",
    // margin: 16,
    // borderWidth:1,
    marginRight: 10,
  },
  loader: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    // width: chartWidth,
    height: 200,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: "100%",
    marginTop: 6,
  },
  label: {
    fontSize: 12,
    color: '#666',
    // width: barWidth,   // Text가 바 중앙에 위치
    textAlign: 'center',
  },
  caption: {
    fontSize: 12,
    color: '#999',
    // textAlign: 'center',
    marginTop: 8,
  },
});