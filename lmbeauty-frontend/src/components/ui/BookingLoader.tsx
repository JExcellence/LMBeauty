'use client';

import { Column, Text, Spinner } from '@once-ui-system/core';
import styles from './BookingLoader.module.scss';

interface BookingLoaderProps {
  message?: string;
}

export function BookingLoader({ message = "Wird geladen..." }: BookingLoaderProps) {
  return (
    <Column fillWidth center className={styles.loaderContainer}>
      <div className={styles.loaderContent}>
        <Spinner size="l" />
        <Text className={styles.loaderText}>{message}</Text>
      </div>
    </Column>
  );
}

export default BookingLoader;