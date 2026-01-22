"use client";

import React from 'react';
import styles from './StandardCard.module.scss';
import { CertificateIcon, SparkleIcon, BookIcon } from './icons';

export type StandardIconType = 'certificate' | 'sparkle' | 'book';

interface StandardCardProps {
  icon: StandardIconType;
  title: string;
  description: string;
  index: number;
  isVisible: boolean;
}

const iconMap = {
  certificate: CertificateIcon,
  sparkle: SparkleIcon,
  book: BookIcon,
};

/**
 * StandardCard Component
 * 
 * Premium card with icon container, title, description.
 * Features hover state with lift, glow, and top accent line.
 * Implements staggered entrance animation.
 */
export const StandardCard: React.FC<StandardCardProps> = ({
  icon,
  title,
  description,
  index,
  isVisible,
}) => {
  const IconComponent = iconMap[icon];
  
  return (
    <article
      className={`${styles.standardCard} ${isVisible ? styles.visible : ''}`}
      style={{ '--card-index': index } as React.CSSProperties}
    >
      <div className={styles.iconContainer} aria-hidden="true">
        <IconComponent className={styles.icon} />
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
    </article>
  );
};

export default StandardCard;
