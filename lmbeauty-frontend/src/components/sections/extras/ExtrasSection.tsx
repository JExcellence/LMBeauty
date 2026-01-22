"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './ExtrasSection.module.scss';
import { ExtrasSectionProps, ExtraService, ServiceGroup } from './types';
import { serviceGroups as defaultGroups, sectionContent } from './data';

/**
 * ExtrasSection Component
 * 
 * Post-scriptum of Services — NOT a new section.
 * Visually attached, emotionally bridged.
 * A stylist quietly pointing things out.
 */

// Scroll reveal hook
const useScrollReveal = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -20px 0px' }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [threshold]);
  
  return { ref, isVisible };
};

// Extra service card
interface ExtraCardProps {
  service: ExtraService;
  index: number;
  groupIndex: number;
}

const ExtraCard: React.FC<ExtraCardProps> = ({ service, index, groupIndex }) => {
  const delay = 120 + (groupIndex * 150) + (index * 80);
  
  return (
    <a
      href={service.bookingUrl}
      className={styles.extraCard}
      style={{ transitionDelay: `${delay}ms` }}
      aria-label={`${service.title} — Mehr erfahren`}
    >
      <div className={styles.cardInner}>
        <h4 className={styles.cardTitle}>{service.title}</h4>
        <p className={styles.cardDescription}>{service.description}</p>
      </div>
      <span className={styles.cardArrow} aria-hidden="true">→</span>
    </a>
  );
};

// Service group component
interface ServiceGroupComponentProps {
  group: ServiceGroup;
  groupIndex: number;
}

const ServiceGroupComponent: React.FC<ServiceGroupComponentProps> = ({ group, groupIndex }) => {
  return (
    <div 
      className={styles.serviceGroup}
      style={{ transitionDelay: `${80 + groupIndex * 120}ms` }}
    >
      <span className={styles.groupLabel}>{group.label}</span>
      <div className={styles.groupCards}>
        {group.services.map((service, index) => (
          <ExtraCard 
            key={service.id} 
            service={service} 
            index={index}
            groupIndex={groupIndex}
          />
        ))}
      </div>
    </div>
  );
};

export const ExtrasSection: React.FC<ExtrasSectionProps> = ({
  headlinePre = sectionContent.headlinePre,
  headlineEmphasis = sectionContent.headlineEmphasis,
  headlinePost = sectionContent.headlinePost,
  subline = sectionContent.subline,
  stylistNote = sectionContent.stylistNote,
  serviceGroups = defaultGroups,
  ctaText = sectionContent.ctaText,
  ctaUrl = sectionContent.ctaUrl,
}) => {
  const { ref: sectionRef, isVisible } = useScrollReveal(0.05);
  
  return (
    <section
      ref={sectionRef}
      className={`${styles.extrasSection} ${isVisible ? styles.sectionVisible : ''}`}
      id="extras"
      aria-labelledby="extras-headline"
    >
      <div className={styles.extrasContainer}>
        {/* Emotional bridge line — critical for flow */}
        <div className={styles.bridgeLine}>
          <p>Oft sind es die kleinen Dinge, die einen Look komplett machen.</p>
        </div>
        
        {/* Section Header — downgraded authority */}
        <header className={styles.sectionHeader}>
          <h2 id="extras-headline" className={styles.headline}>
            {headlinePre}{' '}
            <span className={styles.headlineEmphasis}>{headlineEmphasis}</span>{' '}
            {headlinePost}
          </h2>
          <p className={styles.subline}>{subline}</p>
        </header>
        
        {/* Service Groups — staggered 2+2 */}
        <div className={styles.groupsContainer}>
          {serviceGroups.map((group, index) => (
            <ServiceGroupComponent 
              key={group.id} 
              group={group} 
              groupIndex={index}
            />
          ))}
        </div>
        
        {/* Stylist's quiet note */}
        <aside className={styles.stylistNote}>
          <span className={styles.noteIcon} aria-hidden="true">✦</span>
          <p>{stylistNote}</p>
        </aside>
        
        {/* Almost invisible CTA */}
        {ctaUrl && (
          <nav className={styles.softCta}>
            <a href={ctaUrl} className={styles.ctaLink}>
              {ctaText}
            </a>
          </nav>
        )}
      </div>
    </section>
  );
};

export default ExtrasSection;
