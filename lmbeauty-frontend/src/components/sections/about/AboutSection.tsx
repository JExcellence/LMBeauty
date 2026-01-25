"use client";

import {
    AutoScroll,
    Background,
    Badge,
    Card,
    Column,
    Flex,
    Heading,
    Line,
    Media,
    RevealFx,
    Text
} from '@once-ui-system/core';
import {useScrollReveal} from '@/hooks';
import {aboutData} from './data';
import React from "react";
import styles from './AboutSection.module.scss';

const trustMarkers = [
    'Über 100 Kundinnen vertrauen mir',
    'Mehr als 5 Jahre Erfahrung',
    'Regelmäßige Weiterbildungen',
    'Hochwertige Produkte',
    'Individuelle Beratung'
];

export const AboutSection: React.FC = () => {
    const {ref: sectionRef, isVisible} = useScrollReveal({threshold: 0.1});

    return (
        <Flex
            as="section"
            ref={sectionRef}
            id="about"
            aria-labelledby="about-headline"
            fillWidth
            paddingY="xl"
            direction="column"
            horizontal="center"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
        >
            <Flex
                fillWidth
                maxWidth={80}
                padding="l"
                gap="xl"
                direction="row"
                horizontal="center"
                vertical="start"
                m={{direction: "column", gap: "l"}}
                s={{maxWidth: 100}}
            >
                {/* Content Column */}
                <Column fillWidth maxWidth={40} gap="m">
                    {/* Headline with Underline */}
                    <Column gap="l" horizontal="start" paddingBottom="m">
                        <Column gap="2" fitWidth>
                            <RevealFx delay={0.2} translateY={20}>
                                <Heading
                                    as="h2"
                                    id="about-headline"
                                    variant="display-strong-xs"
                                    onBackground="brand-strong"
                                >
                                    Über <Text as="span" onBackground="brand-weak">mich</Text>
                                </Heading>
                            </RevealFx>
                            <RevealFx delay={0.25} translateY={20}>
                                <Flex className={styles.headlineUnderline}/>
                            </RevealFx>
                        </Column>
                    </Column>

                    {/* Story */}
                    <Column gap="m">
                        <RevealFx delay={0.3} translateY={20}>
                            <Text
                                as="p"
                                variant="body-default-l"
                                onBackground="brand-medium"
                            >
                                Ich bin Lisa, und seit über fünf Jahren bin ich als Kosmetikerin in Oldenburg tätig,
                                seit 2023 leite ich LM Beauty wo Schönheit und Ruhe zusammenkommen.
                                Hier geht es nicht um Hektik oder Zeitdruck –
                                sondern um dich, deine Wünsche und das gute Gefühl danach.
                            </Text>
                        </RevealFx>

                        <RevealFx delay={0.35} translateY={20}>
                            <Text
                                as="p"
                                variant="body-default-l"
                                onBackground="brand-medium"
                            >
                                Jede Behandlung ist individuell. Ob Wimpernverlängerung oder Nageldesign –
                                ich nehme mir die Zeit, die es braucht, um ein Ergebnis zu schaffen,
                                das zu dir passt. Natürlich, elegant oder auffällig: Du entscheidest.
                            </Text>
                        </RevealFx>

                        <RevealFx delay={0.4} translateY={20}>
                            <Text
                                as="p"
                                variant="body-default-l"
                                onBackground="brand-medium"
                            >
                                Ich arbeite mit hochwertigen Produkten, bilde mich regelmäßig weiter und
                                liebe, was ich tue. Denn am Ende zählt nur eins: dass du dich wohlfühlst.
                            </Text>
                        </RevealFx>
                    </Column>

                    {/* Trust Markers */}
                    <Column fillWidth>
                        <AutoScroll speed="slow" paddingY="s">
                            {trustMarkers.map((marker, index) => (
                                <Badge
                                    background="brand-weak"
                                    key={index}
                                    paddingY="xs"
                                    paddingX="s"
                                    marginX="xs"
                                    radius="m"
                                    border="brand-alpha-weak"
                                >
                                    <Text
                                        variant="label-default-s"
                                        onBackground="brand-strong"
                                    >
                                        {marker}
                                    </Text>
                                </Badge>
                            ))}
                        </AutoScroll>
                    </Column>

                    {/* Signature */}
                    <Column gap="s" paddingTop="m">
                        <Line background="brand-alpha-weak" fillWidth/>
                        <Text
                            variant="body-default-m"
                            onBackground="brand-strong"
                            style={{
                                fontFamily: 'Merriweather, serif',
                                fontStyle: 'italic',
                                color: '#C4607A'
                            }}
                        >
                            — Lisa
                        </Text>
                    </Column>
                </Column>

                {/* Image Column */}
                <Column fillWidth maxWidth={30} s={{maxWidth: "70%"}} className={styles.imageColumn}>
                    <Card
                        fillWidth
                        radius="l-4"
                        border="neutral-alpha-medium"
                        padding="0"
                        overflow="hidden"
                        background="transparent"
                        style={{
                            boxShadow: '0 4px 24px rgba(196, 96, 122, 0.12)'
                        }}
                    >
                        <Media
                            src={aboutData.image.src}
                            alt={aboutData.image.alt}
                            aspectRatio="3/4"
                            fillWidth
                            radius="l-4"
                            sizes="(max-width: 768px) 100vw, 400px"
                            objectFit="cover"
                        />

                        {/* Overlay gradient */}
                        <Background
                            position="absolute"
                            fill
                            gradient={{
                                display: true,
                                opacity: 30,
                                x: 50,
                                y: 100,
                                colorStart: "static-transparent",
                                colorEnd: "brand-solid-strong"
                            }}
                            style={{pointerEvents: 'none'}}
                        />
                    </Card>
                </Column>
            </Flex>
        </Flex>
    );
};

export default AboutSection;
