'use client';

import { useEffect, useState } from 'react';
import { Column, Icon } from '@once-ui-system/core';
import styles from './SuccessAnimation.module.scss';

interface SuccessAnimationProps {
  onComplete?: () => void;
  showConfetti?: boolean;
}

export function SuccessAnimation({ onComplete, showConfetti = true }: SuccessAnimationProps) {
  const [showCheck, setShowCheck] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<Array<{ id: number; style: React.CSSProperties }>>([]);

  useEffect(() => {
    // Show checkmark after a brief delay
    const checkTimer = setTimeout(() => setShowCheck(true), 300);

    // Generate confetti pieces
    if (showConfetti) {
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 0.5}s`,
          backgroundColor: ['#C4607A', '#D4708A', '#E8A4B8', '#FFD700', '#FFF0F4'][
            Math.floor(Math.random() * 5)
          ],
        } as React.CSSProperties,
      }));
      setConfettiPieces(pieces);
    }

    // Call onComplete after animation
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 2000);

    return () => {
      clearTimeout(checkTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, showConfetti]);

  return (
    <Column center className={styles.container}>
      {showConfetti && (
        <div className={styles.confettiContainer}>
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className={styles.confetti}
              style={piece.style}
            />
          ))}
        </div>
      )}
      <Column center className={`${styles.checkCircle} ${showCheck ? styles.show : ''}`}>
        <Icon name="check" size="xl" className={styles.checkIcon} />
      </Column>
    </Column>
  );
}

export default SuccessAnimation;
