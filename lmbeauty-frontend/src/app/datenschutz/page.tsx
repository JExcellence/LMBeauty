'use client';

import { Column, Flex, Heading, Text, SmartLink, Background, Row } from "@once-ui-system/core";
import styles from './datenschutz.module.scss';

export default function DatenschutzPage() {
    return (
        <Column fillWidth className={styles.legalPage}>
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
                    radius: 120
                }}
                zIndex={0}
            />
            
            <Flex 
                as="main"
                flex={1}
                direction="column"
                horizontal="center"
                paddingTop="xl"
                paddingBottom="xl"
                paddingX="l"
                style={{ position: 'relative', zIndex: 1 }}
            >
                <Column 
                    maxWidth={48}
                    gap="l"
                    fillWidth
                    className={styles.contentWrapper}
                >
                    <Column gap="m" className={styles.pageHeader}>
                        <Heading as="h1" variant="display-strong-l" onBackground="brand-strong">
                            Datenschutzerklärung
                        </Heading>
                        <Text variant="body-default-s" onBackground="brand-medium" style={{ fontStyle: 'italic' }}>
                            Stand: Dezember 2024
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            Verantwortliche Stelle
                        </Heading>
                        <Column gap="4">
                            <Text variant="body-default-m" onBackground="brand-medium">
                                LM Beauty, Lisa Marie Pinske
                            </Text>
                            <Text variant="body-default-m" onBackground="brand-medium">
                                Bloherfelderstraße 40, 26129 Oldenburg
                            </Text>
                            <Text variant="body-default-m" onBackground="brand-medium">
                                E-Mail: <SmartLink href="mailto:info@lmbeauty.de" className={styles.link}>info@lmbeauty.de</SmartLink>
                            </Text>
                        </Column>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            Datenerfassung
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Wir erheben personenbezogene Daten nur, wenn Sie uns diese mitteilen – etwa bei einer Terminbuchung oder Kontaktaufnahme. Die Datenverarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO zur Vertragserfüllung.
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            Terminbuchung
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Bei der Buchung eines Termins erheben wir: Name, Telefonnummer, E-Mail-Adresse (optional), gewünschte Behandlung und Terminwunsch. Diese Daten werden ausschließlich zur Terminvereinbarung verwendet.
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            Kontaktaufnahme
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Wenn Sie uns per E-Mail, Telefon oder WhatsApp kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten zum Zwecke der Bearbeitung bei uns gespeichert.
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            Soziale Medien
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Wir nutzen Instagram und WhatsApp zur Kommunikation. Diese Dienste werden von Meta Platforms Ireland Limited betrieben. Weitere Informationen finden Sie in den jeweiligen Datenschutzerklärungen der Anbieter.
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            Ihre Rechte
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch gemäß DSGVO. Sie können sich jederzeit bei einer Datenschutz-Aufsichtsbehörde beschweren.
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            Speicherdauer
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Ihre personenbezogenen Daten verbleiben bei uns, bis der Zweck für die Datenverarbeitung entfällt oder Sie die Löschung verlangen, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            SSL-Verschlüsselung
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Diese Seite nutzt aus Sicherheitsgründen eine SSL-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie am Schloss-Symbol in Ihrer Browserzeile.
                        </Text>
                    </Column>

                    <Row paddingTop="xl">
                        <SmartLink href="/" className={styles.backLink}>
                            ← Zurück zur Startseite
                        </SmartLink>
                    </Row>
                </Column>
            </Flex>
        </Column>
    );
}
