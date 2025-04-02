import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SERVER_URL = "http://192.168.100.196:4040/api"; // or https://yourdomain.com/api

export default function App() {
  useEffect(() => {
    // fetch(`${SERVER_URL}/`)
    //   .then(res => res.text())
    //   .then(text => console.log(text))
    //   .catch(err => console.error(err));

    fetch(`${SERVER_URL}/echo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Hello from Expo!' }),
    })
      .then(res => res.text())
      .then(console.log)
      .catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Spring Boot 연결 테스트 중...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
})
