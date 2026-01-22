'use client';

import { ReactNode } from 'react';
import { RevealFx } from '@once-ui-system/core';

interface BookingRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export function BookingReveal({
  children,
  delay = 0,
  direction = 'up',
  className,
}: BookingRevealProps) {
  const translateMap: Record<string, { y?: number; x?: number }> = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  };

  const translate = translateMap[direction];

  return (
    <RevealFx
      delay={delay}
      translateY={translate.y ?? 0}
      speed="medium"
      className={className}
    >
      {children}
    </RevealFx>
  );
}

export default BookingReveal;
