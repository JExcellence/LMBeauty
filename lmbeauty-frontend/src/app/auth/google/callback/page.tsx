'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Column, Row, Text, Icon, Spinner } from '@once-ui-system/core';
import Link from 'next/link';
import styles from './callback.module.scss';

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

function GoogleIcon() {
  return (
    <svg className={styles.providerIcon} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function GoogleCallbackContent() {
  const router = useRouter();
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
        
        const response = await fetch('/api/oauth/google/callback', {
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
        
        // Backend returns { success: true, data: { accessToken, refreshToken, user: {...} } }
        const authData = data.data || data;
        
        // Store tokens in localStorage for AuthContext
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

        // Check for stored redirect URL
        const storedRedirect = localStorage.getItem('redirectAfterLogin');
        const redirectUrl = storedRedirect || (state === 'link' 
          ? '/mein-bereich/einstellungen/account'
          : '/mein-bereich');
        
        // Clear stored redirect
        if (storedRedirect) {
          localStorage.removeItem('redirectAfterLogin');
        }
        
        // Use window.location for full page reload to ensure AuthContext picks up the new tokens
        window.location.href = redirectUrl;

      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Die Verbindung mit Google ist fehlgeschlagen. Bitte versuche es erneut.';
        setError(message);
      }
    };

    handleCallback();
  }, [searchParams, router]);

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
              <GoogleIcon />
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

export default function GoogleCallbackPage() {
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
      <GoogleCallbackContent />
    </Suspense>
  );
}
