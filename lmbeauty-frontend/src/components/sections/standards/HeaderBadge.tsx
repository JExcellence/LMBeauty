"use client";

import React from 'react';
import styles from './HeaderBadge.module.scss';
import { ShieldCheckIcon } from './icons';

interface HeaderBadgeProps {
  isVisible: boolean;
}

/**
 * HeaderBadge Component
 * 
 * Floating shield/checkmark badge above headline.
 * Features gentle float animation (4s cycle).
 */
export const HeaderBadge: React.FC<HeaderBadgeProps> = ({ isVisible }) => {
  return (
    <div 
      className={`${styles.headerBadge} ${isVisible ? styles.visible : ''}`}
      aria-hidden="true"
    >
      <ShieldCheckIcon className={styles.icon} />
    </div>
  );
};

export default HeaderBadge;
