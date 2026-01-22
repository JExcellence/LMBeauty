"use client";

import React from 'react';
import styles from './ClosureIcon.module.scss';
import { CalendarHeartIcon } from './icons';

interface ClosureIconProps {
  isVisible?: boolean;
}

/**
 * ClosureIcon Component
 * 
 * Decorative icon container with gradient background.
 * Features calendar-heart icon, premium shadow, and scale-in animation.
 * 
 * Design specs:
 * - Size: 80px (68px on mobile)
 * - Gradient: white → pink-pale
 * - Border-radius: 24px
 * - Layered shadows with inner glow
 * - Bounce scale-in animation
 */
export const ClosureIcon: React.FC<ClosureIconProps> = ({
  isVisible = false,
}) => {
  return (
    <div 
      className={`${styles.closureIcon} ${isVisible ? styles.visible : ''}`}
      aria-hidden="true"
    >
      <CalendarHeartIcon className={styles.icon} />
    </div>
  );
};

export default ClosureIcon;
