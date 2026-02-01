"use client";

import React from 'react';
import { Card, Column, Flex, Heading, Media, Row, Text } from '@once-ui-system/core';
import styles from './WimpernliftingProcess.module.scss';

const steps = [
    {
        number: '01',
        title: 'Formung',
        description: 'Deine Wimpern werden sanft auf ein Silikonpad gelegt und in die gewünschte Form gebracht. Alles fühlt sich leicht an.',
        image: '/images/wimpernlifting/step-formung.jpg'
    },
    {
        number: '02',
        title: 'Färbung',
        description: 'Wir färben deine Wimpern tiefschwarz – auch bei hellen Wimpern. Der Mascara-Effekt entsteht ganz natürlich.',
        image: '/images/wimpernlifting/step-faerbung.jpg'
    },
    {
        number: '03',
        title: 'Keratin',
        description: 'Eine pflegende Keratin-Infusion stärkt deine Wimpern von innen. Sie werden geschützt, genährt und glänzen.',
        image: '/images/wimpernlifting/step-keratin.jpg'
    }
];

export const WimpernliftingProcess: React.FC = () => {
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
                        60 Minuten für dich
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

export default WimpernliftingProcess;
