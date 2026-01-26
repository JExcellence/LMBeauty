'use client';

import {Button, Text} from '@once-ui-system/core';
import styles from './Connection.module.scss';

export function Connection() {
    return (
        <div className={styles.connection}>
            <div className={styles.connectionContent}>
                <Text className={styles.connectionTitle}>
                    Du kannst jederzeit mit mir sprechen
                </Text>
                <Text className={styles.connectionDescription}>
                    Für Fragen, Wünsche oder einfach nur zum Plaudern
                </Text>
            </div>

            <div className={styles.connectionWays}>
                <Button
                    variant="tertiary"
                    size="m"
                    href="https://wa.me/+4915259675346"
                    className={styles.connectionButton}
                >
                    <Text>WhatsApp</Text>
                </Button>
                <Button
                    variant="tertiary"
                    size="m"
                    href="mailto:lisa.pinske@lmbeauty.de"
                    className={styles.connectionButton}
                >
                    <Text>E-Mail</Text>
                </Button>
            </div>
        </div>
    );
}