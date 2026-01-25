"use client";

import React from 'react';
import {Background, Column, Flex, Heading, Icon, RevealFx, SmartLink, Text} from '@once-ui-system/core';
import styles from './StandardsSection.module.scss';
import {useScrollReveal} from '@/hooks';

const standards = [
    {
        title: 'Zertifizierte Premium-Produkte',
        description: 'Ausschließlich hochwertige, dermatologisch getestete Materialien von führenden Herstellern wie NovaLash und Sugarlash PRO.',
    },
    {
        title: 'Sterile Arbeitsumgebung',
        description: 'Jedes Werkzeug wird vor jeder Behandlung im Autoklav sterilisiert. Einwegpinzetten und -materialien wo erforderlich.',
    },
    {
        title: 'Regelmäßige Fortbildungen',
        description: 'Kontinuierliche Weiterbildung bei zertifizierten Akademien für die neuesten Techniken und Sicherheitsstandards.',
    },
    {
        title: 'Allergietest vor Erstbehandlung',
        description: 'Auf Wunsch führe ich einen Patch-Test durch, um allergische Reaktionen auszuschließen.',
    },
    {
        title: 'Dokumentierte Hygieneprotokolle',
        description: 'Alle Hygienemaßnahmen werden nach aktuellen Gesundheitsrichtlinien dokumentiert und regelmäßig überprüft.',
    },
];

const certifications = [
    {
        title: 'Staatlich anerkannte Kosmetikerin',
        icon: 'shield' as const,
        available: false,
    },
    {
        title: 'Zertifizierte Lash Stylistin',
        icon: 'shield' as const,
        available: false,
    },
    {
        title: 'Hygieneschulung nach IfSG',
        icon: 'shield' as const,
        available: false,
    },
];

export const StandardsSection: React.FC = () => {
    const {ref: sectionRef, isVisible} = useScrollReveal({threshold: 0.1});

    return (
        <Column
            as="section"
            ref={sectionRef}
            id="standards"
            aria-labelledby="standards-headline"
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
                    y: 50,
                    colorStart: "brand-background-strong",
                    colorEnd: "brand-background-weak"
                }}
                mask={{
                    x: 50,
                    y: 50,
                    radius: 50
                }}
                zIndex={0}
            />

            <Column fillWidth maxWidth={80} s={{maxWidth: 100}}>
                <Flex
                    fillWidth
                    gap="l"
                    direction="row"
                    horizontal="start"
                    vertical="start"
                    m={{direction: "column"}}
                >
                    <Column fillWidth gap="m">
                        <Column gap="l" horizontal="start">
                            <Column gap="2" fitWidth>
                                <RevealFx delay={0.2} translateY={20}>
                                    <Heading
                                        as="h2"
                                        id="standards-headline"
                                        variant="display-strong-xs"
                                        onBackground="brand-strong"
                                    >
                                        Qualität & <Text as="span" onBackground="brand-weak">Hygiene</Text>
                                    </Heading>
                                </RevealFx>
                                <RevealFx delay={0.25} translateY={20}>
                                    <Flex className={styles.headlineUnderline}/>
                                </RevealFx>
                            </Column>
                        </Column>

                        <RevealFx delay={0.3} translateY={20}>
                            <Text variant="body-default-m" onBackground="brand-medium">
                                Weil deine Augen mir wichtig sind — hier erfährst du, wie ich dich schütze.
                            </Text>
                        </RevealFx>

                        <Column gap="l" paddingTop="m" maxWidth={30} fillWidth>
                            {standards.map((item, index) => (
                                <RevealFx
                                    key={item.title}
                                    delay={0.4 + (index * 0.08)}
                                    className={styles.standardItem}
                                    translateY={20}
                                    direction="column"
                                >
                                    <Flex
                                        gap="m"
                                        horizontal="start"
                                        vertical="center"
                                    >
                                        <Icon
                                            name="check"
                                            size="xl"
                                            onBackground="brand-weak"

                                        />
                                        <Column gap="xs">
                                            <Heading as="h3" onBackground="brand-weak">
                                                {item.title}
                                            </Heading>
                                            <Text variant="body-default-s" onBackground="brand-medium">
                                                {item.description}
                                            </Text>
                                        </Column>
                                    </Flex>
                                </RevealFx>
                            ))}
                        </Column>
                    </Column>

                    <Column fillWidth gap="m" paddingTop="160" m={{maxWidth: 100}}>
                        <RevealFx delay={0.5} translateY={20}>
                            <Column
                                gap="m"
                                padding="m"
                                radius="l"
                                border="brand-alpha-medium"
                                background="surface"
                                fillWidth
                                maxWidth={80}
                                className={styles.certificationsCard}
                            >
                                <Heading as="h3" variant="heading-strong-m" onBackground="brand-strong"
                                         marginBottom="xs">
                                    Meine Qualifikationen
                                </Heading>
                                <Column gap="s">
                                    {certifications.map((cert, index) => (
                                        <Column
                                            key={cert.title}
                                            className={styles.certItem}
                                            padding="m"
                                            radius="l"
                                            border="brand-alpha-weak"
                                            background="brand-alpha-weak"
                                        >
                                            <Flex gap="m" horizontal="start" vertical="center">
                                                <Flex
                                                    className={styles.certIcon}
                                                    horizontal="center"
                                                    vertical="center"
                                                    radius="m"
                                                    background="brand-strong"
                                                    minWidth="40"
                                                    minHeight="40"
                                                >
                                                    <Icon name={cert.icon} size="s" style={{color: 'white'}}/>
                                                </Flex>
                                                <Column gap="2" flex={1}>
                                                    <Text variant="body-strong-s" onBackground="brand-strong">
                                                        {cert.title}
                                                    </Text>
                                                    {!cert.available && (
                                                        <Text variant="body-default-xs" onBackground="brand-medium"
                                                              style={{fontStyle: 'italic'}}>
                                                            Bald zum Ansehen verfügbar
                                                        </Text>
                                                    )}
                                                </Column>
                                                {cert.available && (
                                                    <Icon name="chevronRight" size="xs" onBackground="brand-medium"/>
                                                )}
                                            </Flex>
                                        </Column>
                                    ))}
                                </Column>
                            </Column>
                        </RevealFx>

                        <RevealFx delay={0.6} translateY={20}>
                            <Column
                                gap="m"
                                padding="l"
                                radius="l"
                                border="brand-alpha-medium"
                                background="surface"
                                horizontal="center"
                                fillWidth
                                className={styles.downloadCard}
                            >
                                <Icon name="shield" size="l" onBackground="brand-strong" background="brand-alpha-weak"
                                      padding="xs" radius="l"/>
                                <Column gap="xs" horizontal="center">
                                    <Heading as="h3" variant="heading-strong-s" onBackground="brand-strong"
                                             align="center">
                                        Hygienekonzept
                                    </Heading>
                                    <Text variant="body-default-s" onBackground="brand-medium" align="center">
                                        Lade dir mein vollständiges Hygienekonzept als PDF herunter.
                                    </Text>
                                </Column>
                                <SmartLink
                                    //href="/documents/hygienekonzept.pdf"
                                    className={styles.downloadButton}
                                >
                                    <Text variant="label-strong-s" onBackground="brand-strong">{/*PDF herunterladen*/}Bald
                                        zum Download bereit...</Text>
                                </SmartLink>
                            </Column>
                        </RevealFx>

                        <RevealFx delay={0.7} translateY={20} center>
                            <Text variant="body-default-s" onBackground="brand-medium" align="center"
                                  style={{fontStyle: 'italic'}}>
                                Bei Fragen zu meinen Hygienemaßnahmen bin ich jederzeit für dich da.
                            </Text>
                        </RevealFx>
                    </Column>
                </Flex>
            </Column>
        </Column>
    );
};

export default StandardsSection;
