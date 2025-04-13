import React from 'react';
import { View, Text } from 'react-native';

import styles from "../styles/tab/HomeScreenStyle";
import Pet from '../components/Pet';

const HomeScreen = () => {

  return (
    <View style={styles.container}>
      <Pet />
    </View>
  );
};

export default HomeScreen;
