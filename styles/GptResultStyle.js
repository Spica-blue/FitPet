import { StyleSheet } from 'react-native';

const GptResultStyle = StyleSheet.create({
  resultContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fdfdfd',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
    padding: 8,
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
    fontSize: 14,
    color: '#444',
  },
  exerciseContainer: {
    marginTop: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
});

export default GptResultStyle;