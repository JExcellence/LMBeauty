"use client";

import React from 'react';
import {Column, Flex, Heading, Icon, Text} from '@once-ui-system/core';
import styles from './WimpernliftingAftercare.module.scss';

const aftercareSteps = [
    {
        icon: 'clock',
        title: 'Erste 24-48 Stunden',
        description: 'Keine Feuchtigkeit, kein Make-up, keine öligen Produkte. Der Kleber muss vollständig aushärten.',
    },
    {
        icon: 'droplet',
        title: 'Reinigung',
        description: 'Täglich mit ölfreiem Reiniger säubern. Sanft tupfen, nicht reiben. Spezielle Wimpernbürste verwenden.',
    },
    {
        icon: 'shield',
        title: 'Was vermeiden',
        description: 'Ölige Produkte, Wimpernzange, Mascara auf Ölbasis, mechanisches Reiben, Schlafen auf dem Bauch.',
    },
    {
        icon: 'refresh',
        title: 'Refill-Termine',
        description: 'Alle 3-4 Wochen für dauerhaft perfekte Wimpern. So bleiben sie immer voll und schön.',
    },
];

export const WimpernverlaengerungAftercare: React.FC = () => {
    return (
        <Flex
            as="section"
            id="aftercare"
            fillWidth
            paddingY="xl"
            direction="column"
            horizontal="center"
        >
            <Column fillWidth maxWidth={64} gap="xl" paddingX="xl" s={{maxWidth: 100, paddingX: "l"}}>
                <Column gap="xs" center>
                    <Heading as="h2" variant="display-strong-xs" align="center">
                        Nachsorge: <Text as="span" onBackground="brand-weak">Was muss ich beachten?</Text>
                    </Heading>
                    <div className={styles.headlineUnderline}></div>
                    <Text variant="body-default-l" onBackground="brand-medium" align="center">
                        Mit der richtigen Pflege halten deine Extensions 4-6 Wochen
                    </Text>
                </Column>

                <Column fillWidth gap="m" maxWidth={56} style={{margin: '0 auto'}}>
                    {aftercareSteps.map((item, index) => (
                        <Flex key={index} gap="l" horizontal="start" vertical="start" className={styles.aftercareCard}>
                            <Flex
                                width="56"
                                height="56"
                                radius="m"
                                background="brand-alpha-weak"
                                horizontal="center"
                                vertical="center"
                                style={{
                                    flexShrink: 0
                                }}
                            >
                                <Icon name={item.icon} size="m" onBackground="brand-strong"/>
                            </Flex>

                            <Column gap="xs" flex={1}>
                                <Text variant="heading-strong-s" onBackground="brand-strong">
                                    {item.title}
                                </Text>
                                <Text variant="body-default-s" onBackground="brand-medium" style={{lineHeight: 1.7}}>
                                    {item.description}
                                </Text>
                            </Column>
                        </Flex>
                    ))}
                </Column>
            </Column>
        </Flex>
    );
};

export default WimpernverlaengerungAftercare;
