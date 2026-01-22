/*
"use client";

import React, { useEffect, useState } from 'react';
import {
  Column,
  Row,
  Text,
  Heading,
  Icon,
  Button,
  Spinner,
  ProgressBar,
  RevealFx,
  LetterFx,
  StatusIndicator,
} from '@once-ui-system/core';

export type OAuthStatus = 
  | 'authenticating' 
  | 'verifying' 
  | 'connecting' 
  | 'redirecting'
  | 'success'
  | 'error';

interface OAuthCallbackLoaderProps {
  provider: string;
  status: OAuthStatus;
}

interface OAuthErrorStateProps {
  provider: string;
  error: string;
}

const statusMessages: Record<OAuthStatus, { title: string; subtitle: string }> = {
  authenticating: {
    title: 'Einen Moment...',
    subtitle: 'Wir verbinden dich sicher.',
  },
  verifying: {
    title: 'Fast geschafft',
    subtitle: 'Wir prüfen deine Daten.',
  },
  connecting: {
    title: 'Verbindung wird hergestellt',
    subtitle: 'Dein Konto wird verknüpft.',
  },
  redirecting: {
    title: 'Alles bereit!',
    subtitle: 'Du wirst gleich weitergeleitet.',
  },
  success: {
    title: 'Willkommen zurück!',
    subtitle: 'Schön, dass du da bist.',
  },
  error: {
    title: 'Das hat nicht geklappt',
    subtitle: 'Aber kein Problem, versuch es nochmal.',
  },
};

const statusProgress: Record<OAuthStatus, number> = {
  authenticating: 25,
  verifying: 50,
  connecting: 75,
  redirecting: 95,
  success: 100,
  error: 0,
};

const providerIcons: Record<string, string> = {
  Google: 'google',
  Apple: 'apple',
  Facebook: 'facebook',
  Instagram: 'instagram',
};

export const OAuthCallbackLoader: React.FC<OAuthCallbackLoaderProps> = ({
  provider,
  status,
}) => {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const message = statusMessages[status];
  const targetProgress = statusProgress[status];
  const iconName = providerIcons[provider] || 'person';

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(targetProgress);
    }, 100);
    return () => clearTimeout(timer);
  }, [targetProgress]);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Column
      fill
      horizontal="center"
      vertical="center"
      padding="l"
      position="relative"
      style={{ minHeight: '100vh' }}
    >
      <RevealFx speed="medium" translateY={24} trigger={showContent}>
        <Column
          gap="xl"
          padding="xl"
          radius="xl"
          maxWidth={22}
          fillWidth
          horizontal="center"
          position="relative"
          zIndex={1}
        >
          <Column horizontal="center" gap="l">
            <Row
              horizontal="center"
              vertical="center"
              width={20}
              height={20}
              radius="full"
              position="relative"
            >
              <Row
                position="absolute"
                width={20}
                height={20}
                radius="full"
                border="brand-alpha-medium"
                style={{ animation: 'pulse 2s ease-in-out infinite' }}
              />
              <Row
                horizontal="center"
                vertical="center"
                width={16}
                height={16}
                radius="full"
                background="brand-alpha-weak"
              >
                <Icon name={iconName as any} size="xl" onBackground="brand-strong" />
              </Row>
            </Row>

            <Row gap="8" vertical="center">
              {status === 'success' ? (
                <StatusIndicator color="green" />
              ) : status === 'error' ? (
                <StatusIndicator color="red" />
              ) : (
                <Spinner size="xs" />
              )}
              <Text variant="label-default-s" onBackground="neutral-medium">
                {provider}
              </Text>
            </Row>
          </Column>

          <Column gap="8" horizontal="center">
            <Heading variant="heading-strong-l" align="center">
              <LetterFx speed="medium" trigger="instant" key={status}>
                {message.title}
              </LetterFx>
            </Heading>
            <Text variant="body-default-m" align="center" onBackground="neutral-medium">
              {message.subtitle}
            </Text>
          </Column>

          <Column gap="8" fillWidth>
            <ProgressBar value={progress} />
            <Row horizontal="between" fillWidth>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {status === 'authenticating' && 'Authentifizierung...'}
                {status === 'verifying' && 'Verifizierung...'}
                {status === 'connecting' && 'Verbindung...'}
                {status === 'redirecting' && 'Weiterleitung...'}
                {status === 'success' && 'Abgeschlossen'}
              </Text>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {progress}%
              </Text>
            </Row>
          </Column>

          <Row gap="8" vertical="center" horizontal="center" paddingTop="m">
            <Icon name="lock" size="xs" onBackground="brand-medium" />
            <Text variant="body-default-xs" onBackground="brand-medium">
              Sichere Verbindung
            </Text>
          </Row>
        </Column>
      </RevealFx>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.5; }
        }
      `}</style>
    </Column>
  );
};

export const OAuthErrorState: React.FC<OAuthErrorStateProps> = ({
  provider,
  error,
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Column
      fill
      horizontal="center"
      vertical="center"
      padding="l"
      position="relative"
      style={{ minHeight: '100vh' }}
    >
      <RevealFx speed="medium" translateY={24} trigger={showContent}>
        <Column
          gap="l"
          padding="xl"
          radius="xl"
          maxWidth={24}
          fillWidth
          horizontal="center"
          border="warning-alpha-medium"
          position="relative"
          zIndex={1}
        >
          <Row
            horizontal="center"
            vertical="center"
            width={16}
            height={16}
            radius="full"
            background="warning-alpha-weak"
          >
            <Icon name="warning" size="l" onBackground="warning-medium" />
          </Row>

          <Column gap="8" horizontal="center">
            <Heading variant="heading-strong-l" align="center">
              Das hat nicht geklappt
            </Heading>
            <Text variant="body-default-m" align="center" onBackground="neutral-medium">
              Bei der Anmeldung mit {provider} ist ein Fehler aufgetreten.
            </Text>
          </Column>

          <Row
            gap="s"
            padding="m"
            radius="l"
            fillWidth
            background="warning-alpha-weak"
            border="warning-alpha-medium"
          >
            <Icon name="info" size="s" onBackground="warning-medium" />
            <Text variant="body-default-s" onBackground="neutral-strong">
              {error}
            </Text>
          </Row>

          <Column gap="s" fillWidth>
            <Button href="/login" variant="primary" size="l" fillWidth>
              Zurück zur Anmeldung
            </Button>
            <Button href="/#contact" variant="tertiary" size="m" fillWidth>
              Hilfe benötigt?
            </Button>
          </Column>

          <Text variant="body-default-xs" align="center" onBackground="neutral-weak">
            Keine Sorge, deine Daten sind sicher. Versuch es einfach nochmal.
          </Text>
        </Column>
      </RevealFx>
    </Column>
  );
};

export const OAuthSuccessState: React.FC<{ provider: string }> = ({ provider }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Column
      fill
      horizontal="center"
      vertical="center"
      padding="l"
      position="relative"
      style={{ minHeight: '100vh' }}
    >
      <RevealFx speed="medium" translateY={24} trigger={showContent}>
        <Column
          gap="l"
          padding="xl"
          radius="xl"
          maxWidth={22}
          fillWidth
          horizontal="center"
          position="relative"
          zIndex={1}
        >
          <Row
            horizontal="center"
            vertical="center"
            width={16}
            height={16}
            radius="full"
            background="success-alpha-weak"
            style={{ animation: 'scaleIn 500ms ease-out' }}
          >
            <Icon name="check" size="l" onBackground="success-medium" />
          </Row>

          <Column gap="8" horizontal="center">
            <Heading variant="heading-strong-l" align="center">
              <LetterFx speed="slow" trigger="instant">
                Willkommen zurück!
              </LetterFx>
            </Heading>
            <Text variant="body-default-m" align="center" onBackground="neutral-medium">
              Du bist jetzt mit {provider} angemeldet.
            </Text>
          </Column>

          <Row gap="8" vertical="center">
            <Spinner size="xs" />
            <Text variant="body-default-s" onBackground="neutral-weak">
              Du wirst gleich weitergeleitet...
            </Text>
          </Row>
        </Column>
      </RevealFx>

      <style jsx global>{`
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </Column>
  );
};

export default OAuthCallbackLoader;
*/
