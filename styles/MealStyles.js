import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  mealContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    // Android elevation
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 8,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: "#333",
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    minHeight: 80,
    padding: 12,
    marginBottom: 12,
    textAlignVertical: "top",
  },
});