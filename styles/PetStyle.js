import { StyleSheet } from "react-native";

const PetStyle = StyleSheet.create({
  // ───────────────────────────────────────────────────────────────
  // 전체 화면 컨테이너
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    padding: 16,
  },

  // ───────────────────────────────────────────────────────────────
  // 캐릭터 선택 전 (“+” 버튼)
  addButton: {
    alignSelf: "center",
    marginTop: 80,
  },

  // ───────────────────────────────────────────────────────────────
  // 캐릭터 및 애니메이션 영역
  charWrapper: {
    position: "relative",
    alignSelf: "center",
    width: 200,
    height: 200,
    marginVertical: 12,
  },
  animation: {
    width: "100%",
    height: "100%",
  },

  // ───────────────────────────────────────────────────────────────
  // 캐릭터 변경 버튼
  changeButton: {
    alignSelf: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 12,
    marginBottom: 16,
  },
  changeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  // ───────────────────────────────────────────────────────────────
  // 포만감 & 걸음 수 텍스트
  satietyText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 4,
    color: "#333",
  },
  stepsText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
    color: "#555",
  },

  // ───────────────────────────────────────────────────────────────
  // 이펙트(heart / star) 위치 조정
  effectContainer: {
    position: "absolute",
    alignSelf: "center",
    width: 120,
    height: 120,
  },

  // ───────────────────────────────────────────────────────────────
  // “먹이 보관함 열기/닫기” 버튼
  inventoryToggleButton: {
    alignSelf: "center",
    backgroundColor: "#FF8A65",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 8,
  },
  inventoryToggleButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  // ───────────────────────────────────────────────────────────────
  // Overlay (Bottom Sheet 외부를 터치했을 때 닫히게 하는 반투명 배경)
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: "rgba(0,0,0,0.3)",
  },

  // ───────────────────────────────────────────────────────────────
  // Bottom Sheet 형태의 보관함 컨테이너
  inventoryContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,            // 원하는 높이로 조절 (예: 200)
    backgroundColor: "#f9f9f9",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingTop: 12,

    // iOS 그림자
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Android elevation
    elevation: 5,
  },

  // ───────────────────────────────────────────────────────────────
  // 보관함 안내 텍스트 (“아직 먹이가 없습니다.”)
  noInvText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginVertical: 8,
  },

  // ───────────────────────────────────────────────────────────────
  // 보관함 FlatList 컨테이너
  invContainer: {
    paddingHorizontal: 16,
  },
  invItem: {
    backgroundColor: "#E0F7FA",
    marginRight: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 80,
    alignItems: "center",
    flexDirection: "column",
  },
  invIcon: {
    marginBottom: 4,
  },
  invText: {
    fontSize: 14,
    color: "#00796B",
  },
});

export default PetStyle;
