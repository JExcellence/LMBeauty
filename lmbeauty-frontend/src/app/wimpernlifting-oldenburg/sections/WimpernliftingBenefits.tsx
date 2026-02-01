"use client";

import React from 'react';
import {Column, Flex, Heading, Text} from '@once-ui-system/core';
import styles from './WimpernliftingBenefits.module.scss';

const reasons = [
    {
        label: 'Optische Verlängerung',
        value: 'Deine Wimpern werden direkt am Ansatz nach oben geliftet und wirken viel länger'
    },
    {label: 'Wacher Blick', value: 'Der Lifting-Effekt öffnet das Auge optisch und lässt dich frischer aussehen'},
    {
        label: 'Zeitersparnis am Morgen',
        value: 'Kein Biegen mit der Wimpernzange mehr – oft ist nicht einmal Mascara nötig'
    },
    {label: 'Lange Haltbarkeit', value: '6 bis 8 Wochen perfekter Schwung, entspricht dem natürlichen Wimpernzyklus'},
    {label: 'Pflegeleicht', value: 'Nach 24 Stunden wieder Sport, Sauna und Schwimmen möglich'},
    {label: 'Geringe Belastung', value: 'Kein zusätzliches Gewicht wie bei Extensions – schont die Haarwurzel'},
    {label: 'Zusätzlicher Färbe-Effekt', value: 'Wimpern werden mitgefärbt für sattes Schwarz und sichtbare Spitzen'},
    {label: 'Kosteneffizienz', value: 'Größere Abstände zwischen Terminen als bei Extensions – langfristig günstiger'}
];

export const WimpernliftingBenefits: React.FC = () => {
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
                        Weniger Aufwand. <Text as="span" onBackground="brand-weak">Mehr du.</Text>
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

export default WimpernliftingBenefits;

