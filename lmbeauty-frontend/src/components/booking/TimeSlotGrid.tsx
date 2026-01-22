'use client';

import { Column, Row, Text, Grid, Skeleton, RevealFx, Icon } from '@once-ui-system/core';
import styles from './TimeSlotGrid.module.scss';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  isLoading?: boolean;
  selectedDate?: Date | null;
}

export function TimeSlotGrid({ 
  slots, 
  selectedTime, 
  onTimeSelect, 
  isLoading = false,
  selectedDate
}: TimeSlotGridProps) {
  const morningSlots = slots.filter(s => {
    const hour = parseInt(s.time.split(':')[0]);
    return hour < 12;
  });
  
  const afternoonSlots = slots.filter(s => {
    const hour = parseInt(s.time.split(':')[0]);
    return hour >= 12;
  });

  if (isLoading) {
    return (
      <RevealFx speed="fast" translateY={12}>
        <Column className={styles.timeSlotContainer}>
          <Row className={styles.sectionHeader} gap="8" vertical="center">
            <Skeleton shape="circle" width="s" height="s" />
            <Skeleton shape="line" width="l" height="s" />
          </Row>
          <Grid columns="4" s={{ columns: '3' }} gap="12">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} shape="block" height="l" style={{ borderRadius: '12px' }} />
            ))}
          </Grid>
        </Column>
      </RevealFx>
    );
  }

  if (!selectedDate) {
    return (
      <Column className={styles.emptyState} center gap="16">
        <Column center className={styles.emptyIcon}>
          <Icon name="calendar" size="l" />
        </Column>
        <Text variant="body-default-m" style={{ color: '#5A5550', textAlign: 'center' }}>
          Wähle zuerst einen Tag aus, um verfügbare Zeiten zu sehen.
        </Text>
      </Column>
    );
  }

  const availableCount = slots.filter(s => s.available).length;

  if (availableCount === 0) {
    return (
      <Column className={styles.emptyState} center gap="16">
        <Column center className={styles.emptyIcon}>
          <Icon name="clock" size="l" />
        </Column>
        <Column gap="4" center>
          <Text variant="body-strong-m" style={{ color: '#2D2A26', textAlign: 'center' }}>
            Keine Termine verfügbar
          </Text>
          <Text variant="body-default-s" style={{ color: '#5A5550', textAlign: 'center' }}>
            An diesem Tag sind leider alle Termine vergeben. Probiere einen anderen Tag.
          </Text>
        </Column>
      </Column>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <RevealFx speed="medium" translateY={16}>
      <Column className={styles.timeSlotContainer} gap="24">
        <Row className={styles.dateHeader} horizontal="between" vertical="center">
          <Column gap="2">
            <Text variant="heading-strong-s" style={{ color: '#2D2A26' }}>
              {formatDate(selectedDate)}
            </Text>
            <Text variant="label-default-xs" style={{ color: '#8A8580' }}>
              {availableCount} Termine verfügbar
            </Text>
          </Column>
        </Row>

        {morningSlots.length > 0 && (
          <Column gap="12">
            <Row gap="8" vertical="center">
              <Icon name="sun" size="s" className={styles.periodIcon} />
              <Text variant="label-default-s" style={{ color: '#8A8580' }}>
                Vormittag
              </Text>
            </Row>
            <Grid columns="4" s={{ columns: '3' }} gap="12">
              {morningSlots.map((slot, index) => (
                <button
                  key={slot.time}
                  className={`
                    ${styles.timeSlot}
                    ${slot.available ? styles.available : styles.unavailable}
                    ${selectedTime === slot.time ? styles.selected : ''}
                  `}
                  onClick={() => slot.available && onTimeSelect(slot.time)}
                  disabled={!slot.available}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <Text variant="body-default-s">
                    {slot.time}
                  </Text>
                </button>
              ))}
            </Grid>
          </Column>
        )}

        {afternoonSlots.length > 0 && (
          <Column gap="12">
            <Row gap="8" vertical="center">
              <Icon name="sun" size="s" className={styles.periodIcon} />
              <Text variant="label-default-s" style={{ color: '#8A8580' }}>
                Nachmittag
              </Text>
            </Row>
            <Grid columns="4" s={{ columns: '3' }} gap="12">
              {afternoonSlots.map((slot, index) => (
                <button
                  key={slot.time}
                  className={`
                    ${styles.timeSlot}
                    ${slot.available ? styles.available : styles.unavailable}
                    ${selectedTime === slot.time ? styles.selected : ''}
                  `}
                  onClick={() => slot.available && onTimeSelect(slot.time)}
                  disabled={!slot.available}
                  style={{ animationDelay: `${(morningSlots.length + index) * 30}ms` }}
                >
                  <Text variant="body-default-s">
                    {slot.time}
                  </Text>
                </button>
              ))}
            </Grid>
          </Column>
        )}
      </Column>
    </RevealFx>
  );
}

export default TimeSlotGrid;
