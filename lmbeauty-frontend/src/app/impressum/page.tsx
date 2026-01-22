import { Column, Flex, Heading, Text, SmartLink, Row } from "@once-ui-system/core";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Impressum | LM Beauty",
    description: "Impressum und rechtliche Angaben von LM Beauty - Wimpernstudio in Oldenburg",
};

/**
 * Impressum Page — Legal Information (German Law Compliant)
 * 
 * Note: TMG (Telemediengesetz) was replaced by DDG (Digitale-Dienste-Gesetz) 
 * as of May 14, 2024. The new reference is § 5 DDG.
 */
export default function ImpressumPage() {
    return (
        <Column fillWidth style={{ minHeight: '100vh', background: 'var(--lm-bg-white, #FFFFFF)' }}>
            <Flex 
                as="main"
                flex={1}
                direction="column"
                horizontal="center"
                paddingTop="80"
                paddingBottom="80"
                paddingX="l"
            >
                <Column 
                    maxWidth="m"
                    gap="xl"
                    fillWidth
                >
                    {/* Page Header */}
                    <Column gap="m">
                        <Heading as="h1" variant="display-default-l">
                            Impressum
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)
                        </Text>
                    </Column>

                    {/* Business Information */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            Angaben zum Unternehmen
                        </Heading>
                        <Column gap="xs">
                            <Text variant="body-default-m" style={{ fontWeight: 600 }}>
                                LM Beauty
                            </Text>
                            <Text variant="body-default-m">
                                Lisa Marie Pinske
                            </Text>
                            <Text variant="body-default-m">
                                Bloherfelderstraße 40
                            </Text>
                            <Text variant="body-default-m">
                                26129 Oldenburg
                            </Text>
                            <Text variant="body-default-m">
                                Deutschland
                            </Text>
                        </Column>
                    </Column>

                    {/* Representative */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            Vertreten durch
                        </Heading>
                        <Text variant="body-default-m">
                            Lisa Marie Pinske (Inhaberin)
                        </Text>
                    </Column>

                    {/* Contact */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            Kontakt
                        </Heading>
                        <Column gap="xs">
                            <Row gap="s" vertical="center">
                                <Text variant="body-default-m" style={{ minWidth: '80px' }}>
                                    Telefon:
                                </Text>
                                <SmartLink href="tel:+4915259675346">
                                    +49 152 59675346
                                </SmartLink>
                            </Row>
                            <Row gap="s" vertical="center">
                                <Text variant="body-default-m" style={{ minWidth: '80px' }}>
                                    E-Mail:
                                </Text>
                                <SmartLink href="mailto:info@lmbeauty.de">
                                    info@lmbeauty.de
                                </SmartLink>
                            </Row>
                            <Row gap="s" vertical="center">
                                <Text variant="body-default-m" style={{ minWidth: '80px' }}>
                                    WhatsApp:
                                </Text>
                                <SmartLink href="https://wa.me/+4915259675346" target="_blank">
                                    +49 152 59675346
                                </SmartLink>
                            </Row>
                        </Column>
                    </Column>

                    {/* Tax Information */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            Umsatzsteuer-ID
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
                            Beantragung läuft aktuell noch. Diese Seite wird aktualisiert, sobald die USt-IdNr. vorliegt.
                        </Text>
                    </Column>

                    {/* Editorial Responsibility */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            Verantwortlich für den Inhalt
                        </Heading>
                        <Text variant="body-default-m">
                            Verantwortlich gemäß § 18 Abs. 2 MStV (Medienstaatsvertrag):
                        </Text>
                        <Column gap="xs">
                            <Text variant="body-default-m">
                                Lisa Marie Pinske
                            </Text>
                            <Text variant="body-default-m">
                                Bloherfelderstraße 40
                            </Text>
                            <Text variant="body-default-m">
                                26129 Oldenburg
                            </Text>
                        </Column>
                    </Column>

                    {/* Dispute Resolution */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            Streitschlichtung
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                            <SmartLink href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
                                https://ec.europa.eu/consumers/odr/
                            </SmartLink>
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                            Verbraucherschlichtungsstelle teilzunehmen.
                        </Text>
                    </Column>

                    {/* Liability Disclaimer */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            Haftung für Inhalte
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte auf diesen Seiten 
                            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als 
                            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
                            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
                            Tätigkeit hinweisen.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den 
                            allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch 
                            erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei 
                            Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                        </Text>
                    </Column>

                    {/* Links Disclaimer */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            Haftung für Links
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
                            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
                            Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
                            Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf 
                            mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der 
                            Verlinkung nicht erkennbar.
                        </Text>
                    </Column>

                    {/* Copyright */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            Urheberrecht
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                            dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
                            der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
                            Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind 
                            nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                        </Text>
                    </Column>

                    {/* Back Link */}
                    <Row paddingTop="l">
                        <SmartLink href="/">
                            ← Zurück zur Startseite
                        </SmartLink>
                    </Row>
                </Column>
            </Flex>
        </Column>
    );
}
