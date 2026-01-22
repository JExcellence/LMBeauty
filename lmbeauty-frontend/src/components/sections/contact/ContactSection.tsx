"use client";

import React from 'react';
import {Flex, Column, Text, Heading, Icon, Button, Background, SmartLink, RevealFx, Line} from '@once-ui-system/core';
import styles from './ContactSection.module.scss';
import { useScrollReveal } from '@/hooks';

const contactOptions = [
    {
        icon: "whatsapp" as const,
        title: "WhatsApp",
        value: "Direkt schreiben",
        href: "https://wa.me/+4915259675346",
        external: true,
    },
    {
        icon: "phone" as const,
        title: "Telefon",
        value: "01525 9675346",
        href: "tel:+4915259675346",
        external: false,
    },
    {
        icon: "email" as const,
        title: "E-Mail",
        value: "info@lmbeauty.de",
        href: "mailto:info@lmbeauty.de",
        external: false,
    },
    {
        icon: "instagram" as const,
        title: "Instagram",
        value: "@lm.beauty",
        href: "https://instagram.com/_l.m_beauty_",
        external: true,
    },
];

export const ContactSection: React.FC = () => {
    const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.1 });

    return (
        <Flex
            as="section"
            ref={sectionRef}
            id="contact"
            aria-labelledby="contact-headline"
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

            <Column fillWidth maxWidth={80} s={{ maxWidth: 100 }}>
                <Flex
                    fillWidth
                    gap="xl"
                    direction="row"
                    center
                    m={{ direction: "column", gap: "l" }}
                >
                    <Column fillWidth maxWidth={48} m={{ maxWidth: 100 }}>
                        <Column gap="l" horizontal="start" paddingTop="l" paddingBottom="m">
                            <Column gap="2" fitWidth>
                                <RevealFx delay={0.2} translateY={20}>
                                    <Heading
                                        as="h2"
                                        id="contact-headline"
                                        variant="display-strong-xs"
                                        onBackground="brand-strong"
                                    >
                                        Ich freue mich auf <Text as="span" onBackground="brand-weak">dich</Text>
                                    </Heading>
                                </RevealFx>
                                <RevealFx delay={0.25} translateY={20}>
                                    <Flex className={styles.headlineUnderline} />
                                </RevealFx>
                            </Column>
                        </Column>

                        <RevealFx delay={0.3} translateY={20}>
                            <Text variant="body-default-l" onBackground="brand-medium" marginBottom="l">
                                Ob Fragen, Terminwünsche oder einfach nur Hallo sagen — ich bin für dich da.
                            </Text>
                        </RevealFx>

                        <Column gap="0" marginBottom="m" fillWidth>
                            {contactOptions.map((option, index) => (
                                <React.Fragment key={option.title}>
                                    <RevealFx delay={0.4 + (index * 0.08)} translateY={20}>
                                        <Flex className={styles.contactItem} fillWidth>
                                            <SmartLink
                                                fillWidth
                                                href={option.href}
                                                target={option.external ? '_blank' : undefined}
                                                rel={option.external ? 'noopener noreferrer' : undefined}
                                                className={styles.contactLink}
                                            >
                                                <Flex
                                                    fillWidth
                                                    gap="m"
                                                    paddingY="m"
                                                    horizontal="start"
                                                    vertical="center"
                                                >
                                                    <Flex
                                                        className={styles.contactIcon}
                                                        horizontal="center"
                                                        vertical="center"
                                                        radius="m"
                                                        background="brand-alpha-weak"
                                                        height="48"
                                                        width="48"
                                                    >
                                                        <Icon name={option.icon} size="m" onBackground="brand-strong" />
                                                    </Flex>

                                                    <Column gap="2" flex={1}>
                                                        <Text variant="body-strong-m" onBackground="brand-strong">
                                                            {option.title}
                                                        </Text>
                                                        <Text variant="body-default-s" onBackground="brand-medium">
                                                            {option.value}
                                                        </Text>
                                                    </Column>

                                                    <Text className={styles.contactArrow}>→</Text>
                                                </Flex>
                                            </SmartLink>
                                        </Flex>
                                    </RevealFx>
                                    {index < contactOptions.length - 1 && (
                                        <Line background="brand-alpha-weak" fillWidth />
                                    )}
                                </React.Fragment>
                            ))}
                        </Column>

                        <RevealFx delay={0.75} translateY={20}>
                            <Text variant="body-default-s" onBackground="brand-medium" style={{ fontStyle: 'italic' }}>
                                Antwort innerhalb von 24 Stunden.
                            </Text>
                        </RevealFx>
                    </Column>

                    <Column fillWidth maxWidth={48} horizontal="center" m={{ maxWidth: 100 }}>
                        <RevealFx delay={0.5} translateY={20}>
                            <Column className={styles.mapCard} radius="l" fillWidth border="brand-alpha-medium" background="surface">
                                <Flex
                                    gap="m"
                                    paddingX="l"
                                    paddingY="l"
                                    horizontal="start"
                                    vertical="center"
                                    className={styles.mapHeader}
                                >
                                    <Icon name="mapPin" padding="xs" background="brand-alpha-weak" onBackground="brand-strong" radius="l" size="s" />
                                    <Column gap="2">
                                        <Heading variant="heading-strong-xs" onBackground="brand-strong">
                                            Studio
                                        </Heading>
                                        <Text variant="body-default-xs" onBackground="brand-medium">
                                            Bloherfelder Str. 40, 26129 Oldenburg
                                        </Text>
                                    </Column>
                                </Flex>

                                <Column center className={styles.mapWrapper}>
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2397.5!2d8.2167!3d53.1489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b6de6a8b8b8b8b%3A0x1234567890abcdef!2sBloherfelder%20Str.%2040%2C%2026129%20Oldenburg!5e0!3m2!1sde!2sde!4v1703000000000!5m2!1sde!2sde"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="LM Beauty Studio Standort"
                                    />
                                </Column>

                                <Button
                                    href="https://www.google.com/maps/dir//Bloherfelder+Str.+40,+26129+Oldenburg"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="tertiary"
                                    fillWidth
                                    className={styles.mapButton}
                                >
                                    <Text variant="label-strong-s" onBackground="brand-strong">Route planen</Text>
                                </Button>
                            </Column>
                        </RevealFx>
                    </Column>
                </Flex>
            </Column>
        </Flex>
    );
};

export default ContactSection;
