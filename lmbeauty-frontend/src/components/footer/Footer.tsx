"use client";

import React from 'react';
import {
    Background,
    Column,
    Flex,
    Heading,
    Icon,
    IconButton,
    Line,
    Logo,
    Row,
    SmartLink,
    Text,
} from "@once-ui-system/core";
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Flex
            as="footer"
            fillWidth
            paddingY="xl"
            paddingX="l"
            direction="column"
            center
        >
            <Background
                position="absolute"
                fill
                gradient={{
                    display: true,
                    opacity: 100,
                    x: 50,
                    y: 0,
                    colorStart: "brand-background-strong",
                    colorEnd: "brand-background-weak"
                }}
                mask={{
                    x: 50,
                    y: 0,
                    radius: 100
                }}
                zIndex={0}
            />

            <Column fillWidth maxWidth={80} gap="xl" s={{maxWidth: 100}}>
                <Flex
                    fillWidth
                    gap="xl"
                    direction="row"
                    horizontal="start"
                    vertical="start"
                    m={{direction: "column", gap: "l"}}
                >
                    <Column gap="m" flex={1} maxWidth={32} m={{maxWidth: 100}}>
                        <Column>
                            <Logo
                                href="/"
                                wordmark=""
                                size="m"
                            />
                        </Column>

                        <Column>
                            <Text
                                variant="body-default-s"
                                onBackground="brand-medium"
                            >
                                Dein Studio für Wimpernstyling & Nageldesign in Oldenburg.
                                Natürliche Schönheit, professionell betont.
                            </Text>
                        </Column>

                        <Column>
                            <Row gap="s">
                                <IconButton
                                    href="https://www.instagram.com/_l.m_beauty_/"
                                    variant="secondary"
                                    size="m"
                                    icon="instagram"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className={styles.socialButton}
                                />
                                <IconButton
                                    href="https://wa.me/+4915259675346"
                                    variant="secondary"
                                    size="m"
                                    icon="whatsapp"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="WhatsApp"
                                    className={styles.socialButton}
                                />
                            </Row>
                        </Column>
                    </Column>

                    {/* Links Grid */}
                    <Flex
                        fillWidth
                        flex={2}
                        gap="xl"
                        direction="row"
                        horizontal="start"
                        m={{direction: "column", gap: "l"}}
                        s={{direction: "column", gap: "l"}}
                    >
                        {/* Services Column */}
                        <Column gap="m" flex={1}>
                            <Column>
                                <Heading
                                    as="h3"
                                    variant="heading-strong-xs"
                                    onBackground="brand-strong"
                                    marginBottom="xs"
                                >
                                    Leistungen
                                </Heading>
                            </Column>
                            <Column gap="xs">
                                <Column>
                                    <SmartLink href="/wimpernverlaengerung-oldenburg" className={styles.link}>
                                        <Text variant="body-default-s" onBackground="brand-medium">
                                            Wimpernverlängerung
                                        </Text>
                                    </SmartLink>
                                </Column>
                                <Column>
                                    <SmartLink href="/wimpernlifting-oldenburg" className={styles.link}>
                                        <Text variant="body-default-s" onBackground="brand-medium">
                                            Wimpernlifting
                                        </Text>
                                    </SmartLink>
                                </Column>
                                <Column>
                                    <SmartLink href="/#services" className={styles.link}>
                                        <Text variant="body-default-s" onBackground="brand-medium">
                                            Alle Services
                                        </Text>
                                    </SmartLink>
                                </Column>
                                <Column>
                                    <SmartLink href="/faq" className={styles.link}>
                                        <Text variant="body-default-s" onBackground="brand-medium">
                                            Häufige Fragen
                                        </Text>
                                    </SmartLink>
                                </Column>
                            </Column>
                        </Column>

                        {/* Company Column */}
                        <Column gap="m" flex={1}>
                            <Column>
                                <Heading
                                    as="h3"
                                    variant="heading-strong-xs"
                                    onBackground="brand-strong"
                                    marginBottom="xs"
                                >
                                    Unternehmen
                                </Heading>
                            </Column>
                            <Column gap="xs">
                                <Column>
                                    <SmartLink href="/ueber-lm-beauty" className={styles.link}>
                                        <Text variant="body-default-s" onBackground="brand-medium">
                                            Über mich
                                        </Text>
                                    </SmartLink>
                                </Column>
                                <Column>
                                    <SmartLink href="/#standards" className={styles.link}>
                                        <Text variant="body-default-s" onBackground="brand-medium">
                                            Qualität & Hygiene
                                        </Text>
                                    </SmartLink>
                                </Column>
                                <Column>
                                    <SmartLink href="/#contact" className={styles.link}>
                                        <Text variant="body-default-s" onBackground="brand-medium">
                                            Termin buchen
                                        </Text>
                                    </SmartLink>
                                </Column>
                                <Column>
                                    <SmartLink href="/faq" className={styles.link}>
                                        <Text variant="body-default-s" onBackground="brand-medium">
                                            FAQ
                                        </Text>
                                    </SmartLink>
                                </Column>
                            </Column>
                        </Column>

                        {/* Contact Column */}
                        <Column gap="m" flex={1}>
                            <Column>
                                <Heading
                                    as="h3"
                                    variant="heading-strong-xs"
                                    onBackground="brand-strong"
                                    marginBottom="xs"
                                >
                                    Kontakt
                                </Heading>
                            </Column>
                            <Column gap="xs">
                                <Column>
                                    <SmartLink
                                        href="tel:+4915259675346"
                                        className={styles.contactLink}
                                    >
                                        <Icon name="phone" size="xs" onBackground="brand-strong"/>
                                        <Text variant="body-default-s" onBackground="brand-medium">
                                            01525 9675346
                                        </Text>
                                    </SmartLink>
                                </Column>
                                <Column>
                                    <SmartLink
                                        href="mailto:lisa.pinske@lmbeauty.de"
                                        className={styles.contactLink}
                                    >
                                        <Icon name="email" size="xs" onBackground="brand-strong"/>
                                        <Text variant="body-default-s" onBackground="brand-medium">
                                            lisa.pinske@lmbeauty.de
                                        </Text>
                                    </SmartLink>
                                </Column>
                                <Column>
                                    <Flex gap="xs" vertical="center" className={styles.contactLink}>
                                        <Icon name="mapPin" size="xs" onBackground="brand-strong"/>
                                        <Text variant="body-default-s" onBackground="brand-medium">
                                            Oldenburg
                                        </Text>
                                    </Flex>
                                </Column>
                                <Column>
                                    <Flex gap="xs" vertical="center" className={styles.contactLink}>
                                        <Icon name="clock" size="xs" onBackground="brand-strong"/>
                                        <Text variant="body-default-s" onBackground="brand-medium">
                                            Nach Vereinbarung
                                        </Text>
                                    </Flex>
                                </Column>
                            </Column>
                        </Column>
                    </Flex>
                </Flex>

                {/* Divider */}
                <Column>
                    <Line style={{
                        background: "var(--brand-alpha-medium)"
                    }}/>
                </Column>

                {/* Bottom Bar */}
                <Column>
                    <Flex
                        fillWidth
                        horizontal="between"
                        vertical="center"
                        gap="m"
                        wrap
                        className={styles.bottomBar}
                        m={{direction: "column", horizontal: "center", gap: "s"}}
                    >
                        <Text variant="body-default-xs" onBackground="brand-medium">
                            © 2023 - {currentYear} LM Beauty. Alle Rechte vorbehalten.
                        </Text>

                        <Row gap="m" className={styles.legalLinks}>
                            <SmartLink href="/impressum" className={styles.legalLink}>
                                <Text variant="body-default-xs" onBackground="brand-medium">
                                    Impressum
                                </Text>
                            </SmartLink>
                            <SmartLink href="/datenschutz" className={styles.legalLink}>
                                <Text variant="body-default-xs" onBackground="brand-medium">
                                    Datenschutz
                                </Text>
                            </SmartLink>
                            <SmartLink href="/agb" className={styles.legalLink}>
                                <Text variant="body-default-xs" onBackground="brand-medium">
                                    AGB
                                </Text>
                            </SmartLink>
                        </Row>

                        <Text variant="body-default-xs" onBackground="brand-medium">
                            Entwickelt von{' '}
                            <SmartLink
                                href="https://www.jexcellence.de"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.developerLink}
                            >
                                JExcellence
                            </SmartLink>
                        </Text>
                    </Flex>
                </Column>
            </Column>
        </Flex>
    );
};

export {Footer};
export default Footer;
