"use client";

import React from 'react';
import styles from './CredentialsRow.module.scss';

/**
 * CredentialsRow Component
 * 
 * Subtle trust indicators with:
 * - Checkmark icons
 * - Credential text
 * - Border-top separator
 * - Slide-up entrance animation
 */

interface CredentialsRowProps {
  credentials: string[];
  isVisible: boolean;
}

// Checkmark icon
const CheckIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5"
    aria-hidden="true"
    className={styles.checkIcon}
  >
    <path 
      d="M5 12l5 5L20 7" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

export const CredentialsRow: React.FC<CredentialsRowProps> = ({
  credentials,
  isVisible,
}) => {
  return (
    <div 
      className={`${styles.credentialsRow} ${isVisible ? styles.visible : ''}`}
      role="list"
      aria-label="Qualifikationen"
    >
      {credentials.map((credential, index) => (
        <div 
          key={index} 
          className={styles.credential}
          role="listitem"
          style={{ transitionDelay: `${650 + index * 100}ms` }}
        >
          <CheckIcon />
          <span>{credential}</span>
        </div>
      ))}
    </div>
  );
};

export default CredentialsRow;
