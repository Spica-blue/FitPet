import { StyleSheet, Dimensions } from "react-native";
const { width: screenW, height: screenH } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5FAFF',
  },
  calendarContainer: {
    height: screenH * 0.45,
    borderRadius: 16,
    overflow: 'hidden',
    // 카드 느낌을 위해 그림자 추가
    backgroundColor: "#Fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  dateLabel: {
    // marginTop: 12,
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  footer: {
    marginTop: 24,
    // paddingHorizontal: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    // 부드러운 그림자
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    alignItems: 'flex-start',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diaryScroll: {
    height: screenH * 0.17,  
    marginTop: 12,
    marginBottom: 5,
    // backgroundColor: "#EFF8FF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dee2e6",
    width: "100%"
  },
  diaryContent: {
    // marginVertical: 12,
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    color: "#55555",
    // backgroundColor: "gray",
  },
  workoutStatus: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",            // 블루 포인트 컬러
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: "100%",
    marginTop: 16,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#4A90E2",  // 주요 액션 버튼은 선명한 블루
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#FF3B30",  // 삭제 버튼은 경고성 레드
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
    // 살짝 그림자
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
