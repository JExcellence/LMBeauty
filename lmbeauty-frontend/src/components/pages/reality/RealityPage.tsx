"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Column, Flex } from "@once-ui-system/core";
import styles from './RealityPage.module.scss';
import { pageContent } from './data';
import { AnxietiesSection } from './AnxietiesSection';
import { ExperienceSection } from './ExperienceSection';
import { ReliefTestimonials } from './ReliefTestimonials';
import { RealityCTA } from './RealityCTA';

/**
 * RealityPage — "Wie es wirklich ist"
 * 
 * Anxiety-reduction page for nervous first-timers.
 * Exactly 3 sections + purpose header + CTA.
 * 
 * Conversion Goal: "Okay, it's not scary. I can do this."
 */

// Scroll reveal hook — consistent with other sections
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

export const RealityPage: React.FC = () => {
    const { ref: headerRef, isVisible: headerVisible } = useScrollReveal(0.1);

    return (
        <Column fillWidth className={styles.realityPage}>
            <Flex 
                as="main"
                flex={1}
                direction="column"
                className={styles.mainContent}
            >
                {/* Page Purpose Statement */}
                <header 
                    ref={headerRef}
                    className={`${styles.purposeHeader} ${headerVisible ? styles.visible : ''}`}
                >
                    <div className={styles.purposeContainer}>
                        {/* Back to main page navigation */}
                        <Link href="/" className={styles.backLink}>
                            <svg 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                aria-hidden="true"
                            >
                                <path 
                                    d="M19 12H5M5 12L12 19M5 12L12 5" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                />
                            </svg>
                            Zurück zur Startseite
                        </Link>
                        
                        <h1 className={styles.purposeHeadline}>
                            {pageContent.purpose.headline}
                        </h1>
                        <p className={styles.purposeSubline}>
                            {pageContent.purpose.subline}
                        </p>
                        <p className={styles.purposeIntro}>
                            {pageContent.purpose.intro}
                        </p>
                    </div>
                </header>

                {/* Section 1: Die 3 Ängste */}
                <AnxietiesSection />

                {/* Section 2: So fühlt es sich an */}
                <ExperienceSection />

                {/* Section 3: Das sagen Kundinnen */}
                <ReliefTestimonials />

                {/* CTA Section */}
                <RealityCTA />
            </Flex>
        </Column>
    );
};

export default RealityPage;
