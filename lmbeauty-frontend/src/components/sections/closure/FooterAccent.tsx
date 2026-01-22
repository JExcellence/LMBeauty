"use client";

import React from 'react';
import styles from './FooterAccent.module.scss';
import { StarIcon } from './icons';

interface FooterAccentProps {
  isVisible?: boolean;
}

/**
 * FooterAccent Component
 * 
 * Decorative element with lines and star.
 * Features draw-in animation from center.
 * 
 * Design specs:
 * - Lines: 60px width, gradient fade
 * - Star: 12px, pink-medium color
 * - Animation: lines draw in, star fades in
 */
export const FooterAccent: React.FC<FooterAccentProps> = ({
  isVisible = false,
}) => {
  return (
    <div 
      className={`${styles.footerAccent} ${isVisible ? styles.visible : ''}`}
      aria-hidden="true"
    >
      <div className={`${styles.accentLine} ${styles.lineLeft}`} />
      <StarIcon className={styles.accentStar} />
      <div className={`${styles.accentLine} ${styles.lineRight}`} />
    </div>
  );
};

export default FooterAccent;
