import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { sendPetToServer, createFeedInventory, updatePetOnServer, fetchPetFromServer } from '../utils/UserAPI';
import styles from "../styles/PetSelectionStyle";

const PETS = [
  { key: "happy_dog", label: "강아지", anim: require("../assets/pet/happy_dog.json") },
  { key: "happy_cat", label: "고양이", anim: require("../assets/pet/happy_cat.json") },
  { key: "smile_emoji", label: "이모지", anim: require("../assets/pet/smile_emoji.json") },
];

const PetSelectionScreen = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const getEmail = async () => {
    const ui = await AsyncStorage.getItem('userInfo');
    const p = JSON.parse(ui) || {};
    return p.email || p.kakao_account?.email || '';
  };

  const selectPet = async (petKey) => {
    if(loading) return;
    setLoading(true);
    
    const email = await getEmail();
    if(!email){
      Alert.alert("오류", "유저 이메일을 찾을 수 없습니다.");
      setLoading(false);
      return;
    }

    try{
      // 1) 로컬 저장
      await AsyncStorage.setItem(`pet_${email}`, petKey);

      // 2) 서버에 펫이 이미 있는지 조회
      const petRes = await fetchPetFromServer(email);
      if (!petRes.success) {
        throw new Error(petRes.error?.detail || "펫 정보 조회 실패");
      }

      let serverRes;
      if (petRes.data) {
        // ─── 이미 펫이 있으면 → PUT 으로 업데이트 ─────────────────────
        serverRes = await updatePetOnServer({
          email,
          pet_type: petKey
        });
      } else {
        // ─── 새 펫이라면 → POST 로 생성 ─────────────────────────
        serverRes = await sendPetToServer({
          email,
          pet_type: petKey,
          satiety: 50,
        });
      }

      if (!serverRes.success) {
        throw new Error(serverRes.error?.detail || "펫 저장 실패");
      }

      // 2) 서버에 pet 생성
      // const { success: petOk, error: petErr } = await sendPetToServer({ email, pet_type: petKey, satiety: 50 });

      // if(!petOk){
      //   throw new Error(petErr?.detail || "펫 저장 실패");
      // }

      // 3) feed 테이블 초기화
      const invRes = await createFeedInventory(email);
      if (!invRes.success) {
        console.warn("먹이 보관함 초기화 실패:", invRes.error);
      }
      
      navigation.goBack();

    } catch(err){
      console.error(err);
      Alert.alert("서버 오류", err.message || "알 수 없는 오류가 발생했습니다.");
    } finally{
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const isActive = item.key === selected;
    return (
      <TouchableOpacity
        style={[
          styles.card,
          isActive && styles.cardSelected
        ]}
        onPress={() => setSelected(item.key)}
        activeOpacity={0.8}
      >
        <LottieView
          source={item.anim}
          autoPlay
          loop
          style={styles.anim}
        />
        <Text style={styles.label}>{item.label}</Text>
      </TouchableOpacity>
    );
    // <TouchableOpacity style={styles.card} onPress={() => selectPet(item.key)}>
    //   <LottieView
    //     source={
    //       item.key === "happy_dog"
    //         ? require("../assets/pet/happy_dog.json")
    //         : item.key === "happy_cat"
    //         ? require("../assets/pet/happy_cat.json")
    //         : require("../assets/pet/smile_emoji.json")
    //     }
    //     autoPlay
    //     loop
    //     style={styles.anim}
    //   />
    //   <Text style={styles.label}>{item.label}</Text>
    // </TouchableOpacity>
  };
  
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

      <TouchableOpacity
        style={[
          styles.confirmButton,
          !selected && styles.confirmDisabled
        ]}
        disabled={!selected || loading}
        onPress={() => selectPet(selected)}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.confirmText}>선택 완료</Text>
        }
      </TouchableOpacity>
    </View>  
  )
}

export default PetSelectionScreen