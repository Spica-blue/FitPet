import { StyleSheet } from "react-native";

const PetStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  charWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  animation: {
    width: 200,
    height: 200,
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  changeButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#4CAF50",
    borderRadius: 20,
  },
  changeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  effectContainer: {
    position: "absolute",
    top: -30,       // 캐릭터 머리 위로 띄우기 (값 조절)
    alignSelf: "center",
    width: 120,
    height: 120
  },
});

export default PetStyle;
