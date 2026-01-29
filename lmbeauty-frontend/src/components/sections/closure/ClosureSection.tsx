"use client";

import React from 'react';
import {Icon, Text} from "@once-ui-system/core";
import styles from './ClosureSection.module.scss';
import {useScrollReveal} from '@/hooks';

/**
 * ClosureSection — Enhanced Emotional Permission
 *
 * The emotional climax of the page.
 * Two-column layout with:
 * - Left: Compelling copy and CTA
 * - Right: Quick contact options
 */

// Contact methods
const contactMethods = [
    {
        icon: 'phone',
        label: 'Anrufen',
        value: '01525 9675346',
        href: 'tel:+4915259675346',
    },
    {
        icon: 'whatsapp',
        label: 'WhatsApp',
        value: 'Nachricht senden',
        href: 'https://wa.me/+4915259675346?text=Hey%20Lisa%20%F0%9F%98%8A%20ich%20habe%20deine%20Webseite%20gesehen%20und%20habe%20Interesse%20an%20einem%20Termin.',
    },
    {
        icon: 'email',
        label: 'E-Mail',
        value: 'lisa.pinske@lmbeauty.de',
        href: 'mailto:lisa.pinske@lmbeauty.de',
    },
];

// Get booking URL based on construction mode
const getBookingUrl = (): string => {
    const isUnderConstruction = process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION === 'true';
    if (isUnderConstruction) {
        return '/#contact';
    }
    return process.env.NEXT_PUBLIC_BOOKING_URL || '/#contact';
};

interface ClosureSectionProps {
    bookingUrl?: string;
}

export const ClosureSection: React.FC<ClosureSectionProps> = ({
                                                                  bookingUrl,
                                                              }) => {
    const {ref: sectionRef, isVisible} = useScrollReveal({threshold: 0.15});
    const finalBookingUrl = bookingUrl || getBookingUrl();
    const isUnderConstruction = process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION === 'true';

    return (
        <section
            ref={sectionRef}
            className={`${styles.closureSection} ${isVisible ? styles.visible : ''}`}
            id="booking"
            aria-labelledby="closure-headline"
        >
            {/* Background gradient */}
            <div className={styles.backgroundGradient} aria-hidden="true"/>

            <div className={styles.container}>
                <div className={styles.layout}>
                    {/* Left Column — Main CTA */}
                    <div className={styles.ctaColumn}>
                        {/* Emotional permission — the whisper before the ask */}
                        <p className={styles.permission}>
                            Du musst nicht alles wissen. Du musst nur wissen, dass du willkommen bist.
                        </p>

                        <span className={styles.label}>Jetzt starten</span>

                        <h2 id="closure-headline" className={styles.headline}>
                            Bereit für deinen <span className={styles.accent}>neuen Look</span>?
                        </h2>

                        <p className={styles.description}>
                            Schreib mir einfach — kein Druck, kein Verkaufsgespräch.
                            Nur ein Gespräch, bei dem du Fragen stellen kannst.
                        </p>

                        <div className={styles.ctaButtons}>
                            <a
                                href={finalBookingUrl}
                                className={styles.primaryCta}
                                aria-label={isUnderConstruction ? "Kontakt aufnehmen" : "Online Termin buchen"}
                            >
                                {isUnderConstruction ? 'Kontakt aufnehmen' : 'Termin buchen'}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor"
                                          strokeWidth="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"
                                          strokeLinecap="round"/>
                                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"
                                          strokeLinecap="round"/>
                                    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </a>

                            <span className={styles.ctaNote}>
                Ich melde mich innerhalb von 24 Stunden — versprochen.
              </span>
                        </div>
                    </div>

                    {/* Right Column — Contact Options */}
                    <div className={styles.contactColumn}>
                        <div className={styles.contactCard}>
                            <h3 className={styles.contactTitle}>Oder kontaktiere mich direkt</h3>

                            <div className={styles.contactMethods}>
                                {contactMethods.map((method, index) => (
                                    <a
                                        key={method.label}
                                        href={method.href}
                                        className={styles.contactMethod}
                                        style={{'--method-index': index} as React.CSSProperties}
                                        target={method.icon === 'whatsapp' ? '_blank' : undefined}
                                        rel={method.icon === 'whatsapp' ? 'noopener noreferrer' : undefined}
                                        aria-label={`${method.label}: ${method.value}`}
                                    >
                                        <div className={styles.methodIcon}>
                                            <Icon name={method.icon as any} size="s"/>
                                        </div>
                                        <div className={styles.methodContent}>
                                            <span className={styles.methodLabel}>{method.label}</span>
                                            <span className={styles.methodValue}>{method.value}</span>
                                        </div>
                                        <Icon name="chevronRight" size="xs" className={styles.methodArrow}/>
                                    </a>
                                ))}
                            </div>

                            <div className={styles.availability}>
                                <Icon name="clock" size="xs"/>
                                <Text variant="body-default-xs" onBackground="neutral-weak">
                                    Antwort innerhalb von 24 Stunden
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ClosureSection;
