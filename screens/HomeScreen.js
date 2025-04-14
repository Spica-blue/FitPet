import React from 'react';
import { View, Text } from 'react-native';

import styles from "../styles/tab/HomeScreenStyle";
import Pet from '../components/Pet';
import StepCounter from "../components/Pedometer";

const HomeScreen = () => {

  return (
    <View style={styles.container}>
      <StepCounter />
      <Pet />
    </View>
  );
};

export default HomeScreen;
