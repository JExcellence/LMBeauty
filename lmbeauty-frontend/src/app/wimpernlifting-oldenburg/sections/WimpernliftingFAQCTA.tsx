"use client";

import React from 'react';
import { Background, Button, Column, Flex, Heading, Icon, Text } from '@once-ui-system/core';

export const WimpernliftingFAQCTA: React.FC = () => {
    return (
        <Flex
            as="section"
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
                    colorStart: "accent-background-weak",
                    colorEnd: "brand-background-weak"
                }}
                mask={{
                    x: 50,
                    y: 50,
                    radius: 100
                }}
                zIndex={0}
                suppressHydrationWarning
            />

            <Column
                fillWidth
                maxWidth={48}
                paddingX="xl"
                gap="l"
                horizontal="center"
                style={{ position: 'relative', zIndex: 1 }}
                s={{ maxWidth: 100, paddingX: "l" }}
            >
                <Column
                    fillWidth
                    gap="l"
                    horizontal="center"
                    vertical="center"
                    paddingY="xl"
                    paddingX="l"
                    background="brand-alpha-weak"
                    radius="xl"
                    border="brand-alpha-medium"
                >
                    <Icon name="helpCircle" size="l" onBackground="brand-strong" />
                    <Column gap="s" horizontal="center" maxWidth="xs">
                        <Heading as="h2" variant="heading-strong-l" onBackground="brand-strong" align="center">
                            Noch Fragen zum Wimpernlifting?
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium" align="center">
                            In unseren FAQ findest du Antworten auf alle wichtigen Fragen zu Wimpernlifting, Pflege, Haltbarkeit und mehr.
                        </Text>
                    </Column>
                    <Flex gap="m" wrap horizontal="center">
                        <Button href="/faq" size="l" variant="primary">
                            Zu den FAQ
                        </Button>
                        <Button href="/#contact" size="l" variant="secondary">
                            Termin buchen
                        </Button>
                    </Flex>
                </Column>
            </Column>
        </Flex>
    );
};

export default WimpernliftingFAQCTA;
