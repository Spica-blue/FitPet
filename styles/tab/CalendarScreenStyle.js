import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  calendarContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  dateLabel: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    marginTop: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diaryContent: {
    marginVertical: 12,
    fontSize: 16,
    lineHeight: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
});
