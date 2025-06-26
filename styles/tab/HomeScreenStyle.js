import { StyleSheet, Dimensions } from 'react-native';
const { width: screenW } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 66,
    paddingHorizontal: 16,
    backgroundColor: '#F5FAFF'
  },
  gaugeWrapper: {
    // 반원 게이지가 살짝 캐릭터 뒤로 겹치도록 margin 조정
    marginBottom: -screenW * 0.3,  
    zIndex: 0,
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});