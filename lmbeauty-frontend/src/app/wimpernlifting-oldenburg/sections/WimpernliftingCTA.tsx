"use client";

import React from 'react';
import { Background, Button, Column, Flex, Heading, Text } from '@once-ui-system/core';
import styles from './WimpernliftingCTA.module.scss';

export const WimpernliftingCTA: React.FC = () => {
    return (
        <Flex
            as="section"
            id="cta"
            fillWidth
            paddingY="xl"
            direction="column"
            horizontal="center"
            style={{ position: 'relative' }}
        >
            <Background
                position="absolute"
                fill
                gradient={{
                    display: true,
                    opacity: 100,
                    x: 50,
                    y: 50,
                    colorStart: "brand-background-weak",
                    colorEnd: "accent-background-weak"
                }}
                mask={{
                    x: 50,
                    y: 50,
                    radius: 140
                }}
                zIndex={0}
                suppressHydrationWarning
            />

            <Column 
                fillWidth 
                maxWidth={48} 
                gap="xl" 
                horizontal="center" 
                style={{ position: 'relative', zIndex: 1 }}
                paddingX="xl"
                s={{maxWidth: 100, paddingX: "l"}}
            >
                <Column gap="l" horizontal="center">
                    <Heading as="h2" variant="display-strong-s" onBackground="brand-strong" align="center" style={{ fontWeight: 400 }}>
                        Bereit?
                    </Heading>
                    <Text 
                        variant="body-default-xl" 
                        onBackground="brand-medium" 
                        align="center"
                        style={{ lineHeight: 1.8, maxWidth: '420px' }}
                    >
                        Buche deinen Termin für Wimpernlifting in Oldenburg. 
                        60 Minuten, die sich lohnen.
                    </Text>
                </Column>

                <Flex gap="m" wrap horizontal="center" className={styles.buttons}>
                    <Button href="/#contact" size="l" variant="primary">
                        Termin buchen
                    </Button>
                    <Button href="/faq" size="l" variant="secondary">
                        Fragen & Antworten
                    </Button>
                </Flex>

                <Column gap="s" horizontal="center" style={{ marginTop: '32px' }}>
                    <Text variant="label-default-s" onBackground="brand-weak" align="center">
                        Bloherfelderstraße 40, 26129 Oldenburg
                    </Text>
                </Column>
            </Column>
        </Flex>
    );
};

export default WimpernliftingCTA;
