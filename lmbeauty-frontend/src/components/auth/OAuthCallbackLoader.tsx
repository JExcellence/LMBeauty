'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Column,
  Row,
  Text,
  Icon,
  Skeleton,
  Avatar,
  AvatarGroup,
  Fade,
  Background,
} from '@once-ui-system/core';

type AuthStatus = 'authenticating' | 'verifying' | 'connecting' | 'redirecting';

interface OAuthCallbackLoaderProps {
  provider: 'Google' | 'Apple' | 'Facebook' | 'Instagram';
  status: AuthStatus;
}

/**
 * OAuth Callback Loader — "Sanfte Ankunft" Design
 * 
 * Unique approach: Horizontal timeline with morphing shapes
 * Feels like a gentle journey, not a loading screen
 * 
 * Visual concept: Floating cards that stack and reveal
 * as the authentication progresses
 */

// Provider configurations
const providers: Record<string, { color: string; gradient: string; emoji: string }> = {
  Google: { 
    color: '#EA4335', 
    gradient: 'linear-gradient(135deg, #EA4335 0%, #FBBC05 50%, #34A853 100%)',
    emoji: '🔴'
  },
  Apple: { 
    color: '#000000', 
    gradient: 'linear-gradient(135deg, #1D1D1F 0%, #86868B 100%)',
    emoji: '🍎'
  },
  Facebook: { 
    color: '#1877F2', 
    gradient: 'linear-gradient(135deg, #1877F2 0%, #42B72A 100%)',
    emoji: '🔵'
  },
  Instagram: { 
    color: '#E4405F', 
    gradient: 'linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)',
    emoji: '📸'
  },
};

// Journey steps with emotional copy
const journeySteps = [
  { 
    id: 'authenticating', 
    title: 'Hallo!',
    subtitle: 'Wir erkennen dich...',
    icon: 'sparkle',
  },
  { 
    id: 'verifying', 
    title: 'Alles sicher',
    subtitle: 'Deine Daten werden geprüft',
    icon: 'security',
  },
  { 
    id: 'connecting', 
    title: 'Verbunden',
    subtitle: 'Dein Konto ist bereit',
    icon: 'heart',
  },
  { 
    id: 'redirecting', 
    title: 'Willkommen!',
    subtitle: 'Gleich geht\'s los...',
    icon: 'check',
  },
];

export function OAuthCallbackLoader({ provider, status }: OAuthCallbackLoaderProps) {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  
  const config = providers[provider] || providers.Google;
  const currentIndex = journeySteps.findIndex(s => s.id === status);
  const currentStep = journeySteps[currentIndex] || journeySteps[0];

  // Mount animation
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
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
      {/* Floating Particles Background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: config.color,
              opacity: 0.1,
              animation: `float-particle 8s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Radial Glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: `radial-gradient(circle, ${config.color}15 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Main Content */}
      <Column
        gap="40"
        padding="48"
        horizontal="center"
        style={{
          position: 'relative',
          zIndex: 10,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Provider Badge */}
        <Row
          gap="12"
          vertical="center"
          padding="12"
          radius="full"
          style={{
            background: 'var(--lm-bg-white)',
            boxShadow: `0 4px 24px ${config.color}20`,
            border: `2px solid ${config.color}30`,
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: config.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name={provider.toLowerCase() as any} size="s" style={{ color: 'white' }} />
          </div>
          <Text variant="label-default-m" style={{ color: config.color }}>
            {provider}
          </Text>
        </Row>

        {/* Morphing Shape Container */}
        <div
          style={{
            position: 'relative',
            width: '200px',
            height: '200px',
          }}
        >
          {/* Outer rotating ring */}
          <div
            style={{
              position: 'absolute',
              inset: '-20px',
              borderRadius: '50%',
              border: `3px dashed ${config.color}30`,
              animation: 'rotate-slow 20s linear infinite',
            }}
          />
          
          {/* Middle pulsing ring */}
          <div
            style={{
              position: 'absolute',
              inset: '0',
              borderRadius: '50%',
              border: `2px solid ${config.color}50`,
              animation: 'pulse-ring 2s ease-in-out infinite',
            }}
          />

          {/* Inner morphing blob */}
          <div
            style={{
              position: 'absolute',
              inset: '30px',
              background: config.gradient,
              borderRadius: currentIndex >= 3 ? '50%' : `${60 - currentIndex * 10}% ${40 + currentIndex * 10}% ${50 + currentIndex * 5}% ${50 - currentIndex * 5}%`,
              animation: 'morph-blob 4s ease-in-out infinite',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 20px 60px ${config.color}40`,
              transition: 'border-radius 0.8s ease',
            }}
          >
            <Icon 
              name={currentStep.icon as any} 
              size="xl" 
              style={{ 
                color: 'white',
                animation: 'icon-bounce 1s ease-in-out infinite',
              }} 
            />
          </div>

          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: i <= currentIndex ? config.color : 'var(--lm-border)',
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 120}deg) translateX(110px) translateY(-50%)`,
                animation: `orbit ${6 + i}s linear infinite`,
                transition: 'background 0.5s ease',
                boxShadow: i <= currentIndex ? `0 0 20px ${config.color}` : 'none',
              }}
            />
          ))}
        </div>

        {/* Status Text */}
        <Column gap="8" horizontal="center">
          <Text
            variant="display-strong-s"
            align="center"
            style={{
              background: config.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {currentStep.title}
          </Text>
          <Text
            variant="body-default-m"
            align="center"
            onBackground="neutral-medium"
          >
            {currentStep.subtitle}
          </Text>
        </Column>

        {/* Journey Timeline */}
        <Row gap="8" vertical="center">
          {journeySteps.map((step, index) => {
            const isComplete = index < currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <React.Fragment key={step.id}>
                <div
                  style={{
                    width: isCurrent ? '48px' : '12px',
                    height: '12px',
                    borderRadius: '6px',
                    background: isComplete || isCurrent ? config.color : 'var(--lm-border)',
                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: isComplete ? 0.5 : 1,
                  }}
                />
              </React.Fragment>
            );
          })}
        </Row>

        {/* Trust Indicators */}
        <Row gap="l" vertical="center" style={{ opacity: 0.6 }}>
          <Row gap="4" vertical="center">
            <Icon name="lock" size="xs" onBackground="neutral-weak" />
            <Text variant="body-default-xs" onBackground="neutral-weak">
              256-bit SSL
            </Text>
          </Row>
          <Row gap="4" vertical="center">
            <Icon name="security" size="xs" onBackground="neutral-weak" />
            <Text variant="body-default-xs" onBackground="neutral-weak">
              DSGVO konform
            </Text>
          </Row>
        </Row>
      </Column>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }

        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-ring {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.2;
          }
        }

        @keyframes morph-blob {
          0%, 100% {
            border-radius: 60% 40% 50% 50%;
            transform: rotate(0deg);
          }
          25% {
            border-radius: 50% 60% 40% 50%;
          }
          50% {
            border-radius: 40% 50% 60% 50%;
            transform: rotate(5deg);
          }
          75% {
            border-radius: 50% 40% 50% 60%;
          }
        }

        @keyframes orbit {
          from { transform: rotate(0deg) translateX(110px) translateY(-50%); }
          to { transform: rotate(360deg) translateX(110px) translateY(-50%); }
        }

        @keyframes icon-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </Column>
  );
}

export default OAuthCallbackLoader;
