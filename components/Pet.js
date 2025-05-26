import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/PetStyle";

const Pet = () => {
  const [pet, setPet] = useState(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const getEmail = async () => {
    const ui = await AsyncStorage.getItem('userInfo');
    const p = JSON.parse(ui) || {};
    return p.email || p.kakao_account?.email || '';
  };

  useEffect(() => {
    (async () => {
      const email = await getEmail();
      if(!email) return;

      const stored = await AsyncStorage.getItem(`pet_${email}`);
      if(stored) setPet(stored);
    })();
  }, [isFocused]);

  const handlePress = () => {
    navigation.navigate("PetSelection");
  };

  return(
    <View style={styles.container}>
      {/* <LottieView
        source={require("../assets/pet/happy_dog.json")}
        autoPlay
        loop
        style={styles.animation}
      /> */}
      {pet ? (
        <>
          <LottieView
            source={
              pet === "happy_dog"
                ? require("../assets/pet/happy_dog.json") 
                : pet === "happy_cat"
                ? require("../assets/pet/happy_cat.json")
                : require("../assets/pet/smile_emoji.json")
            }
            autoPlay
            loop
            style={styles.animation}
          />
          <TouchableOpacity onPress={handlePress} style={styles.changeButton}>
            <Text style={styles.changeButtonText}>캐릭터 변경</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity onPress={handlePress} style={styles.addButton}>
          <MaterialIcons name="add-circle-outline" size={64} color="#bbb" />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default Pet;
