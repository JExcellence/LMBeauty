'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Column, Spinner, Text } from '@once-ui-system/core';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerList } from '@/components/admin';

export default function AdminCustomersPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

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
      </Column>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <Column fillWidth style={{ padding: '32px', minHeight: '100vh', background: 'var(--lm-bg-white, #FFFFFF)' }}>
      <CustomerList />
    </Column>
  );
}
