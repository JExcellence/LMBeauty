"use client";

import React from 'react';
import Image from 'next/image';
import styles from './PhotoStack.module.scss';

/**
 * PhotoStack Component
 * 
 * Composed visual element with:
 * - Main photo with gradient overlay
 * - Decorative offset frame
 * - Staggered reveal animations
 */

interface PhotoStackProps {
  imageSrc: string;
  imageAlt: string;
  isVisible: boolean;
}

export const PhotoStack: React.FC<PhotoStackProps> = ({
  imageSrc,
  imageAlt,
  isVisible,
}) => {
  return (
    <div className={`${styles.photoStack} ${isVisible ? styles.visible : ''}`}>
      {/* Decorative frame (z-index: 1) */}
      <div className={styles.decorativeFrame} aria-hidden="true" />
      
      {/* Main photo (z-index: 3) */}
      <div className={styles.mainPhoto}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 400px, 45vw"
          className={styles.image}
          loading="lazy"
        />
        {/* Gradient overlay for depth */}
        <div className={styles.gradientOverlay} aria-hidden="true" />
      </div>
    </div>
  );
};

export default PhotoStack;
