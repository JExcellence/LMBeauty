"use client";

import React from 'react';
import styles from './SecondaryLink.module.scss';
import { ArrowRightIcon } from './icons';

interface SecondaryLinkProps {
  href: string;
  text: string;
}

/**
 * SecondaryLink Component
 * 
 * "Noch Fragen? Schreib mir." link with arrow icon.
 * Features hover translate effect on the arrow.
 * 
 * Design specs:
 * - Font: 15px, weight 500
 * - Color: text-medium → pink-dark on hover
 * - Arrow translates 4px right on hover
 */
export const SecondaryLink: React.FC<SecondaryLinkProps> = ({
  href,
  text,
}) => {
  return (
    <a 
      href={href} 
      className={styles.secondaryLink}
      aria-label={`${text} - Kontakt aufnehmen`}
    >
      <span>{text}</span>
      <ArrowRightIcon className={styles.linkIcon} aria-hidden="true" />
    </a>
  );
};

export default SecondaryLink;
