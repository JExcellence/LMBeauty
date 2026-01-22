"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './AnxietiesSection.module.scss';
import { pageContent, anxieties, Anxiety } from './data';

/**
 * AnxietiesSection — "Was viele vorher denken"
 * 
 * Addresses common fears with honest, reassuring answers.
 * Shows "Was du denkst" vs "Wie es wirklich ist" to build trust.
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

// Anxiety Card Component
interface AnxietyCardProps {
    anxiety: Anxiety;
    index: number;
}

const AnxietyCard: React.FC<AnxietyCardProps> = ({ anxiety, index }) => {
    return (
        <article
            className={styles.anxietyCard}
            style={{ '--card-index': index } as React.CSSProperties}
        >
            {/* Fear — What you think */}
            <div className={styles.fearSection}>
                <span className={styles.fearLabel}>Was du denkst</span>
                <p className={styles.fearText}>{anxiety.fear}</p>
            </div>

            {/* Proof — Video, Quote, or Image */}
            <div className={styles.proofSection}>
                {anxiety.proofType === 'video' && (
                    <div className={styles.videoPlaceholder}>
                        <div className={styles.playIcon}>▶</div>
                        <span className={styles.placeholderText}>
                            Video: Entspannte Kundin während der Behandlung
                        </span>
                    </div>
                )}

                {anxiety.proofType === 'quote' && anxiety.proofContent.quote && (
                    <div className={styles.quoteProof}>
                        <blockquote className={styles.proofQuote}>
                            „{anxiety.proofContent.quote}"
                        </blockquote>
                        <cite className={styles.proofAuthor}>
                            — {anxiety.proofContent.author}
                        </cite>
                    </div>
                )}

                {anxiety.proofType === 'image' && (
                    <div className={styles.imagePlaceholder}>
                        <span className={styles.placeholderText}>
                            Foto: Kundin entspannt während der Behandlung
                        </span>
                    </div>
                )}
            </div>

            {/* Reality — How it really is */}
            <div className={styles.realitySection}>
                <span className={styles.realityLabel}>Wie es wirklich ist</span>
                <p className={styles.realityText}>{anxiety.reality}</p>
            </div>
        </article>
    );
};

export const AnxietiesSection: React.FC = () => {
    const { ref: sectionRef, isVisible } = useScrollReveal(0.1);

    return (
        <section
            ref={sectionRef}
            className={`${styles.anxietiesSection} ${isVisible ? styles.visible : ''}`}
            aria-labelledby="anxieties-headline"
        >
            <div className={styles.container}>
                {/* Section Header */}
                <header className={styles.sectionHeader}>
                    <h2 id="anxieties-headline" className={styles.headline}>
                        {pageContent.section1.headline}
                    </h2>
                    {pageContent.section1.subline && (
                        <p className={styles.subline}>{pageContent.section1.subline}</p>
                    )}
                </header>

                {/* Anxiety Cards Grid */}
                <div className={styles.anxietiesGrid}>
                    {anxieties.map((anxiety, index) => (
                        <AnxietyCard key={anxiety.id} anxiety={anxiety} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AnxietiesSection;
