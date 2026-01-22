'use client';

import { Column, Row, Text, Icon } from '@once-ui-system/core';
import { formatRelativeDate } from '@/lib/dateUtils';
import styles from './TreatmentMemory.module.scss';

interface TreatmentMemoryProps {
  treatmentName: string;
  date: Date | string;
  notes?: string;
}

export function TreatmentMemory({ treatmentName, date, notes }: TreatmentMemoryProps) {
  const relativeDate = formatRelativeDate(date);
  
  return (
    <Row className={styles.treatmentMemory} gap="12" vertical="center">
      <Column center className={styles.icon}>
        <Icon name="sparkle" size="s" />
      </Column>
      <Column gap="2" flex={1}>
        <Text variant="body-strong-s" style={{ color: '#2D2A26' }}>
          {treatmentName}
        </Text>
        <Text variant="label-default-xs" style={{ color: '#8A8580' }}>
          {relativeDate}
        </Text>
      </Column>
      {notes && (
        <Text variant="body-default-xs" style={{ color: '#5A5550' }} className={styles.notes}>
          {notes}
        </Text>
      )}
    </Row>
  );
}
