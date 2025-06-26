import React, { useState, useCallback } from 'react';
import { ScrollView, RefreshControl } from 'react-native';

/**
 * PullToRefresh
 * - onRefresh: 새로고침 시 실행할 async 함수
 * - children: 내부에 렌더링할 네비게이션 또는 화면 컴포넌트
 */
export default function PullToRefresh({ children, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    try{
      await onRefresh?.();
    } catch(e){
      console.warn("Refresh error", e);
    }

    setRefreshing(false);
  }, [onRefresh]);

  return(
    <ScrollView
      contentContainerStyle={{ flex: 1}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {children}
    </ScrollView>
  );
};