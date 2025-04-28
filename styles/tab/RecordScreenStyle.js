import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#E8F1FF',
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
});