import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BarChart } from 'react-native-chart-kit';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { fetchPedometerRecords } from '../utils/UserAPI';
import { formatDateLocal } from '../utils/DateUtils';
import styles from "../styles/StepChartStyle";

const barCount = 7;

export default function StepChart({ width: parentWidth }) {
  const [data, setData] = useState(null);
  const [labels, setLabels] = useState([]);

  const getEmail = async () => {
    const ui = await AsyncStorage.getItem('userInfo');
    const p = JSON.parse(ui) || {};
    return p.email || p.kakao_account?.email || '';
  };

  useEffect(() => {
    (async () => {
      const email = await getEmail();
      const today = new Date();
      const endStr   = formatDateLocal(today);
      const start = new Date(today);
      start.setDate(today.getDate() - (barCount - 1));
      const startStr = formatDateLocal(start); 

      console.log("시작일:", startStr);
      console.log("종료일:", endStr);

      const res = await fetchPedometerRecords(email, startStr, endStr);
      const recs = res.success ? res.data : [];
      console.log("recs:", recs);

      const map = recs.reduce((acc, r) => {
        acc[r.date] = r.step_count;
        return acc;
      }, {});

      const arr = [];
      const lbls = [];
      for (let i = 0; i < barCount; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);

        const ds = formatDateLocal(d);
        let count = map[ds] ?? 0;
        
        if (ds === endStr) {
          const local = await AsyncStorage.getItem(`stepCount_${email}`);
          if (local != null) count = parseInt(local,10);
        }
        arr.push(count);
        const dayNames = ['일','월','화','수','목','금','토'];
        lbls.push(ds === endStr ? '오늘' : dayNames[d.getDay()]);
      }

      console.log('⚡ 최종 차트 데이터(arr):', arr);
      setData(arr);
      setLabels(lbls);
    })();
  }, []);

  if (!data) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const maxValue = Math.max(...data, 1);
  const chartWidth = parentWidth;
  // console.log("chartwidth:", chartWidth);
  const chartHeight = styles.svg.height;
  const barSpacing = 8;
  const barWidth = (chartWidth - barSpacing * (barCount - 1)) / barCount;

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={styles.svg.height}>
        {data.map((value, i) => {
          const barHeight = (value / maxValue) * (chartHeight - 30);
          const x = i * (barWidth + barSpacing);
          const y = chartHeight - barHeight - 16;

          return (
            <React.Fragment key={i}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={4}
                fill={i === barCount - 1 ? '#4A90E2' : '#DDD'}
              />
              <SvgText
                x={x + barWidth / 2}
                y={y - 4}
                fontSize="12"
                fill={i === barCount - 1 ? '#4A90E2' : '#666'}
                textAnchor="middle"
              >
                {value.toLocaleString()}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>

      <View 
        style={[
          styles.labels,
          {
            width: chartWidth,
            paddingHorizontal: barSpacing / 2,
          },
        ]}
      >
        {labels.map((lab, i) => (
          <Text key={i} style={[styles.label, { width: barWidth },]}>{lab}</Text>
        ))}
      </View>

      <Text style={styles.caption}>
        * 지난 일주일 기록
      </Text>
    </View>
  );
}