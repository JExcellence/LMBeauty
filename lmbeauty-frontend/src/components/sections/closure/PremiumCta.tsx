"use client";

import React from 'react';
import styles from './PremiumCta.module.scss';

interface PremiumCtaProps {
  href: string;
  text: string;
}

/**
 * PremiumCta Component
 * 
 * CTA button matching hero design language.
 */
export const PremiumCta: React.FC<PremiumCtaProps> = ({
  href,
  text,
}) => {
  return (
    <a
      href={href}
      className={styles.premiumCta}
      aria-label={`${text} - Online Terminbuchung`}
    >
      <span>{text}</span>
    </a>
  );
};

export default PremiumCta;
