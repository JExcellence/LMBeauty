"use client";

import React from 'react';
import { Column, Flex, Heading, Text } from '@once-ui-system/core';
import styles from './WimpernliftingForWhom.module.scss';

export const WimpernverlaengerungForWhom: React.FC = () => {
    return (
        <Flex
            as="section"
            id="for-whom"
            fillWidth
            paddingY="xl"
            direction="column"
            horizontal="center"
        >
            <Column
                fillWidth
                maxWidth={48}
                paddingX="xl"
                gap="xl"
                s={{maxWidth: 100, paddingX: "l"}}
            >
                <Column gap="xs" center>
                    <Heading as="h2" variant="display-strong-xs" align="center">
                        Ist Wimpernverlängerung <Text as="span" onBackground="brand-weak">das Richtige für dich?</Text>
                    </Heading>
                    <div className={styles.headlineUnderline}></div>
                </Column>

                <Column gap="l" paddingTop="m">
                    <Column gap="m" maxWidth={36} style={{ margin: '0 auto' }}>
                        <Text 
                            variant="body-default-l" 
                            onBackground="brand-strong" 
                            align="center"
                            style={{ lineHeight: 1.8 }}
                        >
                            Wimpernverlängerung ist für dich, wenn du morgens Zeit sparen möchtest, 
                            mehr Volumen und Länge liebst und jeden Tag mit perfekten Wimpern aufwachen willst.
                        </Text>
                        
                        <Text 
                            variant="body-default-m" 
                            onBackground="brand-medium" 
                            align="center"
                            style={{ lineHeight: 1.8 }}
                        >
                            Sie ist wasserfest, hält durch Sport und Alltag und gibt dir ein dauerhaftes 
                            Gefühl von Selbstbewusstsein. Perfekt für Frauen, die sich jeden Tag schön fühlen möchten.
                        </Text>
                    </Column>

                    <Column 
                        gap="m" 
                        paddingY="l" 
                        maxWidth={40} 
                        style={{ margin: '0 auto' }}
                        className={styles.dividerSection}
                    >
                        <div className={styles.softDivider}></div>
                    </Column>

                    <Column gap="m" maxWidth={36} style={{ margin: '0 auto' }}>
                        <Text 
                            variant="body-default-m" 
                            onBackground="brand-medium" 
                            align="center"
                            style={{ lineHeight: 1.8 }}
                        >
                            Bei Augeninfektionen, frischen Augen-OPs oder Allergien gegen den Kleber 
                            ist die Behandlung nicht möglich. Auch bei sehr schwachen oder brüchigen 
                            Naturwimpern raten wir manchmal ab.
                        </Text>

                        <Text 
                            variant="body-default-m" 
                            onBackground="brand-medium" 
                            align="center"
                            style={{ lineHeight: 1.8 }}
                        >
                            Während der Schwangerschaft oder Stillzeit können hormonelle Schwankungen 
                            die Haltbarkeit beeinflussen. Wir besprechen das vorher in Ruhe.
                        </Text>

                        <Text 
                            variant="body-default-s" 
                            onBackground="brand-weak" 
                            align="center"
                            style={{ 
                                lineHeight: 1.8,
                                marginTop: '24px',
                                fontStyle: 'italic'
                            }}
                        >
                            Bei Unsicherheiten sprechen wir vor der Behandlung in Ruhe darüber. 
                            Deine Sicherheit und ein schönes Ergebnis sind mir wichtig.
                        </Text>
                    </Column>
                </Column>
            </Column>
        </Flex>
    );
};

export default WimpernverlaengerungForWhom;
