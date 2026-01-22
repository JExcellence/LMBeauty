import { Column, Flex, Heading, Text, SmartLink, Row } from "@once-ui-system/core";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Datenschutzerklärung | LM Beauty",
    description: "Datenschutzerklärung von LM Beauty - Informationen zum Umgang mit Ihren personenbezogenen Daten",
};

/**
 * Datenschutz Page — Privacy Policy (DSGVO Compliant)
 * 
 * Compliant with:
 * - DSGVO (EU-Datenschutz-Grundverordnung)
 * - BDSG (Bundesdatenschutzgesetz)
 * - TDDDG (Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz)
 */
export default function DatenschutzPage() {
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
                            Datenschutzerklärung
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Stand: Dezember 2024
                        </Text>
                    </Column>

                    {/* 1. Overview */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            1. Datenschutz auf einen Blick
                        </Heading>
                        
                        <Heading as="h3" variant="heading-default-s">
                            Allgemeine Hinweise
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren 
                            personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene 
                            Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                        </Text>

                        <Heading as="h3" variant="heading-default-s">
                            Datenerfassung auf dieser Website
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
                            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen 
                            Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            <strong>Wie erfassen wir Ihre Daten?</strong><br />
                            Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann 
                            es sich z.B. um Daten handeln, die Sie bei einer Terminbuchung eingeben. Andere Daten 
                            werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere 
                            IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, 
                            Betriebssystem oder Uhrzeit des Seitenaufrufs).
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            <strong>Wofür nutzen wir Ihre Daten?</strong><br />
                            Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu 
                            gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            <strong>Welche Rechte haben Sie bezüglich Ihrer Daten?</strong><br />
                            Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und 
                            Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein 
                            Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine 
                            Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung 
                            jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten 
                            Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
                        </Text>
                    </Column>

                    {/* 2. Responsible Party */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            2. Verantwortliche Stelle
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Verantwortlich für die Datenverarbeitung auf dieser Website ist:
                        </Text>
                        <Column gap="xs">
                            <Text variant="body-default-m">LM Beauty</Text>
                            <Text variant="body-default-m">Lisa Marie Pinske</Text>
                            <Text variant="body-default-m">Bloherfelderstraße 40</Text>
                            <Text variant="body-default-m">26129 Oldenburg</Text>
                            <Text variant="body-default-m">Deutschland</Text>
                        </Column>
                        <Column gap="xs">
                            <Text variant="body-default-m">
                                Telefon: <SmartLink href="tel:+4915259675346">+49 152 59675346</SmartLink>
                            </Text>
                            <Text variant="body-default-m">
                                E-Mail: <SmartLink href="mailto:info@lmbeauty.de">info@lmbeauty.de</SmartLink>
                            </Text>
                        </Column>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder 
                            gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen 
                            Daten (z.B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
                        </Text>
                    </Column>

                    {/* 3. Data Collection */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            3. Datenerfassung auf dieser Website
                        </Heading>

                        <Heading as="h3" variant="heading-default-s">
                            Server-Log-Dateien
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten 
                            Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
                        </Text>
                        <Column gap="xs" paddingLeft="m">
                            <Text variant="body-default-m" onBackground="neutral-weak">• Browsertyp und Browserversion</Text>
                            <Text variant="body-default-m" onBackground="neutral-weak">• Verwendetes Betriebssystem</Text>
                            <Text variant="body-default-m" onBackground="neutral-weak">• Referrer URL</Text>
                            <Text variant="body-default-m" onBackground="neutral-weak">• Hostname des zugreifenden Rechners</Text>
                            <Text variant="body-default-m" onBackground="neutral-weak">• Uhrzeit der Serveranfrage</Text>
                            <Text variant="body-default-m" onBackground="neutral-weak">• IP-Adresse</Text>
                        </Column>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. 
                            Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
                        </Text>

                        <Heading as="h3" variant="heading-default-s">
                            Kontaktaufnahme
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Wenn Sie uns per E-Mail, Telefon oder WhatsApp kontaktieren, wird Ihre Anfrage 
                            inklusive aller daraus hervorgehenden personenbezogenen Daten (Name, Anfrage) zum 
                            Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Diese 
                            Daten geben wir nicht ohne Ihre Einwilligung weiter.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, 
                            sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur 
                            Durchführung vorvertraglicher Maßnahmen erforderlich ist.
                        </Text>

                        <Heading as="h3" variant="heading-default-s">
                            Terminbuchung
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Bei der Buchung eines Termins erheben wir folgende Daten:
                        </Text>
                        <Column gap="xs" paddingLeft="m">
                            <Text variant="body-default-m" onBackground="neutral-weak">• Name</Text>
                            <Text variant="body-default-m" onBackground="neutral-weak">• Telefonnummer</Text>
                            <Text variant="body-default-m" onBackground="neutral-weak">• E-Mail-Adresse (optional)</Text>
                            <Text variant="body-default-m" onBackground="neutral-weak">• Gewünschte Behandlung</Text>
                            <Text variant="body-default-m" onBackground="neutral-weak">• Terminwunsch</Text>
                        </Column>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Diese Daten werden ausschließlich zur Terminvereinbarung und -durchführung verwendet. 
                            Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
                        </Text>
                    </Column>

                    {/* 4. Social Media */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            4. Soziale Medien
                        </Heading>

                        <Heading as="h3" variant="heading-default-s">
                            Instagram
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Auf dieser Website sind Funktionen des Dienstes Instagram eingebunden. Diese Funktionen 
                            werden angeboten durch die Meta Platforms Ireland Limited, 4 Grand Canal Square, Grand 
                            Canal Harbour, Dublin 2, Irland.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Wenn Sie in Ihrem Instagram-Account eingeloggt sind, können Sie durch Anklicken des 
                            Instagram-Buttons die Inhalte dieser Website mit Ihrem Instagram-Profil verlinken. 
                            Dadurch kann Instagram den Besuch dieser Website Ihrem Benutzerkonto zuordnen.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Weitere Informationen hierzu finden Sie in der Datenschutzerklärung von Instagram:{' '}
                            <SmartLink href="https://instagram.com/about/legal/privacy/" target="_blank" rel="noopener noreferrer">
                                https://instagram.com/about/legal/privacy/
                            </SmartLink>
                        </Text>

                        <Heading as="h3" variant="heading-default-s">
                            WhatsApp
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Für die Kommunikation bieten wir WhatsApp an. WhatsApp ist ein Dienst der WhatsApp 
                            Ireland Limited, 4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Irland. Bei 
                            der Nutzung von WhatsApp werden Ihre Daten (z.B. Telefonnummer, Nachrichteninhalt) 
                            an WhatsApp übermittelt.
                        </Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Weitere Informationen finden Sie in der Datenschutzerklärung von WhatsApp:{' '}
                            <SmartLink href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                                https://www.whatsapp.com/legal/privacy-policy
                            </SmartLink>
                        </Text>
                    </Column>

                    {/* 5. Your Rights */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            5. Ihre Rechte
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden 
                            personenbezogenen Daten:
                        </Text>
                        <Column gap="xs" paddingLeft="m">
                            <Text variant="body-default-m" onBackground="neutral-weak">• Recht auf Auskunft (Art. 15 DSGVO)</Text>
                            <Text variant="body-default-m" onBackground="neutral-weak">• Recht auf Berichtigung (Art. 16 DSGVO)</Text>
                            <Text variant="body-default-m" onBackground="neutral-weak">• Recht auf Löschung (Art. 17 DSGVO)</Text>
                            <Text variant="body-default-m" onBackground="neutral-weak">• Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</Text>
                            <Text variant="body-default-m" onBackground="neutral-weak">• Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</Text>
                            <Text variant="body-default-m" onBackground="neutral-weak">• Widerspruchsrecht (Art. 21 DSGVO)</Text>
                        </Column>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die 
                            Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren.
                        </Text>
                    </Column>

                    {/* 6. Data Retention */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            6. Speicherdauer
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Sofern innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt 
                            wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die 
                            Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen 
                            oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, 
                            sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer 
                            personenbezogenen Daten haben.
                        </Text>
                    </Column>

                    {/* 7. SSL/TLS */}
                    <Column gap="m">
                        <Heading as="h2" variant="heading-default-m">
                            7. SSL- bzw. TLS-Verschlüsselung
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher 
                            Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen 
                            Sie daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt 
                            und an dem Schloss-Symbol in Ihrer Browserzeile.
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
