import { StyleSheet, Dimensions } from 'react-native';
const { width: screenW, height: screenH } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: '#E8F1FF',
    backgroundColor: '#F5FAFF',
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    // paddingHorizontal: 16,
    // paddingBottom: 32,
    padding: 16,
    paddingBottom: 100,
  },
  saveAllButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#4A90E2',   // 메인 컬러
    borderRadius: 30,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,                // Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveAllButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});