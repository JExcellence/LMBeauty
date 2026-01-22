import { Column, Flex, Heading, Text, SmartLink, Row } from "@once-ui-system/core";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AGB | LM Beauty",
    description: "Allgemeine Geschäftsbedingungen von LM Beauty - Wimpernstudio in Oldenburg",
};

/**
 * AGB Page — Terms and Conditions (German Law Compliant)
 * 
 * Tailored for beauty/cosmetic services business
 */
export default function AGBPage() {
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
                            Allgemeine Geschäftsbedingungen
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Stand: Dezember 2024
                        </Text>
                    </Column>

                    {/* 1. Scope */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            § 1 Geltungsbereich
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen 
                            LM Beauty, Lisa Marie Pinske, Bloherfelderstraße 40, 26129 Oldenburg (nachfolgend 
                            „Anbieter") und dem Kunden über kosmetische Dienstleistungen, insbesondere 
                            Wimpernverlängerungen, Wimpernlifting, Augenbrauenbehandlungen und Nageldesign.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (2) Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, der 
                            Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.
                        </Text>
                    </Column>

                    {/* 2. Contract */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            § 2 Vertragsschluss und Terminvereinbarung
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (1) Die Darstellung der Dienstleistungen auf der Website stellt kein rechtlich 
                            bindendes Angebot, sondern eine Aufforderung zur Terminbuchung dar.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (2) Der Vertrag kommt durch die Bestätigung des Termins durch den Anbieter zustande. 
                            Die Bestätigung erfolgt per WhatsApp, E-Mail oder telefonisch.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (3) Termine können online über das Buchungssystem, per WhatsApp, E-Mail oder 
                            telefonisch vereinbart werden.
                        </Text>
                    </Column>

                    {/* 3. Prices */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            § 3 Preise und Zahlung
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (1) Es gelten die zum Zeitpunkt der Terminvereinbarung auf der Website oder im 
                            Studio ausgewiesenen Preise. Alle Preise verstehen sich als Endpreise inklusive 
                            der gesetzlichen Mehrwertsteuer.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (2) Die Zahlung erfolgt unmittelbar nach Erbringung der Dienstleistung in bar 
                            oder per EC-Karte, sofern nicht anders vereinbart.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (3) Bei aufwendigeren Behandlungen oder Neukunden kann eine Anzahlung verlangt werden. 
                            Diese wird bei Erscheinen zum Termin mit dem Gesamtpreis verrechnet.
                        </Text>
                    </Column>

                    {/* 4. Cancellation */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            § 4 Terminabsage und Stornierung
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (1) Termine können bis 24 Stunden vor dem vereinbarten Termin kostenfrei abgesagt 
                            oder verschoben werden.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (2) Bei Absagen weniger als 24 Stunden vor dem Termin oder bei Nichterscheinen 
                            ohne Absage behält sich der Anbieter vor, eine Ausfallgebühr in Höhe von 50% des 
                            vereinbarten Behandlungspreises zu berechnen.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (3) Bei wiederholtem Nichterscheinen ohne Absage behält sich der Anbieter vor, 
                            zukünftige Terminanfragen abzulehnen oder eine Vorauszahlung zu verlangen.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (4) Der Anbieter behält sich vor, Termine aus wichtigem Grund (z.B. Krankheit) 
                            abzusagen. In diesem Fall wird ein Ersatztermin angeboten.
                        </Text>
                    </Column>

                    {/* 5. Services */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            § 5 Leistungserbringung
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (1) Der Anbieter erbringt die vereinbarten kosmetischen Dienstleistungen nach 
                            bestem Wissen und Gewissen unter Verwendung hochwertiger Materialien.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (2) Der Kunde ist verpflichtet, vor der Behandlung wahrheitsgemäße Angaben zu 
                            Allergien, Unverträglichkeiten, Augenerkrankungen oder anderen relevanten 
                            gesundheitlichen Einschränkungen zu machen.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (3) Der Anbieter behält sich vor, eine Behandlung abzulehnen oder abzubrechen, 
                            wenn gesundheitliche Bedenken bestehen oder der Kunde die erforderlichen 
                            Informationen nicht bereitstellt.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (4) Bei Wimpernverlängerungen und -liftings ist der Kunde verpflichtet, ohne 
                            Augen-Make-up und mit gereinigten Wimpern zum Termin zu erscheinen.
                        </Text>
                    </Column>

                    {/* 6. Warranty */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            § 6 Gewährleistung und Nachbesserung
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (1) Der Anbieter gewährleistet eine fachgerechte Ausführung der Behandlung.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (2) Bei berechtigten Beanstandungen innerhalb von 48 Stunden nach der Behandlung 
                            wird eine kostenlose Nachbesserung angeboten, sofern die Pflegehinweise befolgt wurden.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (3) Natürlicher Wimpernverlust oder Veränderungen durch unsachgemäße Pflege sind 
                            von der Gewährleistung ausgeschlossen.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (4) Weitergehende Ansprüche, insbesondere auf Schadensersatz, sind ausgeschlossen, 
                            soweit nicht Vorsatz oder grobe Fahrlässigkeit vorliegt.
                        </Text>
                    </Column>

                    {/* 7. Care Instructions */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            § 7 Pflegehinweise
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (1) Der Kunde erhält nach der Behandlung Pflegehinweise, deren Befolgung für die 
                            Haltbarkeit und das Ergebnis der Behandlung wesentlich ist.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (2) Bei Nichtbeachtung der Pflegehinweise entfallen Gewährleistungsansprüche.
                        </Text>
                    </Column>

                    {/* 8. Liability */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            § 8 Haftung
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (1) Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des Lebens, 
                            des Körpers oder der Gesundheit, die auf einer fahrlässigen oder vorsätzlichen 
                            Pflichtverletzung beruhen.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (2) Für sonstige Schäden haftet der Anbieter nur bei Vorsatz oder grober 
                            Fahrlässigkeit sowie bei schuldhafter Verletzung wesentlicher Vertragspflichten.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (3) Der Anbieter haftet nicht für Schäden, die durch falsche Angaben des Kunden 
                            zu Allergien oder gesundheitlichen Einschränkungen entstehen.
                        </Text>
                    </Column>

                    {/* 9. Data Protection */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            § 9 Datenschutz
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Die Erhebung und Verarbeitung personenbezogener Daten erfolgt gemäß der 
                            Datenschutzerklärung, die unter{' '}
                            <SmartLink href="/datenschutz">www.lmbeauty.de/datenschutz</SmartLink>{' '}
                            abrufbar ist.
                        </Text>
                    </Column>

                    {/* 10. Final Provisions */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            § 10 Schlussbestimmungen
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (1) Es gilt das Recht der Bundesrepublik Deutschland.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (2) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt 
                            die Wirksamkeit der übrigen Bestimmungen unberührt.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            (3) Gerichtsstand für alle Streitigkeiten aus dem Vertragsverhältnis ist, soweit 
                            gesetzlich zulässig, Oldenburg.
                        </Text>
                    </Column>

                    {/* Contact */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            Kontakt
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Bei Fragen zu diesen AGB wenden Sie sich bitte an:
                        </Text>
                        <Column gap="xs">
                            <Text variant="body-default-m">LM Beauty</Text>
                            <Text variant="body-default-m">Lisa Marie Pinske</Text>
                            <Text variant="body-default-m">
                                E-Mail: <SmartLink href="mailto:info@lmbeauty.de">info@lmbeauty.de</SmartLink>
                            </Text>
                            <Text variant="body-default-m">
                                Telefon: <SmartLink href="tel:+4915259675346">+49 152 59675346</SmartLink>
                            </Text>
                        </Column>
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
