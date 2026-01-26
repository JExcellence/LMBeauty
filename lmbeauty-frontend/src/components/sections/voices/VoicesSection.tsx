"use client";

import React, {useCallback, useEffect, useState} from 'react';
import {Background, Column, Flex, Heading, Row, SmartLink, Text} from "@once-ui-system/core";
import styles from './VoicesSection.module.scss';
import {Voice, voices} from './data';
import {useScrollReveal} from '@/hooks';

interface GoogleReview {
    author_name: string;
    rating: number;
    text: string;
    time: number;
    relative_time_description: string;
    profile_photo_url?: string;
}

export const VoicesSection: React.FC = () => {
    const {ref: sectionRef, isVisible} = useScrollReveal({threshold: 0.1});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [displayVoices, setDisplayVoices] = useState<Voice[]>(voices);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const fetchGoogleReviews = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NEXT_PUBLIC_BACKEND_URL ? process.env.NEXT_PUBLIC_BACKEND_URL + '/api' : 'https://api.lmbeauty.de/api');
                const response = await fetch(`${apiUrl}/frontend/reviews`);
                const result = await response.json();

                if (result.success && result.data.reviews && result.data.reviews.length > 0) {
                    const googleVoices: Voice[] = result.data.reviews.map((review: GoogleReview, index: number) => ({
                        id: `google-${index}`,
                        quote: review.text,
                        name: review.author_name,
                        age: 0,
                        context: `${review.rating} ⭐ • ${review.relative_time_description}`,
                        timeframe: review.relative_time_description
                    }));

                    setDisplayVoices([...googleVoices, ...voices]);
                }
            } catch (error) {
                console.log('Using fallback testimonials:', error);
            }
        };

        fetchGoogleReviews();
    }, []);

    useEffect(() => {
        if (!isAutoPlaying || !isVisible) return;

        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % displayVoices.length);
                setIsTransitioning(false);
            }, 400);
        }, 7000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, isVisible, displayVoices.length]);

    const goToSlide = useCallback((index: number) => {
        if (index === currentIndex) return;
        setIsTransitioning(true);
        setIsAutoPlaying(false);
        setTimeout(() => {
            setCurrentIndex(index);
            setIsTransitioning(false);
            setTimeout(() => setIsAutoPlaying(true), 12000);
        }, 400);
    }, [currentIndex]);

    const currentVoice = displayVoices[currentIndex];

    return (
        <Column
            as="section"
            ref={sectionRef}
            id="testimonials"
            aria-label="Kundenstimmen"
            fillWidth
            paddingY="xl"
            paddingX="l"
            horizontal="center"
        >
            <Background
                position="absolute"
                fill
                gradient={{
                    display: true,
                    opacity: 100,
                    x: 50,
                    y: 100,
                    colorStart: "brand-background-strong",
                    colorEnd: "brand-background-weak"
                }}
                mask={{
                    x: 50,
                    y: 100,
                    radius: 100
                }}
                zIndex={0}
            />
            <Column fillWidth maxWidth={80} s={{maxWidth: 100}}>
                <Column gap="l" paddingTop="l" paddingBottom="m">
                    <Column gap="2" fitWidth horizontal="start">
                        <Heading
                            as="h3"
                            id="voices-headline"
                            variant="display-strong-xs"
                            onBackground="neutral-strong"
                        >
                            Was Kundinnen sagen
                        </Heading>
                        <Flex className={styles.headlineUnderline}/>
                    </Column>

                    <Column
                        fillWidth
                        center
                        className={`${styles.quoteContainer} ${isTransitioning ? styles.transitioning : ''}`}
                        key={currentVoice.id}
                    >
                        <Text
                            variant="heading-default-l"
                            className={styles.quote}
                        >
                            „{currentVoice.quote}"
                        </Text>

                        <Column gap="4" center className={styles.attribution}>
                            <Text variant="label-strong-m" className={styles.name}>
                                {currentVoice.age > 0
                                    ? `${currentVoice.name}, ${currentVoice.age}`
                                    : currentVoice.name}
                            </Text>
                            <Text variant="body-default-s" className={styles.context}>
                                {currentVoice.context}
                            </Text>
                        </Column>
                    </Column>

                    <Column gap="m" center>
                        <Row
                            gap="8"
                            horizontal="center"
                            className={styles.navigation}
                            marginBottom="m"
                        >
                            {displayVoices.map((_, index) => (
                                <Column
                                    key={index}
                                    className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
                                    onClick={() => goToSlide(index)}
                                    aria-label={`Stimme ${index + 1} von ${displayVoices.length}`}
                                    aria-current={index === currentIndex ? 'true' : 'false'}
                                    radius="full"
                                    border="transparent"
                                    cursor="pointer"
                                    background="brand-alpha-medium"
                                />
                            ))}
                        </Row>
                        <SmartLink
                            href="/wie-es-wirklich-ist"
                            className={styles.moreLink}
                        >
                            Mehr echte Erfahrungen lesen
                        </SmartLink>
                    </Column>
                </Column>
            </Column>
        </Column>
    );
};

export default VoicesSection;