import { StyleSheet } from "react-native";

const KakaoLoginButtonStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
  },
  kakaoButton: {
    width: "90%",
    backgroundColor: "#FEE500",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  kakaoButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3C1E1E",
  },
});

export default KakaoLoginButtonStyle;


