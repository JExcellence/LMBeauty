"use client";

import React, {useCallback, useState} from 'react';
import {Accordion, Background, Button, Column, Flex, Heading, Line, SmartLink, Text} from '@once-ui-system/core';
import styles from './InfoSection.module.scss';
import {InstagramFeed} from './InstagramFeed';

interface InfoSectionProps {
    instagramHandle?: string;
}

const faqItems = [
    {
        title: 'Wie lange halten die Wimpern?',
        content: 'Bei guter Pflege 2–4 Wochen, abhängig von deinem natürlichen Wimpernzyklus.'
    },
    {
        title: 'Tut das weh?',
        content: 'Nein. Du liegst entspannt mit geschlossenen Augen. Viele schlafen dabei ein.'
    },
    {
        title: 'Was muss ich vorher beachten?',
        content: 'Komm ohne Augen-Make-up und ohne Kontaktlinsen. Das ist alles.'
    }
];

export const InfoSection: React.FC<InfoSectionProps> = ({
                                                            instagramHandle = '_l.m_beauty_'
                                                        }) => {
    const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

    const toggleFAQ = useCallback((index: number) => {
        setActiveFAQ(activeFAQ === index ? null : index);
    }, [activeFAQ]);

    return (
        <Flex
            as="section"
            id="info"
            aria-labelledby="info-headline"
            fillWidth
            paddingY="xl"
            paddingX="l"
            direction="column"
            horizontal="center"
            className={styles.infoSection}
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

            <Column
                fillWidth
                maxWidth={80}
                padding="l"
                gap="xl"
                center
                zIndex={1}
                s={{maxWidth: 100}}
            >
                <Column
                    fillWidth
                    gap="l"
                    horizontal="start"
                    paddingTop="xl"
                    paddingBottom="l"
                    className={styles.firstTimerBlock}
                >
                    <Column gap="s" fitWidth>
                        <Heading
                            as="h2"
                            id="info-headline"
                            variant="display-strong-s"
                            onBackground="neutral-strong"
                            className={styles.headline}
                        >
                            Dein erster Termin?
                        </Heading>
                        <div className={styles.headlineUnderline}/>
                    </Column>

                    <Column gap="m" fillWidth center>
                        <Column fillWidth maxWidth={48} gap="m">
                            <Heading as="h3" variant="heading-default-l" align="center" onBackground="brand-medium">
                                Erfahre, wie es wirklich ist
                            </Heading>
                            <Text variant="body-default-m" onBackground="neutral-medium" align="center"
                                  className={styles.description}>
                                Was passiert eigentlich bei einem Wimperntermin? Wie fühlt es sich an?
                                Und was, wenn ich nervös bin? Hier bekommst du ehrliche Antworten.
                            </Text>
                        </Column>

                        <Button
                            href="#contact"
                            variant="primary"
                            size="m"
                        >
                            Kommt bald...
                        </Button>
                    </Column>
                </Column>

                <Flex
                    fillWidth
                    gap="xl"
                    direction="row"
                    m={{direction: "column", gap: "l"}}
                    s={{direction: "column", gap: "l"}}
                >
                    <Flex fillWidth direction="column" maxWidth={40}>
                        <Column maxWidth="l" align="center" fillWidth>
                            <Column>
                                <Heading
                                    as="h3"
                                    variant="heading-strong-xl"
                                    align="center"
                                    marginBottom="xs"
                                    onBackground="brand-weak"
                                >
                                    Häufige Fragen
                                </Heading>
                            </Column>

                            <Column>
                                <Text
                                    align="center"
                                    variant="body-default-l"
                                    marginBottom="m"
                                    onBackground="brand-medium"
                                >
                                    Alles, was du vor deinem ersten Termin wissen solltest
                                </Text>
                            </Column>

                            <Column
                                radius="l"
                                border="neutral-medium"
                                overflow="hidden"
                                background="brand-alpha-weak"
                                fillWidth
                            >
                                {faqItems.map(({title, content}, index) => (
                                    <React.Fragment key={index}>
                                        <Column>
                                            <Accordion
                                                open={activeFAQ === index}
                                                onToggle={() => toggleFAQ(index)}
                                                title={
                                                    <Text variant="body-default-m" onBackground="brand-medium">
                                                        {title}
                                                    </Text>
                                                }
                                                radius="l"
                                            >
                                                <Text
                                                    variant="body-default-s"
                                                    onBackground="brand-medium"
                                                    align="left"
                                                >
                                                    {content}
                                                </Text>
                                            </Accordion>
                                        </Column>
                                        {index !== faqItems.length - 1 && <Line/>}
                                    </React.Fragment>
                                ))}
                            </Column>

                            <Column>
                                <Text
                                    align="center"
                                    wrap="balance"
                                    variant="body-default-s"
                                    onBackground="brand-weak"
                                    marginTop="m"
                                >
                                    Noch mehr Fragen?{" "}
                                    <SmartLink href="/faq" className={styles.faqMoreLink}>
                                        Alle Antworten ansehen
                                    </SmartLink>
                                </Text>
                            </Column>
                        </Column>
                    </Flex>

                    <Column
                        flex={1}
                        gap="m"
                        className={styles.instagramColumn}
                    >
                        <Column>
                            <InstagramFeed handle={instagramHandle} maxPosts={6}/>
                        </Column>
                    </Column>
                </Flex>
            </Column>
        </Flex>
    );
};

export default InfoSection;
