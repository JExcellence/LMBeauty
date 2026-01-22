'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Column, Text, Icon, Spinner } from '@once-ui-system/core';
import Link from 'next/link';
import styles from '../../google/callback/callback.module.scss';

type AuthStatus = 'authenticating' | 'verifying' | 'connecting' | 'redirecting' | 'complete';

const steps = [
  { id: 'auth', label: 'Authentifizierung', status: 'authenticating' as const },
  { id: 'verify', label: 'Verifizierung', status: 'verifying' as const },
  { id: 'connect', label: 'Verbindung', status: 'connecting' as const },
  { id: 'redirect', label: 'Weiterleitung', status: 'redirecting' as const },
];

const statusToStep: Record<AuthStatus, number> = {
  authenticating: 0,
  verifying: 1,
  connecting: 2,
  redirecting: 3,
  complete: 4,
};

function InstagramIcon() {
  return (
    <svg className={styles.providerIcon} viewBox="0 0 24 24">
      <defs>
        <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFDC80"/>
          <stop offset="25%" stopColor="#F77737"/>
          <stop offset="50%" stopColor="#E1306C"/>
          <stop offset="75%" stopColor="#C13584"/>
          <stop offset="100%" stopColor="#833AB4"/>
        </linearGradient>
      </defs>
      <path fill="url(#ig-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function InstagramCallbackContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>('authenticating');
  const hasProcessedRef = useRef(false);

  const currentStep = statusToStep[status];
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    if (hasProcessedRef.current) return;
    hasProcessedRef.current = true;

    const handleCallback = async () => {
      try {
        const code = searchParams?.get('code');
        const state = searchParams?.get('state');
        const errorParam = searchParams?.get('error');
        const errorDescription = searchParams?.get('error_description');

        if (errorParam) {
          setError(errorDescription || 'Authentifizierung fehlgeschlagen');
          return;
        }

        if (!code) {
          setError('Kein Autorisierungscode erhalten');
          return;
        }

        setStatus('authenticating');
        await new Promise(resolve => setTimeout(resolve, 800));

        setStatus('verifying');
        
        const response = await fetch('/api/oauth/instagram/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, state }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || 'Authentifizierung fehlgeschlagen');
        }

        const data = await response.json();

        setStatus('connecting');
        
        const authData = data.data || data;
        
        if (authData.accessToken) {
          localStorage.setItem('accessToken', authData.accessToken);
        }
        if (authData.refreshToken) {
          localStorage.setItem('refreshToken', authData.refreshToken);
        }
        if (authData.user) {
          // Don't cache user data in localStorage for security
        }
        
        await new Promise(resolve => setTimeout(resolve, 600));

        setStatus('redirecting');
        await new Promise(resolve => setTimeout(resolve, 400));

        setStatus('complete');

        const redirectUrl = state === 'link' 
          ? '/mein-bereich/einstellungen/account'
          : '/mein-bereich';
        
        window.location.href = redirectUrl;

      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Die Verbindung mit Instagram ist fehlgeschlagen. Bitte versuche es erneut.';
        setError(message);
      }
    };

    handleCallback();
  }, [searchParams]);

  if (error) {
    return (
      <div className={styles.callbackPage}>
        <div className={styles.ambientLayer}>
          <div className={`${styles.orb} ${styles.orbPrimary}`} />
          <div className={`${styles.orb} ${styles.orbSecondary}`} />
        </div>
        
        <div className={styles.content}>
          <div className={styles.errorCard}>
            <div className={styles.errorIconWrapper}>
              <Icon name="warning" size="l" />
            </div>
            <h1 className={styles.errorHeadline}>Verbindung fehlgeschlagen</h1>
            <p className={styles.errorMessage}>{error}</p>
            <Link href="/login" className={styles.retryButton}>
              <Icon name="refresh" size="s" />
              Erneut versuchen
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.callbackPage}>
      <div className={styles.ambientLayer}>
        <div className={`${styles.orb} ${styles.orbPrimary}`} />
        <div className={`${styles.orb} ${styles.orbSecondary}`} />
        <div className={`${styles.orb} ${styles.orbAccent}`} />
      </div>
      
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <div className={styles.iconGlow} />
            <div className={styles.iconInner}>
              <InstagramIcon />
            </div>
          </div>
          
          <h1 className={styles.headline}>Willkommen zurück</h1>
          <p className={styles.subline}>Dein Konto wird sicher verbunden</p>
          
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            <div className={styles.steps}>
              {steps.map((step, index) => {
                const isComplete = index < currentStep;
                const isActive = index === currentStep;
                
                return (
                  <div 
                    key={step.id}
                    className={`
                      ${styles.step}
                      ${isActive ? styles.stepActive : ''}
                      ${isComplete ? styles.stepComplete : ''}
                    `}
                  >
                    <div 
                      className={`
                        ${styles.stepIndicator}
                        ${isComplete ? styles.indicatorComplete : ''}
                        ${isActive ? styles.indicatorActive : ''}
                        ${!isComplete && !isActive ? styles.indicatorPending : ''}
                      `}
                    >
                      {isComplete ? (
                        <Icon name="check" size="xs" />
                      ) : isActive ? (
                        <div className={styles.miniSpinner} />
                      ) : (
                        <span className={styles.dot} />
                      )}
                    </div>
                    <span className={`${styles.stepLabel} ${isActive ? styles.stepLabelActive : ''}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className={styles.brandFooter}>
            <span className={styles.brandText}>LM Beauty • Sichere Anmeldung</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InstagramCallbackPage() {
  return (
    <Suspense 
      fallback={
        <div className={styles.callbackPage}>
          <div className={styles.ambientLayer}>
            <div className={`${styles.orb} ${styles.orbPrimary}`} />
            <div className={`${styles.orb} ${styles.orbSecondary}`} />
          </div>
          <div className={styles.content}>
            <div className={styles.card}>
              <Column gap="16" horizontal="center" style={{ padding: '24px 0' }}>
                <Spinner size="l" />
                <Text variant="body-default-m" onBackground="neutral-medium">
                  Verbindung wird hergestellt...
                </Text>
              </Column>
            </div>
          </div>
        </div>
      }
    >
      <InstagramCallbackContent />
    </Suspense>
  );
}
