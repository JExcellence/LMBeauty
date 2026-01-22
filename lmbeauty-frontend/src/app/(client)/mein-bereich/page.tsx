'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Column, Flex, Spinner, Text } from '@once-ui-system/core';
import { useAuth } from '@/contexts/AuthContext';
import { MeinBereichLayout } from '@/components/mein-bereich/MeinBereichLayout';
import styles from './mein-bereich.module.scss';

export default function MeinBereichPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/anmelden?redirect=/mein-bereich');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <Flex
        fillWidth
        direction="column"
        vertical="center"
        horizontal="center"
        style={{ minHeight: '100vh' }}
        className={styles.beautySpaceContainer}
      >
        <Spinner size="m" />
        <Text variant="body-default-m" onBackground="neutral-medium" style={{ marginTop: '16px' }}>
          Dein Bereich wird geladen...
        </Text>
      </Flex>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.beautySpaceContainer}>
      <MeinBereichLayout />
    </div>
  );
}