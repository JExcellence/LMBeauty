'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Column, Text, Icon, Spinner, Row } from '@once-ui-system/core';

interface DeletionStatus {
  status: string;
  provider?: string;
  requestedAt?: string;
  message: string;
}

function DeletionStatusContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<DeletionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams?.get('code');
    
    if (!code) {
      setError('Kein Bestätigungscode angegeben.');
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/oauth/webhook/deletion-status/${code}`
        );
        const data = await response.json();
        setStatus(data.data || data);
      } catch (err) {
        setError('Status konnte nicht abgerufen werden.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [searchParams]);

  const getStatusIcon = (statusCode: string) => {
    switch (statusCode) {
      case 'COMPLETED':
        return <Icon name="check" size="l" />;
      case 'NOT_FOUND':
        return <Icon name="search" size="l" />;
      default:
        return <Icon name="info" size="l" />;
    }
  };

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case 'COMPLETED':
        return 'var(--color-success)';
      case 'NOT_FOUND':
        return 'var(--color-warning)';
      default:
        return 'var(--color-neutral)';
    }
  };

  return (
    <Column fillWidth style={{ minHeight: '100vh' }}>
      <Column 
        as="main" 
        flex={1} 
        fillWidth 
        center
        padding="xl"
        style={{ paddingTop: '120px' }}
      >
        <Column 
          gap="24" 
          maxWidth="s"
          padding="xl"
          background="surface"
          radius="l"
          border="neutral-alpha-weak"
        >
          <Text variant="heading-strong-l" align="center">
            Datenlöschung Status
          </Text>

          {loading && (
            <Column center gap="16" padding="xl">
              <Spinner size="l" />
              <Text variant="body-default-m" onBackground="neutral-medium">
                Status wird abgerufen...
              </Text>
            </Column>
          )}

          {error && (
            <Column center gap="16" padding="l">
              <Icon name="warning" size="l" />
              <Text variant="body-default-m" onBackground="neutral-medium" align="center">
                {error}
              </Text>
            </Column>
          )}

          {status && !loading && (
            <Column gap="20">
              <Row center>
                <div style={{ color: getStatusColor(status.status) }}>
                  {getStatusIcon(status.status)}
                </div>
              </Row>

              <Text variant="body-default-m" align="center">
                {status.message}
              </Text>

              {status.provider && (
                <Row gap="8" center>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Anbieter:
                  </Text>
                  <Text variant="body-default-s">
                    {status.provider.charAt(0).toUpperCase() + status.provider.slice(1)}
                  </Text>
                </Row>
              )}

              {status.requestedAt && (
                <Row gap="8" center>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Angefordert am:
                  </Text>
                  <Text variant="body-default-s">
                    {new Date(status.requestedAt).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </Row>
              )}

              <Column gap="8" paddingTop="16">
                <Text variant="body-default-xs" onBackground="neutral-weak" align="center">
                  Bei Fragen kontaktieren Sie uns unter:
                </Text>
                <Text variant="body-default-s" align="center">
                  datenschutz@lm-beauty.de
                </Text>
              </Column>
            </Column>
          )}
        </Column>
      </Column>
    </Column>
  );
}

export default function DeletionStatusPage() {
  return (
    <Suspense
      fallback={
        <Column fillWidth center style={{ minHeight: '100vh' }}>
          <Spinner size="l" />
        </Column>
      }
    >
      <DeletionStatusContent />
    </Suspense>
  );
}
