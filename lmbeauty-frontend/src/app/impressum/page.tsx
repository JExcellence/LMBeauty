'use client';

import {Background, Column, Flex, Heading, Row, SmartLink, Text} from "@once-ui-system/core";
import styles from './impressum.module.scss';

export default function ImpressumPage() {
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
                style={{position: 'relative', zIndex: 1}}
            >
                <Column
                    maxWidth={48}
                    gap="l"
                    fillWidth
                    className={styles.contentWrapper}
                >
                    <Column gap="m" className={styles.pageHeader}>
                        <Heading as="h1" variant="display-strong-l" onBackground="brand-strong">
                            Impressum
                        </Heading>
                        <Text variant="body-default-s" onBackground="brand-medium" style={{fontStyle: 'italic'}}>
                            Angaben gemäß § 5 DDG
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            Angaben zum Unternehmen
                        </Heading>
                        <Column gap="4">
                            <Text variant="body-default-m" onBackground="brand-medium" style={{fontWeight: 600}}>
                                LM Beauty
                            </Text>
                            <Text variant="body-default-m" onBackground="brand-medium">
                                Lisa Marie Pinske
                            </Text>
                            <Text variant="body-default-m" onBackground="brand-medium">
                                Bloherfelderstraße 40
                            </Text>
                            <Text variant="body-default-m" onBackground="brand-medium">
                                26129 Oldenburg
                            </Text>
                        </Column>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            Vertreten durch
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Lisa Marie Pinske (Inhaberin)
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            Kontakt
                        </Heading>
                        <Column gap="4">
                            <Text variant="body-default-m" onBackground="brand-medium">
                                Telefon: <SmartLink href="tel:+4915259675346" className={styles.link}>+49 152
                                59675346</SmartLink>
                            </Text>
                            <Text variant="body-default-m" onBackground="brand-medium">
                                E-Mail: <SmartLink href="mailto:lisa.pinske@lmbeauty.de"
                                                   className={styles.link}>lisa.pinske@lmbeauty.de</SmartLink>
                            </Text>
                            <Text variant="body-default-m" onBackground="brand-medium">
                                WhatsApp: <SmartLink href="https://wa.me/+4915259675346" target="_blank"
                                                     className={styles.link}>+49 152 59675346</SmartLink>
                            </Text>
                        </Column>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            Umsatzsteuer-ID
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: Beantragung läuft aktuell
                            noch.
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            Verantwortlich für den Inhalt
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Verantwortlich gemäß § 18 Abs. 2 MStV:
                        </Text>
                        <Column gap="4">
                            <Text variant="body-default-m" onBackground="brand-medium">
                                Lisa Marie Pinske
                            </Text>
                            <Text variant="body-default-m" onBackground="brand-medium">
                                Bloherfelderstraße 40, 26129 Oldenburg
                            </Text>
                        </Column>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            Streitschlichtung
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
                            bereit: <SmartLink href="https://ec.europa.eu/consumers/odr/" target="_blank"
                                               rel="noopener noreferrer"
                                               className={styles.link}>https://ec.europa.eu/consumers/odr/</SmartLink>
                        </Text>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                            Verbraucherschlichtungsstelle teilzunehmen.
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            Haftung für Inhalte
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte auf diesen Seiten nach
                            den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter
                            jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen
                            oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            Haftung für Links
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
                            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
                            Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
                            Seiten verantwortlich.
                        </Text>
                    </Column>

                    <Column gap="m">
                        <Heading as="h2" variant="heading-strong-m" onBackground="brand-strong">
                            Urheberrecht
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium">
                            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
                            deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                            Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung
                            des jeweiligen Autors bzw. Erstellers.
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
