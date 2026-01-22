"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './ExperienceSection.module.scss';
import { pageContent, timeline, surprisingDetail, TimelineStep } from './data';

/**
 * ExperienceSection — "So läuft ein Termin ab"
 * 
 * Timeline showing what to expect from arrival to departure.
 * Builds trust by addressing worries and showing the reality.
 */

// Scroll reveal hook
const useScrollReveal = (threshold = 0.15) => {
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
            { threshold, rootMargin: '0px 0px -40px 0px' }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [threshold]);

    return { ref, isVisible };
};

// Timeline Step Component
interface TimelineStepProps {
    step: TimelineStep;
    index: number;
    isLast: boolean;
}

const TimelineStepCard: React.FC<TimelineStepProps> = ({ step, index, isLast }) => {
    return (
        <article
            className={styles.timelineStep}
            style={{ '--step-index': index } as React.CSSProperties}
        >
            {/* Timeline connector */}
            <div className={styles.timelineConnector}>
                <div className={styles.timelineDot} />
                {!isLast && <div className={styles.timelineLine} />}
            </div>

            {/* Step content */}
            <div className={styles.stepContent}>
                {/* Time label */}
                <span className={styles.timeLabel}>{step.time}</span>

                {/* Expectation — What you might worry about */}
                {step.expectation && (
                    <div className={styles.expectationBlock}>
                        <span className={styles.blockLabel}>Was du vielleicht denkst</span>
                        <p className={styles.expectationText}>{step.expectation}</p>
                    </div>
                )}

                {/* Reality — What actually happens */}
                <div className={styles.realityBlock}>
                    <span className={styles.blockLabel}>Was wirklich passiert</span>
                    <p className={styles.realityText}>{step.reality}</p>
                </div>

                {/* Optional detail */}
                {step.detail && (
                    <p className={styles.detailText}>
                        <span className={styles.detailIcon}>✨</span>
                        {step.detail}
                    </p>
                )}
            </div>
        </article>
    );
};


// Surprising detail callout
const SurprisingDetailCallout: React.FC = () => {
    if (!surprisingDetail.content) return null;
    
    return (
        <aside className={styles.secretWeapon}>
            <div className={styles.secretWeaponContent}>
                <h3 className={styles.secretWeaponTitle}>
                    {surprisingDetail.title}
                </h3>
                <p className={styles.secretWeaponText}>
                    {surprisingDetail.content}
                </p>
            </div>
        </aside>
    );
};

export const ExperienceSection: React.FC = () => {
    const { ref: sectionRef, isVisible } = useScrollReveal(0.1);

    return (
        <section
            ref={sectionRef}
            className={`${styles.experienceSection} ${isVisible ? styles.visible : ''}`}
            aria-labelledby="experience-headline"
        >
            <div className={styles.container}>
                {/* Section Header */}
                <header className={styles.sectionHeader}>
                    <h2 id="experience-headline" className={styles.headline}>
                        {pageContent.section2.headline}
                    </h2>
                    {pageContent.section2.subline && (
                        <p className={styles.subline}>{pageContent.section2.subline}</p>
                    )}
                </header>

                {/* Timeline */}
                <div className={styles.timeline}>
                    {timeline.map((step, index) => (
                        <TimelineStepCard
                            key={step.id}
                            step={step}
                            index={index}
                            isLast={index === timeline.length - 1}
                        />
                    ))}
                </div>

                {/* Surprising detail */}
                <SurprisingDetailCallout />
            </div>
        </section>
    );
};

export default ExperienceSection;
