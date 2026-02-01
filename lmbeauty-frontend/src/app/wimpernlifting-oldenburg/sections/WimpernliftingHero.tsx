"use client";

import React from 'react';
import { Background, Badge, Column, Fade, Flex, Heading, Button, Row, Text, Pulse } from "@once-ui-system/core";
import styles from './WimpernliftingHero.module.scss';

export function WimpernliftingHero() {
    return (
        <Flex
            zIndex={1}
            fillWidth
            direction="column"
            horizontal="center"
            vertical="center"
            aria-label="Wimpernlifting Oldenburg"
            role="banner"
            style={{
                minHeight: "100vh",
            }}
        >
            <Column
                position="absolute"
                fill
                zIndex={0}
                style={{
                    minHeight: "100vh",
                    overflow: "hidden"
                }}
                background="surface"
                opacity={20}
            >
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    style={{
                        minHeight: "100vh",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        position: "absolute",
                        top: 0,
                        left: 0
                    }}
                >
                    <source src="/videos/lmbeauty_store.mp4" type="video/mp4" />
                </video>
            </Column>

            <Background
                position="absolute"
                fill
                gradient={{
                    display: true,
                    opacity: 90,
                    x: 50,
                    y: 50,
                    colorStart: "brand-background-weak",
                    colorEnd: "accent-background-weak"
                }}
                mask={{
                    x: 75,
                    y: 50,
                    radius: 140
                }}
                zIndex={1}
                suppressHydrationWarning
            />

            <Fade
                fillWidth
                position="absolute"
                top="0"
                to="bottom"
                height={12}
                style={{zIndex: 2}}
            />

            <Column
                fillWidth
                maxWidth={48}
                gap="xl"
                paddingX="l"
                horizontal="center"
                l={{maxWidth: 48, paddingX: "l", horizontal: "start"}}
                m={{maxWidth: 100, paddingX: "m", horizontal: "center"}}
                s={{maxWidth: 100, paddingX: "s", horizontal: "center"}}
                style={{zIndex: 3}}
            >
                <Column
                    fillWidth
                    role="region"
                    aria-labelledby="hero-headline"
                    horizontal="start"
                    m={{horizontal: "center"}}
                >
                    <Row fillWidth horizontal="start" m={{horizontal: "center"}} s={{horizontal: "center"}}>
                        <Badge arrow gap="xs" background="surface">
                            <Pulse/>
                            <Text as="span" variant="heading-default-xl" onBackground="brand-weak">
                                Wimpernlifting Oldenburg
                            </Text>
                        </Badge>
                    </Row>

                    <Column fillWidth marginTop="m" horizontal="start" m={{horizontal: "center"}}>
                        <Heading as="h1" id="hero-headline" onBackground="info-strong" className={styles.headline}>
                            Dein wacher Blick <Text className={styles.accentWord}>ganz ohne Mascara</Text>
                        </Heading>
                    </Column>

                    <Column fillWidth paddingY="s" horizontal="start" maxWidth="xs"
                            m={{horizontal: "center", align: "center"}}>
                        <Text as="p" onBackground="info-strong" wrap="balance" align="inherit"
                              className={styles.heroDescription}>
                            Natürliche Länge, perfekter Schwung und Keratin-Pflege für 6-8 Wochen. 
                            Wachst du morgens auf und siehst sofort frisch aus? Mit unserem professionellen 
                            Wimpernlifting wird dieser Traum Realität.
                        </Text>
                    </Column>

                    <Row
                        fillWidth
                        gap="m"
                        horizontal="start"
                        vertical="center"
                        marginBottom="m"
                        m={{horizontal: "center", gap: "s"}}
                        s={{horizontal: "center", gap: "s"}}
                    >
                        <a
                            href="/#contact"
                            className={styles.primaryButton}
                            aria-label="Jetzt Termin buchen"
                        >
                            Jetzt für 49€ buchen
                        </a>
                        <a
                            href="#gallery"
                            className={styles.secondaryButton}
                            aria-label="Ergebnisse ansehen"
                        >
                            Ergebnisse ansehen →
                        </a>
                    </Row>
                    <Row
                        fillWidth
                        horizontal="start"
                        m={{horizontal: "center"}}
                        s={{horizontal: "center"}}
                    >
                        <a
                            href="/"
                            className={styles.tertiaryButton}
                            aria-label="Zur Startseite"
                        >
                            ← Zur Startseite
                        </a>
                    </Row>
                </Column>
            </Column>
        </Flex>
    );
}

export default WimpernliftingHero;
