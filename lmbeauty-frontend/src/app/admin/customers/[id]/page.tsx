'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Column, Spinner, Text } from '@once-ui-system/core';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerDetail } from '@/components/admin';

export default function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const resolvedParams = use(params);
  const customerId = parseInt(resolvedParams.id);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?redirect=/admin/customers');
    }
    if (!isLoading && isAuthenticated && user?.role !== 'ADMIN') {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <Column fillWidth center style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <Spinner size="m" />
        <Text variant="body-default-m" style={{ marginTop: '16px', color: '#8A8580' }}>
          Kundendaten werden geladen...
        </Text>
      </Column>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <Column fillWidth style={{ padding: '32px', minHeight: '100vh', background: 'var(--lm-bg-white, #FFFFFF)' }}>
      <CustomerDetail customerId={customerId} />
    </Column>
  );
}