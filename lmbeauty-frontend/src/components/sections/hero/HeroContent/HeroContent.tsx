"use client";

import React from 'react';
import styles from './HeroContent.module.scss';
import {Badge, Button, Column, Heading, IconButton, Pulse, Row, Text} from "@once-ui-system/core";

export const HeroContent: React.FC = () => {
    return (
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
                    <Text as="span" variant="heading-default-xl" onBackground="brand-weak">Wimpern, die
                        begeistern</Text>
                </Badge>
            </Row>

            <Column fillWidth marginTop="m" horizontal="start"
                    m={{horizontal: "center"}}>
                <Heading as="h1" id="hero-headline" onBackground="info-strong" className={styles.headline}>
                    Dein <Text className={styles.accentWord}>Traumblick</Text> wartet auf dich.
                </Heading>
            </Column>

            <Column fillWidth paddingY="s" horizontal="start" maxWidth="xs"
                    m={{horizontal: "center", align: "center"}}>
                <Text as="p" onBackground="info-strong" wrap="balance" align="inherit"
                      className={styles.heroDescription}>
                    Wimpernverlängerung, die zu dir passt – natürlich, glamourös oder irgendwo dazwischen.
                    Entspann dich, ich mach den Rest.
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
                <Column m={{fillWidth: true}} s={{fillWidth: true}}>
                    <Button
                        href="#contact"
                        variant="primary"
                        size="m"
                        aria-label="Jetzt Termin buchen"
                        fillWidth
                    >
                        Jetzt Termin sichern
                    </Button>
                </Column>
                <Column m={{fillWidth: true}} s={{fillWidth: true}}>
                    <Button
                        href=""
                        variant="tertiary"
                        size="m"
                        aria-label="Vorher-Nachher Ergebnisse ansehen"
                        fillWidth
                    >
                        Bald verfügbar →
                    </Button>
                </Column>
            </Row>

            <Row
                fillWidth
                gap="s"
                horizontal="start"
                vertical="center"
                m={{horizontal: "center", gap: "s"}}
                s={{horizontal: "center", gap: "s"}}
            >
                <Button
                    href="https://g.page/r/CTi0opc7g1QzEBM/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.googleRating}
                    aria-label="Google Bewertungen ansehen"
                >
                    <Row fill gap="m" vertical="center">
                        <svg className={styles.googleIcon} viewBox="0 0 24 24" aria-hidden="true">
                            <path fill="#4285F4"
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853"
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05"
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335"
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <Column fitWidth>
                            <Column fitWidth>
                                <Row gap="2" role="img" aria-label="5 von 5 Sternen">
                                    {[...Array(5)].map((_, i) => (
                                        <Text as="p" variant="label-default-m" key={i} onBackground="warning-weak"
                                              aria-hidden="true">★</Text>
                                    ))}
                                </Row>
                            </Column>
                            <Text as="p" variant="label-default-xs">5.0 auf Google</Text>
                        </Column>
                    </Row>
                </Button>

                <Row gap="s">
                    <IconButton
                        icon="instagram"
                        href="https://www.instagram.com/_l.m_beauty_/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Folge uns auf Instagram"
                        size="m"
                        variant="secondary"
                    />
                    <IconButton
                        icon="whatsapp"
                        href="https://wa.me/+4915259675346"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Kontaktiere uns über WhatsApp"
                        size="m"
                        variant="secondary"
                    />
                </Row>
            </Row>
        </Column>
    );
};

export default HeroContent;
