"use client";

import React from 'react';
import {Background, Card, Column, Flex, Heading, Line, Media, Row, Text} from '@once-ui-system/core';
import styles from './WimpernliftingAbout.module.scss';
import {aboutData} from "@/components/sections";

export const WimpernliftingAbout: React.FC = () => {
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
                {/* Heading - always first */}
                <Column gap="xs" center>
                    <Heading as="h2" variant="display-strong-xs" align="center">
                        Wimpernlifting <Text as="span" onBackground="brand-weak">in Oldenburg</Text>
                    </Heading>
                    <div className={styles.headlineUnderline}></div>
                </Column>

                {/* Content and Image Row */}
                <Flex
                    fillWidth
                    gap="xl"
                    direction="row"
                    horizontal="center"
                    vertical="center"
                    m={{direction: "column", gap: "xl"}}
                >
                    <Column fillWidth maxWidth={40} gap="m">
                        <Column gap="m">
                            <Text
                                as="p"
                                variant="body-default-l"
                                onBackground="brand-medium"
                            >
                                Ein Wimpernlifting ist wie eine Dauerwelle für deine Wimpern – es bringt sie
                                dauerhaft in Form, ohne dass du täglich zur Zange greifen musst.
                            </Text>

                            <Text
                                as="p"
                                variant="body-default-l"
                                onBackground="brand-medium"
                            >
                                Stell dir vor, du wachst auf und siehst sofort frisch aus. Keine Wimpernzange,
                                kein Mascara, keine Mühe. Nur deine eigenen Wimpern – sanft geschwungen,
                                optisch länger, natürlich schön.
                            </Text>

                            <Text
                                as="p"
                                variant="body-default-l"
                                onBackground="brand-medium"
                            >
                                Ich bin Lisa, deine Wimpern-Spezialistin in Oldenburg. Seit Jahren arbeite ich
                                ausschließlich mit hochwertigen Produkten und lege größten Wert auf hygienische
                                Standards. Jede Behandlung ist für mich eine kleine Kunst – sanft, präzise,
                                mit Liebe zum Detail.
                            </Text>

                            <Text
                                as="p"
                                variant="body-default-l"
                                onBackground="brand-medium"
                            >
                                Das Wimpernlifting hält 6 bis 8 Wochen. Es ist wasserfest, pflegeleicht
                                und perfekt für den Alltag. Du sparst morgens Zeit und fühlst dich den ganzen
                                Tag über selbstbewusst und schön.
                            </Text>
                        </Column>

                        <Column gap="s" paddingTop="m">
                            <Line background="brand-alpha-weak" fillWidth/>
                            <Row gap="m" vertical="center" horizontal="between">
                                <Column gap="2">
                                    <Text variant="heading-strong-m" onBackground="brand-strong">
                                        49€
                                    </Text>
                                    <Text variant="label-default-s" onBackground="brand-weak">
                                        Färbung & Keratin inklusive
                                    </Text>
                                </Column>
                                <Row gap="l">
                                    <Column gap="2" horizontal="center">
                                        <Text variant="heading-strong-s" onBackground="brand-strong">60</Text>
                                        <Text variant="label-default-xs" onBackground="brand-weak">Minuten</Text>
                                    </Column>
                                    <Column gap="2" horizontal="center">
                                        <Text variant="heading-strong-s" onBackground="brand-strong">6–8</Text>
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
            </Column>
        </Flex>
    );
};

export default WimpernliftingAbout;
