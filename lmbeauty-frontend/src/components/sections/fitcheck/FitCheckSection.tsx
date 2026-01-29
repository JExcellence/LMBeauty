"use client";

import React from 'react';
import {Background, Column, Flex, Grid, Heading, List, ListItem, Text} from "@once-ui-system/core";
import styles from './FitCheckSection.module.scss';
import {useScrollReveal} from '@/hooks';

const perfectForItems = [
    'du Wert auf Natürlichkeit legst, auch bei Volumen',
    'du unsicher bist und klare Empfehlungen brauchst',
    'du Termine magst, die sich wie eine Pause anfühlen',
    'du keine Lust auf Massenabfertigung hast',
];

const notIdealItems = [
    'du regelmäßig schwimmen gehst',
    'deine Augen viel tränen',
    'du unbewusst viel an deinen Wimpern zupfst',
    'du eine Allergie gegen Wimpernkleber hast'
];

export const FitCheckSection: React.FC = () => {
    const {ref: sectionRef, isVisible} = useScrollReveal({threshold: 0.1});

    return (
        <Column
            as="section"
            ref={sectionRef}
            id="fitcheck"
            aria-labelledby="fitcheck-headline"
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
            <Column fillWidth maxWidth={80} s={{maxWidth: 100}}>
                <Column gap="l" horizontal="start" paddingTop="l" paddingBottom="m">
                    <Column gap="2" fitWidth>
                        <Heading
                            as="h3"
                            id="fitcheck-headline"
                            variant="display-strong-xs"
                            onBackground="brand-strong"
                        >
                            Für wen das <Text as="span" onBackground="brand-weak">perfekt</Text> ist
                        </Heading>
                        <Flex className={styles.headlineUnderline}/>
                    </Column>
                </Column>

                <Grid
                    rows={1}
                    columns={2}
                    m={{rows: 2, columns: 1}}
                    gap="m"
                >
                    <Column
                        gap="s"
                        paddingX="s"
                        paddingY="xs"
                    >
                        <Flex gap="m" horizontal="start" vertical="center">
                            <Heading
                                variant="heading-strong-xs"
                            >
                                Perfekt für dich, wenn...
                            </Heading>
                        </Flex>

                        <List as="ul" gap="m" background="brand-weak">
                            {perfectForItems.map((item, index) => (
                                <ListItem
                                    key={index}
                                    style={{'--item-index': index} as React.CSSProperties}
                                >
                                    <Text variant="body-default-s">
                                        {item}
                                    </Text>
                                </ListItem>
                            ))}
                        </List>
                    </Column>

                    <Column
                        gap="s"
                        paddingX="s"
                        paddingY="xs"
                    >
                        <Flex gap="m" horizontal="start" vertical="center">
                            <Heading
                                variant="heading-strong-xs"
                            >
                                Vielleicht nicht ideal, wenn...
                            </Heading>
                        </Flex>
                        <List as="ul" gap="m">
                            {notIdealItems.map((item, index) => (
                                <ListItem
                                    key={index}
                                    style={{'--item-index': index} as React.CSSProperties}
                                >
                                    <Text variant="body-default-s" className={styles.itemText}>
                                        {item}
                                    </Text>
                                </ListItem>
                            ))}
                        </List>
                    </Column>
                </Grid>

                {/* Editorial Note */}
                <Column gap="s" horizontal="center" padding="m">
                    <Text variant="body-default-m" onBackground="brand-weak" align="center">
                        Nicht sicher? Kein Problem. Wir finden im Gespräch heraus, was zu dir passt.
                    </Text>
                    <Text variant="body-default-s" onBackground="brand-medium">
                        — Lisa
                    </Text>
                </Column>
            </Column>
        </Column>
    );
};

export default FitCheckSection;
