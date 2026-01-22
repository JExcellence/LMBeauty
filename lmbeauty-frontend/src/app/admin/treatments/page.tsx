'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Column, Spinner, Text, Button, Icon } from '@once-ui-system/core';
import { useAuth } from '@/contexts/AuthContext';
import { TreatmentStudio } from '@/components/admin/TreatmentStudio';
import styles from './page.module.scss';

export default function TreatmentsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/anmelden?redirect=/admin/treatments');
    }
    if (!isLoading && isAuthenticated && user?.role !== 'ADMIN') {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className={styles.loadingSpace}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}>
            <Spinner size="m" />
          </div>
          <Text className={styles.loadingText}>
            Dein Beauty-Studio wird vorbereitet...
          </Text>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className={styles.treatmentStudioPage}>
      <TreatmentStudio />
    </div>
  );
}
