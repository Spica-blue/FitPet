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

  // ─── 포만감 레이블 + 바 전체 컨테이너 ───────────────────────────────
  satietyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,   // 위아래 여백
    width: "80%",         // 가로폭 80%
  },
  satietyLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6D4C41",     // 따뜻한 브라운
    marginRight: 8,       // 바와의 간격
    width: 60,            // “포만감” 텍스트 고정 폭
  },

  // ─── 포만감 바 전체 영역 (테두리 + 배경) ──────────────────────
  satietyContainer: {
    flex: 1,                  // 남은 공간 모두 차지
    height: 20,               // 막대 높이
    borderWidth: 1,           // 테두리 두께
    borderColor: "#8D6E63",   // 짙은 브라운 테두리
    borderRadius: 8,          // 모서리 둥글게
    backgroundColor: "#FFF3E0", // 연한 베이지 배경(항상 고정)
    overflow: "hidden",       // 채움이 바깥으로 삐져나오지 않도록
    position: "relative",     // 숫자 절대배치(absolute) 용으로 필요
  },

  // ─── 포만감이 채워진 부분 ─────────────────────────────────
  satietyFill: {
    height: "100%",
    // backgroundColor 은 JSX에서 동적으로 할당
  },

  // ─── 전체 바 안쪽 숫자 텍스트(절대위치) ────────────────────
  satietyValue: {
    position: "absolute",
    right: 6,                 // 막대 오른쪽 끝에서 약간 안쪽으로
    top: 0,
    bottom: 0,
    justifyContent: "center",
    fontSize: 12,
    fontWeight: "bold",
    color: "black",    
    // ↓ 아래 속성들을 추가하면 흰색 외곽선(테두리) 효과가 납니다 ↓
    textShadowColor: "#ffffff",      // 그림자(테두리) 색상
    textShadowOffset: { width: 1, height: 1 }, // 그림자 위치를 약간 우하단으로
    textShadowRadius: 1,             // 그림자 퍼짐 반경을 작게 주면 외곽선처럼 보입니다     
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
    height: 115,            // 원하는 높이로 조절 (예: 200)
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
