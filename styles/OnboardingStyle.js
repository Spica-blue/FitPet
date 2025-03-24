import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');

const OnboardingStyle = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  dot: {
    backgroundColor: 'rgba(0, 0, 0, .2)',
  },
  activeDot: {
    backgroundColor: '#d2066c',
  },
  buttonCircle: {
    width: 100,
    height: 40,
    backgroundColor: '#000000',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 30,
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
  naverButton: {
    width: "90%",
    backgroundColor: "#2DB400",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  naverLoginText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default OnboardingStyle;
