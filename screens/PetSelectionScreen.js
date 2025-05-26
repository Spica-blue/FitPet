import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import styles from "../styles/PetSelectionStyle";

const PETS = [
  { key: "happy_dog", label: "강아지" },
  { key: "happy_cat", label: "고양이" },
  { key: "smile_emoji", label: "스마일" },
];

const PetSelectionScreen = () => {
  const navigation = useNavigation();

  const getEmail = async () => {
    const ui = await AsyncStorage.getItem('userInfo');
    const p = JSON.parse(ui) || {};
    return p.email || p.kakao_account?.email || '';
  };

  const selectPet = async (key) => {
    const email = await getEmail();
    if(!email) return;
    await AsyncStorage.setItem(`pet_${email}`, key);
    navigation.goBack();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => selectPet(item.key)}>
      <LottieView
        source={
          item.key === "happy_dog"
            ? require("../assets/pet/happy_dog.json")
            : item.key === "happy_cat"
            ? require("../assets/pet/happy_cat.json")
            : require("../assets/pet/smile_emoji.json")
        }
        autoPlay
        loop
        style={styles.anim}
      />
      <Text style={styles.label}>{item.label}</Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>캐릭터를 선택해주세요</Text>
      <FlatList
        data={PETS}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.list}
        numColumns={2}
      />
    </View>  
  )
}

export default PetSelectionScreen