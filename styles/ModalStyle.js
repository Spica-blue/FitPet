import { StyleSheet, Dimensions } from 'react-native';
const { height: screenH } = Dimensions.get('window');

export const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    flex: 1,
    width: '90%',
    maxHeight: screenH * 0.5,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
});