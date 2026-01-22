'use client';

import { useState, useMemo } from 'react';
import { Column, Row, Text, Icon, IconButton, RevealFx } from '@once-ui-system/core';
import styles from './DateSelector.module.scss';

interface DateSelectorProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  availableDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
}

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const MONTHS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];

export function DateSelector({ 
  selectedDate, 
  onDateSelect, 
  availableDates,
  minDate = new Date(),
  maxDate
}: DateSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startOffset = (firstDay.getDay() + 6) % 7;
    const days: (Date | null)[] = [];
    
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  }, [currentMonth]);

  const isDateAvailable = (date: Date): boolean => {
    if (date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    if (date.getDay() === 0) return false;
    
    if (availableDates) {
      return availableDates.some(d => 
        d.toDateString() === date.toDateString()
      );
    }
    
    return true;
  };

  const isDateSelected = (date: Date): boolean => {
    return selectedDate?.toDateString() === date.toDateString();
  };

  const isToday = (date: Date): boolean => {
    return date.toDateString() === new Date().toDateString();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const canGoPrevious = currentMonth > new Date(minDate.getFullYear(), minDate.getMonth(), 1);

  return (
    <RevealFx speed="medium" translateY={16}>
      <Column className={styles.dateSelector}>
        <Row className={styles.calendarHeader} horizontal="between" vertical="center">
          <IconButton
            icon="chevronLeft"
            variant="tertiary"
            size="s"
            onClick={goToPreviousMonth}
            disabled={!canGoPrevious}
            aria-label="Vorheriger Monat"
          />
          <Text variant="heading-strong-m" className={styles.monthTitle}>
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Text>
          <IconButton
            icon="chevronRight"
            variant="tertiary"
            size="s"
            onClick={goToNextMonth}
            aria-label="Nächster Monat"
          />
        </Row>

        <Row className={styles.weekdayHeader}>
          {WEEKDAYS.map(day => (
            <Column key={day} center className={styles.weekdayCell}>
              <Text variant="label-default-xs" className={styles.weekdayText}>
                {day}
              </Text>
            </Column>
          ))}
        </Row>

        <div className={styles.calendarGrid}>
          {calendarDays.map((date, index) => (
            <Column key={index} center className={styles.dayCell}>
              {date && (
                <button
                  className={`
                    ${styles.dayButton}
                    ${isDateAvailable(date) ? styles.available : styles.unavailable}
                    ${isDateSelected(date) ? styles.selected : ''}
                    ${isToday(date) ? styles.today : ''}
                  `}
                  onClick={() => isDateAvailable(date) && onDateSelect(date)}
                  disabled={!isDateAvailable(date)}
                  aria-label={date.toLocaleDateString('de-DE', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                  aria-selected={isDateSelected(date)}
                >
                  <Text variant="body-default-s">
                    {date.getDate()}
                  </Text>
                </button>
              )}
            </Column>
          ))}
        </div>

        <Row className={styles.legend} gap="16" horizontal="center">
          <Row gap="8" vertical="center">
            <div className={`${styles.legendDot} ${styles.legendAvailable}`} />
            <Text variant="label-default-xs" style={{ color: '#8A8580' }}>Verfügbar</Text>
          </Row>
          <Row gap="8" vertical="center">
            <div className={`${styles.legendDot} ${styles.legendSelected}`} />
            <Text variant="label-default-xs" style={{ color: '#8A8580' }}>Ausgewählt</Text>
          </Row>
        </Row>
      </Column>
    </RevealFx>
  );
}

export default DateSelector;
