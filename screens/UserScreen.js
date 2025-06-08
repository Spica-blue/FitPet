import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchUserInfoFromServer } from '../utils/UserAPI';
import styles from "../styles/tab/UserScreenStyle";
import StepChart from '../components/StepChart';

const screenWidth = Dimensions.get('window').width;

const UserScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [serverInfo, setServerInfo] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem('userInfo');
      if(stored){
        const info = JSON.parse(stored);
        setUserInfo(info);

        // 서버에서 user_info 조회
        const email =
          info.email ||
          info.kakao_account?.email ||
          info.naver_account?.email ||
          '';
        
        const res = await fetchUserInfoFromServer(email);
        if (res.success) {
          setServerInfo(res.data);
          // console.log(serverInfo);
        }
        else{
          console.warn('서버 user_info 조회 실패:', res.error);
        }
      }
    };
    loadUser();
  }, []);

  if(!userInfo){

    return null;
  }

  // 유저 이미지, 닉네임 추출 (kakao / naver 모두 커버)
  const profileImage =
    userInfo.profile_image ??
    userInfo.kakao_account?.profile?.profile_image_url ??
    userInfo.naver_account?.profile_image;

  const nickname =
    userInfo.nickname ??
    userInfo.kakao_account?.profile?.nickname ??
    userInfo.naver_account?.nickname;

  return (
    // <View style={styles.container}>
    //   <Account navigation={navigation} />
    // </View>
    <ScrollView contentContainerStyle={styles.container}>
      {/* 상단 프로필 영역 */}
      <View style={styles.profileCard}>
        <View style={styles.statsRow}>
          {/* 식단 타입 */}
          <View style={styles.stat}>
            <Text style={styles.statIcon}>🍽️식단</Text>
            <Text style={styles.statLabel}>
              {`${serverInfo?.dietType}식단` ?? '일반식단'}
            </Text>
          </View>

          {/* 목표 체중 */}
          <View style={styles.stat}>
            <Text style={styles.statIcon}>🎯목표</Text>
            <Text style={styles.statValue}>
              {serverInfo?.targetWeight != null
                ? `${serverInfo?.targetWeight}kg`
                : '–'}
            </Text>
          </View>
        </View>

        {/* 프로필 이미지 */}
        <View style={styles.avatar}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <Text style={{ fontSize: 40 }}>🙂</Text>
          )}
        </View>

        {/* 닉네임 */}
        <Text style={styles.username}>{nickname}</Text>  
      </View>

      {/* 하단 걸음 차트 */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>내 걸음 분석</Text>
        <StepChart />
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.outlineBtn} onPress={() => navigation.navigate('GoalSetup')}>
          <Text>목표 변경</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filledBtn}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={{ color: '#fff' }}>설정</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  )
}

export default UserScreen;