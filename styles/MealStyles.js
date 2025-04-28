import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  mealContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Android elevation
    elevation: 3,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    minHeight: 80,
    padding: 8,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  recommendContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  recommendPlaceholder: {
    color: '#AAA',
    marginTop: 8,
  },
  recommendSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  recommendText: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
});