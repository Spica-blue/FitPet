import React from 'react';
import { Calendar as RNCalendar } from 'react-native-calendars';

const Calendar = ({ markedDates = {}, onDayPress, current, enableSwipeMonths = false, markingType = 'simple', ...rest }) => {
  return (
    <RNCalendar
      current={current}
      onDayPress={onDayPress}
      markedDates={markedDates}
      markingType={markingType}
      enableSwipeMonths={enableSwipeMonths}
      {...rest}
      theme={{
        // 캘린더 내부(cell)의 배경색
        // calendarBackground: '#F5FAFF',
        todayTextColor: '#2196F3',
        selectedDayBackgroundColor: '#2196F3',
        arrowColor: '#2196F3',
      }}
      style={{ borderRadius: 8 }}
    />
  )
}

export default Calendar