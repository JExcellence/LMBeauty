"use client";

import React from 'react';
import { Column, Flex, Heading, Text } from '@once-ui-system/core';
import styles from './WimpernliftingForWhom.module.scss';

export const WimpernliftingForWhom: React.FC = () => {
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
                        Ist Wimpernlifting <Text as="span" onBackground="brand-weak">das Richtige für dich?</Text>
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
                            Wimpernlifting ist für dich, wenn du morgens Zeit sparen möchtest, einen natürlichen Look liebst und deine eigenen Wimpern einfach nur besser zur Geltung bringen willst.
                        </Text>
                        
                        <Text 
                            variant="body-default-m" 
                            onBackground="brand-medium" 
                            align="center"
                            style={{ lineHeight: 1.8 }}
                        >
                            Es ist sanft, pflegeleicht und hält durch Sport, Schwimmen und Sauna. Perfekt für aktive Frauen, die sich trotzdem gepflegt fühlen möchten.
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
                            Es gibt Situationen, in denen wir von einem Lifting abraten. Bei Augeninfektionen, frischen Augen-OPs oder Allergien gegen die Inhaltsstoffe ist die Behandlung nicht möglich.
                        </Text>

                        <Text 
                            variant="body-default-m" 
                            onBackground="brand-medium" 
                            align="center"
                            style={{ lineHeight: 1.8 }}
                        >
                            Auch während der Schwangerschaft, Stillzeit oder bei sehr kurzen Wimpern kann das Ergebnis enttäuschend sein. Hormonelle Schwankungen beeinflussen manchmal, wie gut die Wimpern die Behandlung annehmen.
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
                            Bei Unsicherheiten sprechen wir vor der Behandlung in Ruhe darüber. Deine Sicherheit und ein schönes Ergebnis sind mir wichtig.
                        </Text>
                    </Column>
                </Column>
            </Column>
        </Flex>
    );
};

export default WimpernliftingForWhom;
