/*
"use client";

import { useState, useCallback, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Column,
  Row,
  Text,
  Icon,
  RevealFx,
  SmartLink,
  Heading,
  Button,
  Spinner,
  Media
} from '@once-ui-system/core';
import api from "@/lib/api";
import styles from './login.module.scss';

const providers = [
  { 
    id: 'google', 
    label: 'Mit Google anmelden'
  },
  { 
    id: 'instagram', 
    label: 'Mit Instagram anmelden'
  },
];

function LoginContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const msg = searchParams?.get('message');
    const err = searchParams?.get('error');
    if (msg) setError(decodeURIComponent(msg));
    else if (err) setError('Anmeldung fehlgeschlagen. Bitte versuche es erneut.');
  }, [searchParams]);

  const handleLogin = useCallback(async (providerId: string) => {
    setLoading(providerId);
    setError('');
    try {
      const res = await api.get(`/oauth/${providerId}/url`);
      const url = res.data?.data || res.data;
      if (url && typeof url === 'string') {
        window.location.href = url;
      } else {
        throw new Error('Invalid');
      }
    } catch {
      setError('Anmeldung fehlgeschlagen. Bitte versuche es erneut.');
      setLoading(null);
    }
  }, []);

  return (
      <Column/>
  )

  return (
    <Column
      center
      padding="m"
      overflow="hidden"
      background="brand-weak"
      className={styles.loginContainer}
    >
      <Media
        src="/images/store/store.mp4"
        className={styles.backgroundVideo}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.75,
          filter: 'blur(0.2px)'
        }}
      />

      <Column
        fill
        background="brand-weak"
        onBackground="brand-weak"
        className={styles.loginForm}
      >
        
        {/!* Header *!/}
        <Column center paddingY="m">
          <Heading 
            as="h1" 
            variant="heading-strong-l"
            className={styles.title}
          >
            Willkommen zurück
          </Heading>
          
          <Text 
            variant="body-default-m" 
            className={styles.subtitle}
          >
            Melde dich an für deine Beauty-Termine
          </Text>
        </Column>

        {/!* Error *!/}
        {error && (
          <Column center gap="xs" padding="s" marginBottom="m" className={styles.error}>
            <Icon name="warning" size="s" />
            <Text variant="body-default-s">{error}</Text>
          </Column>
        )}

        {/!* Login Options *!/}
        <Column gap="xs" marginBottom="m">
          {providers.map((provider) => (
            <Button
              key={provider.id}
              variant="primary"
              size="m"
              fillWidth
              onClick={() => console.log("Bald Verfügbar")}//handleLogin(provider.id)}
              disabled={loading !== null}
              prefixIcon={provider.id === 'google' ? 'google' : 'instagram'}
              className={styles.loginButton}
            >
              {loading === provider.id ? (
                <Row gap="s" center>
                  <Spinner size="s" />
                  <Text>Anmelden...</Text>
                </Row>
              ) : (
                provider.label
              )}
            </Button>
          ))}
        </Column>

        {/!* Footer *!/}
        <div className={styles.footer}>
          <Text variant="body-default-xs" className={styles.legal}>
            Mit der Anmeldung stimmst du unserer{' '}
            <SmartLink href="/datenschutz" className={styles.link}>
              Datenschutzerklärung
            </SmartLink>
            {' '}und den{' '}
            <SmartLink href="/agb" className={styles.link}>
              AGB
            </SmartLink>
            {' '}zu
          </Text>
          
          <SmartLink href="/#contact" className={styles.helpLink}>
            Hilfe bei der Anmeldung?
          </SmartLink>
        </div>

      </Column>
    </Column>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.loading}>
          <Spinner size="l" />
          <Text>Wird geladen...</Text>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}*/

export default function LoginPage() {
    return (
        <div/>
    )
}
