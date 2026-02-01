"use client";

import React from 'react';
import { Card, Column, Flex, Heading, Row, Text } from '@once-ui-system/core';
import styles from './WimpernliftingProcess.module.scss';

const steps = [
    {
        number: '01',
        title: 'Beratung & Vorbereitung',
        description: 'Wir besprechen deinen Wunsch-Look und wählen gemeinsam Länge, Stärke und Schwung. Deine Naturwimpern werden gereinigt und vorbereitet.'
    },
    {
        number: '02',
        title: 'Präzises Aufbringen',
        description: 'Jede Extension wird einzeln auf deine Naturwimper geklebt – Wimper für Wimper, mit viel Geduld und Präzision. Das dauert 2-3 Stunden.'
    },
    {
        number: '03',
        title: 'Finishing & Pflege',
        description: 'Nach dem Trocknen versiegeln wir die Extensions. Du bekommst alle Pflegetipps und kannst dich direkt über dein Ergebnis freuen.'
    }
];

export const WimpernverlaengerungProcess: React.FC = () => {
    return (
        <Flex
            as="section"
            id="process"
            fillWidth
            paddingY="xl"
            direction="column"
            horizontal="center"
        >
            <Column fillWidth maxWidth={80} gap="xl" paddingX="xl" s={{ maxWidth: 100, paddingX: "l" }}>
                <Column gap="xs" center>
                    <Heading as="h2" variant="display-strong-xs" align="center">
                        Der <Text as="span" onBackground="brand-weak">Ablauf</Text>
                    </Heading>
                    <div className={styles.headlineUnderline}></div>
                    <Text variant="body-default-l" onBackground="brand-medium" align="center">
                        2-3 Stunden für dich
                    </Text>
                </Column>

                <Column gap="xl" className={styles.stepsContainer}>
                    {steps.map((step, index) => (
                        <Row
                            key={index}
                            gap="xl"
                            direction={index % 2 === 0 ? "row" : "row-reverse"}
                            vertical="center"
                            className={styles.step}
                            m={{ direction: "column" }}
                        >
                            <Column
                                fillWidth
                                gap="m"
                                className={styles.stepContent}
                            >
                                <Text 
                                    variant="display-strong-s" 
                                    onBackground="brand-weak"
                                    className={styles.stepNumber}
                                >
                                    {step.number}
                                </Text>
                                <Heading as="h3" variant="heading-strong-l" onBackground="brand-strong">
                                    {step.title}
                                </Heading>
                                <Text 
                                    variant="body-default-l" 
                                    onBackground="brand-medium"
                                    style={{ lineHeight: 1.8 }}
                                >
                                    {step.description}
                                </Text>
                            </Column>
                            <Card
                                fillWidth
                                radius="l"
                                border="neutral-alpha-medium"
                                padding="xl"
                                overflow="hidden"
                                background="surface"
                                style={{
                                    boxShadow: '0 4px 24px rgba(196, 96, 122, 0.08)',
                                    minHeight: '280px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                className={styles.stepImageCard}
                            >
                                <Column gap="m" center>
                                    <svg 
                                        width="48" 
                                        height="48" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="1.5"
                                        style={{ color: 'rgba(196, 96, 122, 0.3)' }}
                                    >
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                        <circle cx="8.5" cy="8.5" r="1.5"/>
                                        <polyline points="21 15 16 10 5 21"/>
                                    </svg>
                                    <Text 
                                        variant="label-default-s" 
                                        onBackground="brand-weak"
                                        align="center"
                                    >
                                        Bilder folgen in Kürze
                                    </Text>
                                </Column>
                            </Card>
                        </Row>
                    ))}
                </Column>
            </Column>
        </Flex>
    );
};

export default WimpernverlaengerungProcess;
