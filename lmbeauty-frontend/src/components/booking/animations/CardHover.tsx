'use client';

import { ReactNode } from 'react';
import { TiltFx } from '@once-ui-system/core';

interface CardHoverProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function CardHover({ children, className, disabled = false }: CardHoverProps) {
  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <TiltFx className={className}>
      {children}
    </TiltFx>
  );
}

export default CardHover;
