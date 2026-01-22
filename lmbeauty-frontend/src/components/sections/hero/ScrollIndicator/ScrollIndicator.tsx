"use client";

import React, { useState, useEffect, useCallback } from 'react';
import styles from './ScrollIndicator.module.scss';

const FADE_THRESHOLD = 100;

export const ScrollIndicator: React.FC = () => {
  const [opacity, setOpacity] = useState(1);
  const [isVisible, setIsVisible] = useState(true);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    
    if (scrollY >= FADE_THRESHOLD) {
      setOpacity(0);
      setIsVisible(false);
    } else {
      const newOpacity = 1 - (scrollY / FADE_THRESHOLD);
      setOpacity(newOpacity);
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    handleScroll();

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  if (!isVisible && opacity === 0) {
    return null;
  }

  return (
    <div
      className={`${styles.scrollIndicator}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <span className={styles.scrollText}>Mehr entdecken</span>
      <svg 
        className={styles.scrollIcon} 
        width="20" 
        height="20" 
        viewBox="0 0 20 20" 
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M5 7.5L10 12.5L15 7.5" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ScrollIndicator;
