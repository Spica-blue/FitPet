import React from 'react';
import { View, Text } from 'react-native';

import styles from "../styles/tab/UserScreenStyle";
import Account from '../components/Account';

const UserScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Account navigation={navigation} />
    </View>
  )
}

export default UserScreen