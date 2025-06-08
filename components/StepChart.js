import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BarChart } from 'react-native-chart-kit';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { fetchPedometerRecords } from '../utils/UserAPI';
import styles from "../styles/StepChartStyle";

// const screenWidth = Dimensions.get('window').width;
// const dayNames = ['일','월','화','수','목','금','토'];

const barCount = 7;

// const StepChart = () => {
//   const [stepsArr, setStepsArr] = useState(null);
//   const [labels, setLabels] = useState([]);

//   const getEmail = async () => {
//     const ui = await AsyncStorage.getItem('userInfo');
//     const p = JSON.parse(ui) || {};
//     return p.email || p.kakao_account?.email || '';
//   };

//   useEffect(() => {
//     const loadSteps = async () => {
//        // 1) 로그인된 email
//       const email = await getEmail();

//       const today = new Date();
//       const endDate = today.toISOString().slice(0,10);

//       const startDateObj = new Date(today);
//       startDateObj.setDate(today.getDate() - 6);
//       const startDate = startDateObj.toISOString().slice(0,10);

//       // 1) 서버에서 지난 6일(+오늘 전) 데이터 조회
//       const res = await fetchPedometerRecords(email, startDate, endDate);
//       // const records = res.success ? res.data : [];
//       const recs = res.success ? res.data : [];
//       const map  = {};
//       recs.forEach(r => (map[r.date] = r.step_count));

//       // 2) 배열·레이블 채우기
//       const data = [];
//       const lbls = [];
//       for (let d = new Date(startDateObj); d <= today; d.setDate(d.getDate()+1)) {
//         const ds = d.toISOString().slice(0,10);
//         // 기본 서버 값 or 0
//         let count = map[ds] ?? 0;
//         // 오늘이면 로컬 캐시 우선
//         if (ds === endDate) {
//           const local = await AsyncStorage.getItem(`stepCount_${email}`);
//           if (local != null) count = parseInt(local,10);
//         }
//         data.push(count);
//         lbls.push(ds === endDate ? '오늘' : dayNames[d.getDay()]);
//       }

//       setStepsArr(data);
//       setLabels(lbls);
//     };

//     loadSteps();
//   }, []);

//   if (!stepsArr) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   // 1) 차트 폭 & barPercentage 를 꺼냅니다
//   const chartWidth = screenWidth - 32;           // styles.chartProps.width 과 동일
//   const barPct    = styles.chartConfig.barPercentage; // 예: 0.8
//   const barWidth  = (chartWidth * barPct) / stepsArr.length;

//   // 2) 첫 바를 중앙에 놓으려면 바 너비의 절반만큼 왼쪽 패딩!
//   const paddingLeft = barWidth / 2;

//   // per-bar color array: 마지막 인덱스만 초록
//   const barColors = stepsArr.map((_, i) =>
//     i === stepsArr.length - 1 ? '#4CAF50' : 'rgba(200,200,200,1)'
//   );

//   return (
//     <View style={[styles.container, { paddingLeft }]}>
//       <BarChart
//         data={{
//           labels,
//           datasets: [{ data: stepsArr, colors: barColors.map(c => () => c) }],
//         }}

//         // ← 여기를 추가/수정
//         withVerticalLabels={true}    
//         withHorizontalLabels={false}   // 좌측 축 레이블(숫자) 숨기기
//         withInnerLines={false}         // 바 뒤의 점선(Inner lines) 숨기기
//         withHorizontalLines={false}    // 혹시 남아있다면 가로 점선도 끄기

//         {...styles.chartProps}
//         chartConfig={{
//           ...styles.chartConfig,

//           // 배경선(가로 점선) strokeWidth=0으로 아예 숨김
//           propsForBackgroundLines: { strokeWidth: 0 },

//           // X축 레이블 색상 진하게
//           propsForLabels: { fill: '#666', fontSize: 12 },
//         }}
//         style={[
//           styles.chart,
//           // {
//           //   // 화면 너비 - 좌우 패딩(총 32) 의 10% 만큼 왼쪽으로 당깁니다.
//           //   marginLeft: -((screenWidth - 32) * 0.22),
//           // },
//         ]}

//         // 여기에 decorator 추가
//         decorator={({ x, y, data }) => {
//           return data.map((value, index) => {
//             return (
//               <Text
//                 key={index}
//                 style={[
//                   styles.valueLabel,
//                   {
//                     // x축 위치: 각 바 중앙
//                     left: x(index) + (styles.chartProps.barPercentage ? (styles.chartProps.barPercentage * (screenWidth-32) / data.length / 2) : 0),
//                     // y축 위치: 값 위로 살짝 띄움
//                     top: y(value) - 18,
//                   }
//                 ]}
//               >
//                 {value.toLocaleString()}
//               </Text>
//             );
//           });
//         }}
//       />
//       <Text style={styles.caption}>
//         * 지난 일주일 기록 (6일: 회색, 오늘: 초록)
//       </Text>
//     </View>
//   )
// }

// export default StepChart

export default function StepChart() {
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
      const endStr = today.toISOString().slice(0,10);
      const start = new Date(today);
      start.setDate(today.getDate() - (barCount - 1));
      const startStr = start.toISOString().slice(0,10);

      const res = await fetchPedometerRecords(email, startStr, endStr);
      const recs = res.success ? res.data : [];
      const map = recs.reduce((acc, r) => {
        acc[r.date] = r.step_count;
        return acc;
      }, {});

      const arr = [];
      const lbls = [];
      for (let i = 0; i < barCount; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const ds = d.toISOString().slice(0,10);
        let count = map[ds] ?? 0;
        if (ds === endStr) {
          const local = await AsyncStorage.getItem(`stepCount_${email}`);
          if (local != null) count = parseInt(local,10);
        }
        arr.push(count);
        const dayNames = ['일','월','화','수','목','금','토'];
        lbls.push(ds === endStr ? '오늘' : dayNames[d.getDay()]);
      }

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
  const chartWidth = styles.svg.width;
  const chartHeight = styles.svg.height;
  const barSpacing = 8;
  const barWidth = (chartWidth - barSpacing * (barCount - 1)) / barCount;

  return (
    <View style={styles.container}>
      <Svg style={styles.svg}>
        {data.map((value, i) => {
          const barHeight = (value / maxValue) * (chartHeight - 40);
          const x = i * (barWidth + barSpacing);
          const y = chartHeight - barHeight - 20;

          return (
            <React.Fragment key={i}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={4}
                fill={i === data.length - 1 ? '#4A90E2' : '#DDD'}
              />
              <SvgText
                x={x + barWidth / 2}
                y={y - 6}
                fontSize="12"
                fill={i === data.length - 1 ? '#4A90E2' : '#666'}
                textAnchor="middle"
              >
                {value.toLocaleString()}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>

      <View style={styles.labels}>
        {labels.map((lab, i) => (
          <Text key={i} style={styles.label}>{lab}</Text>
        ))}
      </View>

      <Text style={styles.caption}>
        * 지난 일주일 기록
      </Text>
    </View>
  );
}