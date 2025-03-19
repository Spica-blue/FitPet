import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Pedometer } from "expo-sensors";
import { CalorieCalculator } from "./CalorieCalculator";

const StepCounter = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [calories, setCalories] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [height, setHeight] = useState(""); // 키 입력
  const [weight, setWeight] = useState(""); // 몸무게 입력

  useEffect(() => {
    let subscription;

    const requestPermission = async () => {
      // Expo SDK 51에서는 Motion 권한을 직접 요청 가능
      const { granted } = await Pedometer.requestPermissionsAsync();
      setPermissionGranted(granted);

      if (!granted) {
        alert("만보기 기능을 사용하려면 권한이 필요합니다.");
        return;
      }

      const available = await Pedometer.isAvailableAsync();
      setIsAvailable(available);

      if (available) {
        subscription = Pedometer.watchStepCount((result) => {
          if (result.steps <= 1) {
            setStepCount(0); // 🔥 1 이하일 경우 강제로 0 설정
          } else {
            setStepCount(result.steps);
          }
          if(height && weight){
            setCalories(CalorieCalculator(result.steps, parseFloat(height), parseFloat(weight)));
          }
        });
      }
    };

    requestPermission();

    return () => {
      if(subscription){
        subscription.remove();
      }
    };
  }, [height, weight]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📱 만보기 테스트</Text>
      <Text style={styles.status}>
        만보기 사용 가능 여부: {isAvailable ? "사용 가능" : "사용 불가"}
      </Text>
      <Text style={styles.permission}>
        권한 상태: {permissionGranted ? "허용됨" : "거부됨"}
      </Text>
      <Text style={styles.steps}>👣 현재 걸음 수: {stepCount}</Text>

      <TextInput
        style={styles.input}
        placeholder="키(cm)를 입력하세요"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />

      <TextInput
        style={styles.input}
        placeholder="몸무게(kg)를 입력하세요"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <Text style={styles.calories}>🔥 소모 칼로리: {calories} kcal</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  status: {
    fontSize: 18,
    marginBottom: 10,
  },
  steps: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3498db",
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  calories: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e74c3c", 
    marginTop: 10,
  },
  permission: {
    fontSize: 16,
    color: "red",
    marginBottom: 10,
  },
});

export default StepCounter;