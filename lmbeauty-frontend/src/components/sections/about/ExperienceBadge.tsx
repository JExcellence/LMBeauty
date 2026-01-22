"use client";

import React from 'react';
import styles from './ExperienceBadge.module.scss';

/**
 * ExperienceBadge Component
 * 
 * Floating badge with:
 * - Icon and experience text
 * - Premium shadow
 * - Float-down entrance animation
 */

interface ExperienceBadgeProps {
  text: string;
  isVisible: boolean;
}

// Star/sparkle icon for experience
const SparkleIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    aria-hidden="true"
    className={styles.icon}
  >
    <path d="M12 0l2.545 7.455L22 10l-7.455 2.545L12 20l-2.545-7.455L2 10l7.455-2.545z" />
  </svg>
);

export const ExperienceBadge: React.FC<ExperienceBadgeProps> = ({
  text,
  isVisible,
}) => {
  return (
    <div 
      className={`${styles.experienceBadge} ${isVisible ? styles.visible : ''}`}
      role="status"
      aria-label={`Erfahrung: ${text}`}
    >
      <div className={styles.iconWrapper}>
        <SparkleIcon />
      </div>
      <span className={styles.text}>{text}</span>
    </div>
  );
};

export default ExperienceBadge;
