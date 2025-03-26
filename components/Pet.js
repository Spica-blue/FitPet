import React from "react";
import { View, Text } from "react-native";
import LottieView from "lottie-react-native";
import styles from "../styles/PetStyle";

const Pet = () => {
  return(
    <View style={styles.container}>
      <LottieView
        source={require("../assets/pet/LottieLego.json")}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  )
}

export default Pet;
