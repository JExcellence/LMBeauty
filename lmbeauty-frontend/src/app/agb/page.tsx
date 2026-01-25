'use client';

import { Column, Flex, Heading, Text, SmartLink, Row, Background } from "@once-ui-system/core";
import styles from './agb.module.scss';

export default function AGBPage() {
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
                            Allgemeine Geschäftsbedingungen
                        </Heading>
                        <Text variant="body-default-s" onBackground="brand-medium" style={{ fontStyle: 'italic' }}>
                            Stand: Dezember 2024
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            § 1 Geltungsbereich
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen LM Beauty, Lisa Marie Pinske, und dem Kunden über kosmetische Dienstleistungen.
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            § 2 Vertragsschluss und Terminvereinbarung
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Der Vertrag kommt durch die Bestätigung des Termins durch den Anbieter zustande. Die Bestätigung erfolgt per WhatsApp, E-Mail oder telefonisch.
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            § 3 Preise und Zahlung
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Es gelten die zum Zeitpunkt der Terminvereinbarung ausgewiesenen Preise. Alle Preise verstehen sich als Endpreise inklusive der gesetzlichen Mehrwertsteuer. Die Zahlung erfolgt unmittelbar nach Erbringung der Dienstleistung.
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            § 4 Terminabsage und Stornierung
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Termine können bis 24 Stunden vor dem vereinbarten Termin kostenfrei abgesagt werden. Bei kurzfristigeren Absagen oder Nichterscheinen behält sich der Anbieter vor, eine Ausfallgebühr in Höhe von 50% des Behandlungspreises zu berechnen.
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            § 5 Leistungserbringung
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Der Anbieter erbringt die vereinbarten kosmetischen Dienstleistungen nach bestem Wissen und Gewissen. Der Kunde ist verpflichtet, vor der Behandlung wahrheitsgemäße Angaben zu Allergien und gesundheitlichen Einschränkungen zu machen.
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            § 6 Gewährleistung
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Der Anbieter gewährleistet eine fachgerechte Ausführung der Behandlung. Bei berechtigten Beanstandungen innerhalb von 48 Stunden wird eine kostenlose Nachbesserung angeboten, sofern die Pflegehinweise befolgt wurden.
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            § 7 Haftung
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit. Für sonstige Schäden haftet der Anbieter nur bei Vorsatz oder grober Fahrlässigkeit.
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            § 8 Datenschutz
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Die Erhebung und Verarbeitung personenbezogener Daten erfolgt gemäß der Datenschutzerklärung unter <SmartLink href="/datenschutz" className={styles.link}>lmbeauty.de/datenschutz</SmartLink>
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            § 9 Schlussbestimmungen
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist, soweit gesetzlich zulässig, Oldenburg.
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
