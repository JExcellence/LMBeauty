'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Column, Flex, Spinner, Text } from '@once-ui-system/core';
import { useAuth } from '@/contexts/AuthContext';
import { MeinBereichLayout } from '@/components/mein-bereich/MeinBereichLayout';
import { ConsentManagement } from '@/components/mein-bereich/sections/ConsentManagement';

import styles from './einwilligung.module.scss';

/**
 * DSGVO-konforme Einwilligungsverwaltung
 * Integriert in MeinBereichLayout für konsistente Navigation
 */
export default function EinwilligungPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/anmelden?redirect=/mein-bereich/einwilligung');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Flex fillWidth fillHeight center>
          <Column gap="m" style={{ alignItems: 'center' }}>
            <Spinner size="l" />
            <Text variant="body-default-s" onBackground="neutral-weak">
              Lade Einwilligungen...
            </Text>
          </Column>
        </Flex>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MeinBereichLayout>
      <div className={styles.einwilligungContainer}>
        <ConsentManagement />
      </div>
    </MeinBereichLayout>
  );
}