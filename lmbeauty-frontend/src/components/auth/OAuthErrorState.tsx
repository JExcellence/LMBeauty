'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Column,
  Row,
  Text,
  Icon,
  Button,
} from '@once-ui-system/core';

interface OAuthErrorStateProps {
  provider: 'Google' | 'Apple' | 'Facebook' | 'Instagram';
  error: string;
}

/**
 * OAuth Error State — "Sanfter Rückschlag" Design
 * 
 * Unique approach: Broken connection visualization
 * with reassuring, warm messaging
 * 
 * Visual concept: Two circles that couldn't connect,
 * with a gentle "try again" flow
 */

const providers: Record<string, { color: string; lightColor: string }> = {
  Google: { color: '#EA4335', lightColor: '#FCECEA' },
  Apple: { color: '#1D1D1F', lightColor: '#F5F5F7' },
  Facebook: { color: '#1877F2', lightColor: '#E7F3FF' },
  Instagram: { color: '#E4405F', lightColor: '#FDEEF1' },
};

export function OAuthErrorState({ provider, error }: OAuthErrorStateProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  
  const config = providers[provider] || providers.Google;

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Column
      fillWidth
      horizontal="center"
      vertical="center"
      style={{
        minHeight: '100vh',
        background: 'var(--lm-bg-warm)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle pattern background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle at 2px 2px, var(--lm-pink-alpha-weak) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
          opacity: 0.5,
        }}
      />

      {/* Main Content */}
      <Column
        gap="40"
        padding="48"
        horizontal="center"
        maxWidth={28}
        style={{
          position: 'relative',
          zIndex: 10,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Disconnected Circles Visualization */}
        <div
          style={{
            position: 'relative',
            width: '200px',
            height: '120px',
          }}
        >
          {/* Left circle (LM Beauty) */}
          <div
            style={{
              position: 'absolute',
              left: '0',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--lm-gradient-pink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px var(--lm-pink-alpha-medium)',
              animation: 'float-left 3s ease-in-out infinite',
            }}
          >
            <Text variant="heading-strong-m" style={{ color: 'white' }}>
              LM
            </Text>
          </div>

          {/* Broken connection line */}
          <div
            style={{
              position: 'absolute',
              left: '80px',
              top: '50%',
              width: '40px',
              height: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '4px',
                background: 'var(--lm-border)',
                borderRadius: '2px',
                animation: 'dash-blink 1.5s ease-in-out infinite',
              }}
            />
            <Icon 
              name="close" 
              size="xs" 
              style={{ 
                color: 'var(--lm-red)',
                animation: 'shake-icon 0.5s ease-in-out infinite',
              }} 
            />
            <div
              style={{
                width: '12px',
                height: '4px',
                background: 'var(--lm-border)',
                borderRadius: '2px',
                animation: 'dash-blink 1.5s ease-in-out infinite 0.2s',
              }}
            />
          </div>

          {/* Right circle (Provider) */}
          <div
            style={{
              position: 'absolute',
              right: '0',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: config.lightColor,
              border: `3px solid ${config.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'float-right 3s ease-in-out infinite 0.5s',
            }}
          >
            <Icon 
              name={provider.toLowerCase() as any} 
              size="l" 
              style={{ color: config.color }} 
            />
          </div>
        </div>

        {/* Error Message */}
        <Column gap="12" horizontal="center">
          <Text
            variant="heading-strong-l"
            align="center"
            onBackground="neutral-strong"
          >
            Verbindung fehlgeschlagen
          </Text>
          <Text
            variant="body-default-m"
            align="center"
            onBackground="neutral-medium"
            style={{ maxWidth: '320px' }}
          >
            Die Anmeldung mit {provider} hat leider nicht geklappt. 
            Aber keine Sorge — versuch es einfach nochmal.
          </Text>
        </Column>

        {/* Error Details Card */}
        <Row
          gap="12"
          padding="16"
          radius="l"
          fillWidth
          vertical="center"
          style={{
            background: 'rgba(229, 57, 53, 0.06)',
            border: '1px solid rgba(229, 57, 53, 0.15)',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(229, 57, 53, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon name="info" size="s" style={{ color: 'var(--lm-red)' }} />
          </div>
          <Text variant="body-default-s" onBackground="neutral-strong">
            {error}
          </Text>
        </Row>

        {/* Action Buttons */}
        <Column gap="12" fillWidth>
          <Button
            variant="primary"
            size="l"
            fillWidth
            onClick={() => router.push('/login')}
            onMouseEnter={() => setHoveredButton('back')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              background: 'var(--lm-gradient-pink)',
              transform: hoveredButton === 'back' ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: hoveredButton === 'back' 
                ? '0 8px 24px var(--lm-pink-alpha-strong)' 
                : '0 4px 16px var(--lm-pink-alpha-medium)',
              transition: 'all 0.3s ease',
            }}
          >
            <Row gap="8" vertical="center">
              <Icon name="chevronLeft" size="s" />
              <Text>Zurück zur Anmeldung</Text>
            </Row>
          </Button>

          <Button
            variant="tertiary"
            size="m"
            fillWidth
            onClick={() => window.location.reload()}
            onMouseEnter={() => setHoveredButton('retry')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <Row gap="8" vertical="center">
              <Icon name="refresh" size="s" />
              <Text>Nochmal versuchen</Text>
            </Row>
          </Button>
        </Column>

        {/* Help Link */}
        <Row gap="8" vertical="center" style={{ opacity: 0.7 }}>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Brauchst du Hilfe?
          </Text>
          <Button
            variant="tertiary"
            size="s"
            href="/#closure"
          >
            Schreib mir
          </Button>
        </Row>
      </Column>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes float-left {
          0%, 100% {
            transform: translateY(-50%) translateX(0);
          }
          50% {
            transform: translateY(-50%) translateX(-5px);
          }
        }

        @keyframes float-right {
          0%, 100% {
            transform: translateY(-50%) translateX(0);
          }
          50% {
            transform: translateY(-50%) translateX(5px);
          }
        }

        @keyframes dash-blink {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes shake-icon {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-10deg);
          }
          75% {
            transform: rotate(10deg);
          }
        }
      `}</style>
    </Column>
  );
}

export default OAuthErrorState;
