"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './RealityCTA.module.scss';
import { pageContent } from './data';

/**
 * RealityCTA — Conversion CTA Section
 * 
 * Dual CTA layout with permission-based language.
 * Primary: "Termin buchen" → /#booking
 * Secondary: "Erstmal telefonieren" → consultation
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 8.4
 */

// Scroll reveal hook
const useScrollReveal = (threshold = 0.15) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [threshold]);
  
  return { ref, isVisible };
};

interface RealityCTAProps {
  primaryText?: string;
  primaryHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
}

export const RealityCTA: React.FC<RealityCTAProps> = ({
  primaryText = 'Termin buchen',
  primaryHref = '/#booking',
  secondaryText = 'Lieber erstmal anrufen',
  secondaryHref = 'tel:+4915259675346',
}) => {
  const { ref: sectionRef, isVisible } = useScrollReveal(0.1);
  
  return (
    <section
      ref={sectionRef}
      className={`${styles.ctaSection} ${isVisible ? styles.visible : ''}`}
      aria-label="Jetzt Termin buchen"
    >
      {/* Background gradient */}
      <div className={styles.backgroundGradient} aria-hidden="true" />
      
      <div className={styles.container}>
        {/* Section Header */}
        <header className={styles.sectionHeader}>
          <h2 className={styles.headline}>{pageContent.cta.headline}</h2>
          {pageContent.cta.subline && (
            <p className={styles.subline}>{pageContent.cta.subline}</p>
          )}
        </header>
        
        {/* CTA Buttons */}
        <div className={styles.ctaButtons}>
          {/* Primary CTA */}
          <a
            href={primaryHref}
            className={styles.primaryCta}
            aria-label={primaryText}
          >
            {primaryText}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </a>
          
          {/* Secondary CTA */}
          <a
            href={secondaryHref}
            className={styles.secondaryCta}
            aria-label={secondaryText}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {secondaryText}
          </a>
        </div>
        
        {/* Lisa Personal Note */}
        <div className={styles.lisaNote}>
          <p className={styles.noteText}>
            {pageContent.cta.lisaNote}
          </p>
          <span className={styles.signature}>— Lisa</span>
        </div>
      </div>
    </section>
  );
};

export default RealityCTA;
