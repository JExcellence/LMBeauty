"use client";

import React from 'react';
import {Button, Card, Column, Flex, Grid, Heading, Icon, Row, Text} from '@once-ui-system/core';
import styles from './WimpernliftingBenefits.module.scss';

const techniques = [
    {
        id: 'einzeltechnik',
        title: 'Einzeltechnik (1:1)',
        personaTag: 'Natürlich & Elegant',
        price: '75€',
        duration: '120-150',
        description: 'Eine Extension pro Naturwimper für einen dezenten, alltagstauglichen Look. Perfekt für den natürlichen Auftritt.',
        idealFor: [
            'Alltag & Beruf',
            'Natürlicher Look',
            'Leichtes Tragegefühl',
            'Anfänger geeignet'
        ]
    },
    {
        id: 'hybridtechnik',
        title: 'Hybridtechnik',
        personaTag: 'Ausgewogen & Vielseitig',
        price: '85€',
        duration: '150-180',
        description: 'Der perfekte Mix aus Einzel- und Volumentechnik. Mehr Fülle bei natürlichem Look – die beliebteste Wahl.',
        idealFor: [
            'Perfekte Balance',
            'Vielseitig einsetzbar',
            'Natürlich mit Wow-Effekt',
            'Meistgewählte Technik'
        ]
    },
    {
        id: 'volumentechnik',
        title: 'Volumentechnik',
        personaTag: 'Glamourös & Dramatisch',
        price: '100€',
        duration: '150-180',
        description: 'Mehrere feine Extensions pro Naturwimper für maximales Volumen. Dramatischer, glamouröser Look für besondere Anlässe.',
        idealFor: [
            'Maximale Fülle',
            'Glamouröser Auftritt',
            'Events & Fotoshootings',
            'Langanhaltend'
        ]
    }
];

const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const WimpernverlaengerungTechniques: React.FC = () => {
    return (
        <Flex
            as="section"
            id="techniques"
            fillWidth
            paddingY="xl"
            direction="column"
            horizontal="center"
        >
            <Column fillWidth maxWidth={80} gap="xl" paddingX="xl" s={{maxWidth: 100, paddingX: "l"}}>
                <Column gap="xs" center>
                    <Heading as="h2" variant="display-strong-xs" align="center">
                        Unsere <Text as="span" onBackground="brand-weak">Techniken</Text>
                    </Heading>
                    <div className={styles.headlineUnderline}></div>
                    <Text variant="body-default-l" onBackground="brand-medium" align="center">
                        Finde deinen perfekten Look
                    </Text>
                </Column>

                <Grid
                    fillWidth
                    gap="m"
                    columns={3}
                    m={{columns: 1}}
                    s={{columns: 1}}
                >
                    {techniques.map((technique) => (
                        <Card
                            key={technique.id}
                            radius="l"
                            direction="column"
                            border="neutral-alpha-medium"
                        >
                            <Column padding="m" gap="m" fillWidth>
                                <Column gap="s">
                                    <Column gap="xs">
                                        <Heading as="h4" onBackground="brand-medium">
                                            {technique.title}
                                        </Heading>
                                        <Text variant="label-default-xs" onBackground="brand-weak">
                                            <i>{technique.personaTag}</i>
                                        </Text>
                                        <Text variant="body-default-xs" onBackground="brand-medium">
                                            {technique.description}
                                        </Text>
                                    </Column>
                                </Column>

                                <Column fillWidth gap="m">
                                    <Row vertical="end" horizontal="between">
                                        <Column gap="2">
                                            <Row gap="4" vertical="center">
                                                <Text variant="heading-strong-m" onBackground="brand-strong">
                                                    {technique.price}
                                                </Text>
                                            </Row>
                                        </Column>
                                        <Row gap="4" vertical="center">
                                            <Icon name="clock" size="s" onBackground="neutral-medium"/>
                                            <Text variant="label-default-m" onBackground="neutral-medium">
                                                {technique.duration} Min
                                            </Text>
                                        </Row>
                                    </Row>

                                    <Button
                                        href="/#contact"
                                        variant="primary"
                                        size="m"
                                        fillWidth
                                        label="Jetzt buchen"
                                        aria-label={`${technique.title} jetzt buchen`}
                                    />
                                </Column>
                            </Column>
                        </Card>
                    ))}
                </Grid>
            </Column>
        </Flex>
    );
};

export default WimpernverlaengerungTechniques;
