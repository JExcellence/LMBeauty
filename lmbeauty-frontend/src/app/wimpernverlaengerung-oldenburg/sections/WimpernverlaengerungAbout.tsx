"use client";

import React from 'react';
import {Background, Card, Column, Flex, Heading, Line, Media, Row, Text} from '@once-ui-system/core';
import styles from './WimpernliftingAbout.module.scss';

export const WimpernverlaengerungAbout: React.FC = () => {
    return (
        <Flex
            as="section"
            id="about"
            fillWidth
            paddingY="xl"
            direction="column"
            horizontal="center"
        >
            <Column fillWidth maxWidth={80} paddingX="xl" gap="xl" s={{maxWidth: 100, paddingX: "l"}}>
                <Column gap="xs" center>
                    <Heading as="h2" variant="display-strong-xs" align="center">
                        Wimpernverlängerung <Text as="span" onBackground="brand-weak">in Oldenburg</Text>
                    </Heading>
                    <div className={styles.headlineUnderline}></div>
                </Column>

                <Flex
                    fillWidth
                    gap="xl"
                    direction="row"
                    horizontal="center"
                    vertical="start"
                    m={{direction: "column", gap: "l"}}
                >
                    <Column fillWidth maxWidth={40} gap="m">
                        <Column gap="m">
                            <Text
                                as="p"
                                variant="body-default-l"
                                onBackground="brand-medium"
                            >
                                Wimpernverlängerung ist mehr als nur längere Wimpern – es ist ein Gefühl. 
                                Das Gefühl, morgens aufzuwachen und schon perfekt auszusehen. Keine Mascara, 
                                kein Tuschen, kein Abschminken. Nur du und dein natürlicher Traumblick.
                            </Text>

                            <Text
                                as="p"
                                variant="body-default-l"
                                onBackground="brand-medium"
                            >
                                Bei LM Beauty in Oldenburg arbeite ich ausschließlich mit hochwertigen, 
                                hypoallergenen Produkten. Jede einzelne Wimper wird präzise auf deine 
                                Naturwimper aufgebracht – sanft, sicher und mit viel Liebe zum Detail.
                            </Text>

                            <Text
                                as="p"
                                variant="body-default-l"
                                onBackground="brand-medium"
                            >
                                Ob natürlich mit der <strong>Einzeltechnik (1:1)</strong>, ausdrucksstark 
                                mit <strong>Hybrid</strong> oder glamourös mit <strong>Volumen</strong> – 
                                ich finde den Look, der zu dir und deinem Alltag passt.
                            </Text>

                            <Text
                                as="p"
                                variant="body-default-l"
                                onBackground="brand-medium"
                            >
                                Die Wimpernverlängerung hält 4 bis 6 Wochen. Mit regelmäßigen Refills 
                                alle 3-4 Wochen bleiben deine Wimpern immer perfekt. Wasserfest, 
                                pflegeleicht und alltagstauglich.
                            </Text>
                        </Column>

                        <Column gap="s" paddingTop="m">
                            <Line background="brand-alpha-weak" fillWidth/>
                            <Row gap="m" vertical="center" horizontal="between" wrap>
                                <Column gap="2">
                                    <Text variant="heading-strong-m" onBackground="brand-strong">
                                        ab 89€
                                    </Text>
                                    <Text variant="label-default-s" onBackground="brand-weak">
                                        Einzeltechnik, Hybrid oder Volumen
                                    </Text>
                                </Column>
                                <Row gap="l">
                                    <Column gap="2" horizontal="center">
                                        <Text variant="heading-strong-s" onBackground="brand-strong">2-3</Text>
                                        <Text variant="label-default-xs" onBackground="brand-weak">Stunden</Text>
                                    </Column>
                                    <Column gap="2" horizontal="center">
                                        <Text variant="heading-strong-s" onBackground="brand-strong">4–6</Text>
                                        <Text variant="label-default-xs" onBackground="brand-weak">Wochen</Text>
                                    </Column>
                                </Row>
                            </Row>
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
                                src="/images/person/lisa_1.png"
                                alt="Lisa - Wimpernverlängerung Spezialistin bei LM Beauty Oldenburg"
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
            </Column>
        </Flex>
    );
};

export default WimpernverlaengerungAbout;
