"use client";

import React from 'react';
import styles from './TrustBanner.module.scss';

interface TrustBannerProps {
  text: string;
  isVisible: boolean;
}

/**
 * TrustBanner Component
 * 
 * Full-width banner with gradient background.
 * Features italic text, subtle border, and slide-up entrance animation.
 */
export const TrustBanner: React.FC<TrustBannerProps> = ({ text, isVisible }) => {
  return (
    <div className={`${styles.trustBanner} ${isVisible ? styles.visible : ''}`}>
      <p className={styles.bannerText}>{text}</p>
    </div>
  );
};

export default TrustBanner;
