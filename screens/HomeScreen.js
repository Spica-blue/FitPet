import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StepCounter from "../components/StepCounter";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <StepCounter/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default HomeScreen;
