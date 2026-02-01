"use client";

import React from 'react';
import {Column, Flex, Heading, Text} from '@once-ui-system/core';
import styles from './WimpernliftingBenefits.module.scss';

const reasons = [
    {
        label: 'Zeitersparnis jeden Morgen',
        value: 'Keine Mascara mehr nötig – du wachst auf und bist fertig. Perfekt für vielbeschäftigte Frauen.'
    },
    {
        label: 'Individueller Look',
        value: 'Länge, Volumen und Schwung werden genau auf dich abgestimmt. Natürlich oder glamourös – du entscheidest.'
    },
    {
        label: 'Lange Haltbarkeit',
        value: '4-6 Wochen perfekter Look. Mit Refills alle 3-4 Wochen bleiben deine Wimpern dauerhaft schön.'
    },
    {
        label: 'Wasserfest & alltagstauglich',
        value: 'Sport, Schwimmen, Sauna – alles kein Problem. Die Extensions halten durch deinen Alltag.'
    },
    {
        label: 'Natürliches Aussehen',
        value: 'Hochwertige Seidenextensions sehen aus wie echte Wimpern. Niemand merkt, dass sie nicht echt sind.'
    },
    {
        label: 'Mehr Selbstbewusstsein',
        value: 'Wache jeden Tag mit perfekten Wimpern auf. Das Gefühl ist unbezahlbar.'
    },
    {
        label: 'Schonend für Naturwimpern',
        value: 'Bei richtiger Anwendung und Pflege werden deine Naturwimpern nicht beschädigt.'
    },
    {
        label: 'Vielseitig kombinierbar',
        value: 'Verschiedene Techniken lassen sich kombinieren für deinen individuellen Traumlook.'
    }
];

export const WimpernverlaengerungBenefits: React.FC = () => {
    return (
        <Flex
            as="section"
            id="benefits"
            fillWidth
            paddingY="xl"
            direction="column"
            horizontal="center"
        >
            <Column fillWidth maxWidth={72} gap="xl" paddingX="xl" s={{maxWidth: 100, paddingX: "l"}}>
                <Column gap="xs" center>
                    <Heading as="h2" variant="display-strong-xs" align="center">
                        Warum <Text as="span" onBackground="brand-weak">Wimpernverlängerung?</Text>
                    </Heading>
                    <div className={styles.headlineUnderline}></div>
                </Column>

                <Column gap="0" className={styles.reasonsList}>
                    {reasons.map((reason, index) => (
                        <Flex key={index} className={styles.reasonItem}>
                            <Column gap="xs" fillWidth>
                                <Text variant="heading-strong-m" onBackground="brand-strong">
                                    {reason.label}
                                </Text>
                                <Text variant="body-default-m" onBackground="brand-medium" style={{lineHeight: 1.7}}>
                                    {reason.value}
                                </Text>
                            </Column>
                        </Flex>
                    ))}
                </Column>
            </Column>
        </Flex>
    );
};

export default WimpernverlaengerungBenefits;
