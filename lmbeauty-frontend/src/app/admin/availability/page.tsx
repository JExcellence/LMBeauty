'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Column, Spinner, Text } from '@once-ui-system/core';
import { useAuth } from '@/contexts/AuthContext';
import { AvailabilityManager } from '@/components/admin';
import styles from './availability.module.scss';

export default function AdminAvailabilityPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?redirect=/admin/availability');
    }
    if (!isLoading && isAuthenticated && user?.role !== 'ADMIN') {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <Column fillWidth center className={styles.loadingContainer}>
        <Spinner size="m" />
        <Text variant="body-default-m" className={styles.loadingText}>
          Verfügbarkeit wird geladen...
        </Text>
      </Column>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <AvailabilityManager />
      </div>
    </div>
  );
}
