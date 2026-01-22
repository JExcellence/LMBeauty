'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { BeautyStudioDashboard } from '@/components/admin/BeautyStudioDashboard';
import styles from './page.module.scss';

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/anmelden?redirect=/admin');
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
            <div className={styles.spinner} />
          </div>
          <p className={styles.loadingText}>
            Dein Beauty-Studio erwacht...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className={styles.adminPage}>
      <BeautyStudioDashboard />
    </div>
  );
}
