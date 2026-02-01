"use client";

import React from 'react';
import { Button, Column, Flex, Heading, Text } from '@once-ui-system/core';
import styles from './WimpernverlaengerungComparison.module.scss';

export const WimpernverlaengerungComparison: React.FC = () => {
    return (
        <Flex
            as="section"
            id="comparison"
            fillWidth
            paddingY="xl"
            direction="column"
            horizontal="center"
        >
            <Column fillWidth maxWidth={72} gap="xl" paddingX="xl" s={{maxWidth: 100, paddingX: "l"}}>
                <Column gap="xs" center>
                    <Heading as="h2" variant="display-strong-xs" align="center">
                        Lifting oder Extensions: <Text as="span" onBackground="brand-weak">Was passt zu dir?</Text>
                    </Heading>
                    <div className={styles.headlineUnderline}></div>
                </Column>

                <Flex 
                    gap="0" 
                    direction="row"
                    className={styles.comparisonGrid}
                    m={{direction: "column"}}
                >
                    <Column className={styles.option}>
                        <Column gap="l" paddingY="xl" paddingX="l">
                            <Column gap="m">
                                <Heading as="h3" variant="heading-strong-xl" onBackground="brand-strong">
                                    Wimpernverlängerung
                                </Heading>
                                <Text variant="body-default-m" onBackground="brand-medium" style={{ lineHeight: 1.8 }}>
                                    Für alle, die mehr Länge und Volumen wünschen. Individuell anpassbar.
                                </Text>
                            </Column>
                            
                            <Column gap="s">
                                <Text variant="body-default-s" onBackground="brand-weak">Mehr Volumen</Text>
                                <Text variant="body-default-s" onBackground="brand-weak">Dramatischer</Text>
                                <Text variant="body-default-s" onBackground="brand-weak">2–4 Wochen + Refills</Text>
                                <Text variant="body-default-s" onBackground="brand-weak">Ab 75€</Text>
                            </Column>
                            
                            <Button href="/#contact" size="l" variant="primary" fillWidth>
                                Termin buchen
                            </Button>
                        </Column>
                    </Column>

                    <Column className={styles.option}>
                        <Column gap="l" paddingY="xl" paddingX="l">
                            <Column gap="m">
                                <Heading as="h3" variant="heading-strong-xl" onBackground="brand-strong">
                                    Wimpernlifting
                                </Heading>
                                <Text variant="body-default-m" onBackground="brand-medium" style={{ lineHeight: 1.8 }}>
                                    Für alle, die ihre eigenen Wimpern lieben und nur einen wacheren Blick möchten.
                                </Text>
                            </Column>
                            
                            <Column gap="s">
                                <Text variant="body-default-s" onBackground="brand-weak">Natürlich</Text>
                                <Text variant="body-default-s" onBackground="brand-weak">Pflegeleicht</Text>
                                <Text variant="body-default-s" onBackground="brand-weak">6–8 Wochen</Text>
                                <Text variant="body-default-s" onBackground="brand-weak">49€</Text>
                            </Column>
                            
                            <Button href="/wimpernlifting-oldenburg" size="l" variant="secondary" fillWidth>
                                Mehr erfahren
                            </Button>
                        </Column>
                    </Column>
                </Flex>
            </Column>
        </Flex>
    );
};

export default WimpernverlaengerungComparison;
