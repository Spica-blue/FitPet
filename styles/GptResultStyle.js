import { StyleSheet, Dimensions } from 'react-native';
const { width: screenW, height: screenH } = Dimensions.get('window');

const GptResultStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    position: "relative",
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendationContainer:{
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    // borderWidth: 1,
    // borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  subtitle:{
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
  },
  list:{
    maxHeight: screenH * 0.6,
    marginBottom: 20,
    // borderTopWidth: 1,
    // borderTopColor: '#ddd',
  },
  recList:{
    maxHeight: screenH * 0.4,
    marginBottom: 20,
  },
  table: {
    width: '100%', 
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    // paddingVertical: 6,
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
    padding: 8,
    backgroundColor: '#F5FAFF',
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    // padding: 8,
    textAlign: 'center',
    fontSize: 14,
    color: '#444',
    paddingHorizontal: 1,
    paddingVertical: 7,
  },
  exercise: { 
    // marginTop: 24,
    // paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    paddingVertical: 4,
  },
  exerciseLabel: {
    fontSize: 16,
    color: '#555',
    marginRight: 8,
  },
  exerciseValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111',
  },
  nextButton: {
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
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GptResultStyle;