'use client';

import { useState, useMemo, memo } from 'react';
import { Text, Icon, Button } from '@once-ui-system/core';
import styles from './CalendarView.module.scss';

interface CalendarViewProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  availableDates?: Date[];
  bookedDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
}

const CalendarView = memo(function CalendarView({ 
  selectedDate, 
  onDateSelect, 
  availableDates = [], 
  bookedDates = [],
  minDate = new Date(),
  maxDate
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDate.setDate(firstDay.getDate() + mondayOffset);

    const days = [];
    const current = new Date(startDate);
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [currentMonth]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate => 
      availableDate.toDateString() === date.toDateString()
    );
  };

  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate => 
      bookedDate.toDateString() === date.toDateString()
    );
  };

  const isDateSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString();
  };

  const isDateToday = (date: Date) => {
    return today.toDateString() === date.toDateString();
  };

  const isDatePast = (date: Date) => {
    return date < today;
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const getDayStatus = (date: Date) => {
    if (isDatePast(date)) return 'past';
    if (isDateBooked(date)) return 'booked';
    if (isDateAvailable(date)) return 'available';
    return 'unavailable';
  };

  const canGoPrevious = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    return prevMonth >= new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  };

  const canGoNext = () => {
    if (!maxDate) return true;
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth <= new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>
        <Button
          variant="tertiary"
          size="s"
          onClick={() => navigateMonth('prev')}
          disabled={!canGoPrevious()}
          className={styles.navButton}
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(255, 107, 157, 0.08)'
          }}
        >
          <Icon name="chevronLeft" size="s" />
        </Button>
        <div className={styles.monthYear}>
          <Text className={styles.monthText}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Text>
        </div>
        <Button
          variant="tertiary"
          size="s"
          onClick={() => navigateMonth('next')}
          disabled={!canGoNext()}
          className={styles.navButton}
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(255, 107, 157, 0.08)'
          }}
        >
          <Icon name="chevronRight" size="s" />
        </Button>
      </div>

      <div className={styles.weekDaysHeader}>
        {weekDays.map(day => (
          <div key={day} className={styles.weekDay}>
            <Text className={styles.weekDayText}>{day}</Text>
          </div>
        ))}
      </div>

      <div className={styles.calendarGrid}>
        {calendarDays.map((date, index) => {
          const status = getDayStatus(date);
          const isToday = isDateToday(date);
          const isSelected = isDateSelected(date);
          const isOtherMonth = !isCurrentMonth(date);

          return (
            <button
              key={index}
              onClick={() => {
                if (status === 'available' && !isOtherMonth) {
                  onDateSelect(date);
                }
              }}
              disabled={status !== 'available' || isOtherMonth}
              className={`${styles.calendarDay} ${styles[status]} ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''} ${isOtherMonth ? styles.otherMonth : ''}`}
            >
              <span className={styles.dayNumber}>
                {date.getDate()}
              </span>
              {isToday && (
                <div className={styles.todayIndicator} />
              )}
              {status === 'available' && !isOtherMonth && (
                <div className={styles.availableIndicator} />
              )}
              {status === 'booked' && !isOtherMonth && (
                <div className={styles.bookedIndicator} />
              )}
            </button>
          );
        })}
      </div>

      <div className={styles.calendarLegend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.available}`} />
          <Text className={styles.legendText}>Verfügbar</Text>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.booked}`} />
          <Text className={styles.legendText}>Ausgebucht</Text>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.unavailable}`} />
          <Text className={styles.legendText}>Nicht verfügbar</Text>
        </div>
      </div>
    </div>
  );
});

export { CalendarView };
export default CalendarView;