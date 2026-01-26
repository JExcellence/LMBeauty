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
    Text
} from '@once-ui-system/core';
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
    return (
        <Flex
            as="section"
            id="about"
            aria-labelledby="about-headline"
            fillWidth
            paddingY="xl"
            direction="column"
            horizontal="center"
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
                <Column fillWidth maxWidth={40} gap="m">
                    <Column gap="l" horizontal="start" paddingBottom="m">
                        <Column gap="2" fitWidth>
                            <Column>
                                <Heading
                                    as="h2"
                                    id="about-headline"
                                    variant="display-strong-xs"
                                    onBackground="brand-strong"
                                >
                                    Über <Text as="span" onBackground="brand-weak">mich</Text>
                                </Heading>
                            </Column>
                            <Column>
                                <Flex className={styles.headlineUnderline}/>
                            </Column>
                        </Column>
                    </Column>

                    <Column gap="m">
                        <Column>
                            <Text
                                as="p"
                                variant="body-default-l"
                                onBackground="brand-medium"
                            >
                                Ich bin Lisa, und seit über fünf Jahren bin ich als Kosmetikerin in Oldenburg tätig.
                                Seit 2023 leite ich <strong>LM Beauty</strong> – dein Studio für <strong>Wimpernverlängerung</strong> und <strong>Wimpernlifting in Oldenburg</strong>.
                            </Text>
                        </Column>

                        <Column>
                            <Text
                                as="p"
                                variant="body-default-l"
                                onBackground="brand-medium"
                            >
                                Hier geht es nicht um Hektik oder Zeitdruck, sondern um dich, deine Wünsche und das gute Gefühl danach.
                                Ob natürlich mit der Einzeltechnik, voluminös mit der Volumen-Technik oder der perfekte Mix mit Hybrid – 
                                ich finde den Look, der zu dir passt.
                            </Text>
                        </Column>

                        <Column>
                            <Text
                                as="p"
                                variant="body-default-l"
                                onBackground="brand-medium"
                            >
                                Mein <strong>Wimpernstudio in Oldenburg</strong> in der Bloherfelderstraße 40 ist dein Ort für entspannte Beauty-Treatments.
                                Mit hochwertigen Produkten, hygienischen Standards und viel Liebe zum Detail sorge ich dafür, 
                                dass du dich rundum wohlfühlst.
                            </Text>
                        </Column>

                        <Column>
                            <Text
                                as="p"
                                variant="body-default-l"
                                onBackground="brand-medium"
                            >
                                <strong>Wimpernlifting</strong> ist die perfekte Alternative zur Verlängerung – 
                                deine eigenen Wimpern werden geschwungen, gefärbt und sehen sofort länger aus. 
                                Kein Kleben, kein Auffüllen, nur natürliche Schönheit.
                            </Text>
                        </Column>
                    </Column>

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
                            suppressHydrationWarning
                        />
                    </Card>
                </Column>
            </Flex>
        </Flex>
    );
};

export default AboutSection;
