'use client';

import React, {useEffect, useState} from 'react';
import {Background, Button, Column, Flex, Heading, Icon, Row, Text} from '@once-ui-system/core';
import styles from './faq.module.scss';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQCategory {
    title: string;
    icon: 'calendar' | 'sparkles' | 'heart' | 'tag' | 'shield' | 'helpCircle';
    items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
    {
        title: 'Vor dem Termin',
        icon: 'calendar',
        items: [
            {
                question: 'Was muss ich vor meinem Termin beachten?',
                answer: 'Komm bitte ohne Augen-Make-up und ohne Kontaktlinsen. Vermeide 24 Stunden vorher ölhaltige Produkte im Augenbereich.'
            },
            {
                question: 'Wie buche ich einen Termin?',
                answer: 'Du kannst direkt über WhatsApp, Telefon oder E-Mail buchen. Ich melde mich schnell zurück und wir finden einen passenden Termin.'
            },
            {
                question: 'Kann ich meinen Termin verschieben?',
                answer: 'Ja, bis 24 Stunden vor dem Termin kannst du kostenlos verschieben oder absagen.'
            },
            {
                question: 'Wie lange vorher sollte ich buchen?',
                answer: 'Am besten 1-2 Wochen im Voraus, besonders für Wochenendtermine. Kurzfristige Termine sind manchmal auch möglich.'
            }
        ]
    },
    {
        title: 'Wimpernverlängerung',
        icon: 'sparkles',
        items: [
            {
                question: 'Wie lange hält eine Wimpernverlängerung?',
                answer: 'Eine Wimpernverlängerung hält 4-6 Wochen, abhängig von deinem natürlichen Wimpernzyklus und der Pflege. Mit regelmäßigen Refills alle 3-4 Wochen bleiben deine Wimpern dauerhaft perfekt.'
            },
            {
                question: 'Tut die Behandlung weh?',
                answer: 'Nein, die Behandlung ist völlig schmerzfrei. Du liegst entspannt mit geschlossenen Augen. Viele Kundinnen schlafen sogar während der Behandlung ein.'
            },
            {
                question: 'Welche Technik ist die richtige für mich?',
                answer: 'Das hängt von deinem Wunsch-Look und deinen Naturwimpern ab. Einzeltechnik ist natürlich und alltagstauglich, Hybrid bietet mehr Volumen bei natürlichem Look, Volumen ist glamourös und dramatisch. Wir besprechen das vor der Behandlung.'
            },
            {
                question: 'Schädigt die Verlängerung meine Naturwimpern?',
                answer: 'Bei fachgerechter Anwendung und richtiger Pflege werden deine Naturwimpern nicht beschädigt. Ich arbeite mit hochwertigen Produkten und achte darauf, dass jede Extension einzeln und mit dem richtigen Gewicht aufgebracht wird.'
            },
            {
                question: 'Wie lange dauert die Behandlung?',
                answer: 'Die Erstbehandlung dauert 2-3 Stunden, je nach gewählter Technik. Refills dauern 1-2 Stunden. Nimm dir Zeit und genieße die Entspannung.'
            },
            {
                question: 'Kann ich Mascara verwenden?',
                answer: 'Du brauchst normalerweise keine Mascara mehr. Falls doch, verwende nur ölfreie Mascara und trage sie nur auf die Spitzen auf. Wasserfeste Mascara solltest du vermeiden.'
            }
        ]
    },
    {
        title: 'Wimpernlifting',
        icon: 'helpCircle',
        items: [
            {
                question: 'Was ist der Unterschied zwischen Lifting und Verlängerung?',
                answer: 'Beim Lifting werden deine eigenen Wimpern geschwungen und gefärbt – keine Extensions. Es ist pflegeleichter, hält 6-8 Wochen und kostet nur 49€. Perfekt für natürliche Looks.'
            },
            {
                question: 'Warum sollte ich ein Wimpernlifting machen?',
                answer: 'Ein Wimpernlifting ist wie eine Dauerwelle für deine Wimpern – es bringt sie dauerhaft in Form, ohne dass du täglich zur Zange greifen musst. Deine Wimpern werden direkt am Ansatz nach oben geliftet, wodurch sie viel länger wirken. Der Lifting-Effekt öffnet das Auge optisch und lässt dich sofort frischer und jugendlicher aussehen.'
            },
            {
                question: 'Wie lange hält ein Wimpernlifting?',
                answer: 'Ein professionelles Lifting hält in der Regel 6 bis 8 Wochen, was dem natürlichen Wachstumszyklus deiner Wimpern entspricht. Nach den ersten 24 Stunden kannst du wieder wie gewohnt Sport treiben, in die Sauna gehen oder schwimmen.'
            },
            {
                question: 'Spare ich wirklich Zeit am Morgen?',
                answer: 'Ja! Da der Schwung bereits perfekt ist, entfällt das Biegen mit der Wimpernzange; oft ist nicht einmal mehr Mascara nötig. Das spart dir jeden Morgen wertvolle Minuten.'
            },
            {
                question: 'Ist Wimpernlifting schonender als Extensions?',
                answer: 'Absolut. Im Vergleich zu Extensions wird kein zusätzliches Gewicht (Kunsthaar) auf deine Wimpern geklebt, was die Haarwurzel schont. Meistens werden die Wimpern im Prozess direkt mitgefärbt, was für ein sattes Schwarz sorgt und feine Spitzen sichtbar macht.'
            },
            {
                question: 'Ist Wimpernlifting günstiger als Extensions?',
                answer: 'Ja, auf Dauer ist es oft preiswerter. Da die Abstände zwischen den Terminen größer sind als bei Extensions-Refills (6-8 Wochen statt 2-3 Wochen), sparst du langfristig Geld.'
            },
            {
                question: 'Kann ich nach dem Lifting Mascara tragen?',
                answer: 'Ja, nach 24 Stunden kannst du wieder Mascara verwenden. Oft ist das aber gar nicht nötig, da die Wimpern durch die Färbung schon sehr ausdrucksstark sind.'
            },
            {
                question: 'Tut Wimpernlifting weh?',
                answer: 'Nein. Die Behandlung ist schmerzfrei und entspannend. Du liegst bequem, die Augen sind geschlossen. Viele Kundinnen schlafen sogar ein.'
            },
            {
                question: 'Was muss ich in den ersten 24 Stunden beachten?',
                answer: 'In den ersten 24 Stunden nach der Behandlung ist es essenziell, dass kein Wasser, Dampf oder Schweiß an die Wimpern kommt, damit die Struktur stabil bleibt. Danach ist alles wieder erlaubt.'
            },
            {
                question: 'Wie pflege ich meine Wimpern nach dem Lifting?',
                answer: 'Nach den ersten 24 Stunden kannst du deine Wimpern ganz normal behandeln. Für besonders lange Haltbarkeit empfehle ich ein Wimpernserum mit Keratin und sanftes Bürsten mit einem sauberen Bürstchen.'
            },
            {
                question: 'Für wen ist Wimpernlifting nicht geeignet?',
                answer: 'Bei sehr kurzen oder feinen Wimpern ist der Effekt kaum sichtbar – ähnlich wie bei einem Push-up-BH muss eine gewisse Basis vorhanden sein. Bei Augenentzündungen, Bindehautentzündungen, Lidrandentzündungen oder Gerstenkörnern darf die Behandlung keinesfalls durchgeführt werden.'
            },
            {
                question: 'Kann ich nach einer Augen-OP ein Wimpernlifting machen?',
                answer: 'Nach Laser-OPs oder anderen Eingriffen am Auge solltest du mindestens 6–12 Monate warten. Eine Rücksprache mit deinem Arzt ist hier unbedingt nötig.'
            },
            {
                question: 'Funktioniert es während der Schwangerschaft?',
                answer: 'Während der Schwangerschaft oder Stillzeit kann es vorkommen, dass das Lifting aufgrund der Hormone nicht optimal hält oder die Wimpern anders reagieren. Es ist nicht gefährlich, aber das Ergebnis kann variieren.'
            },
            {
                question: 'Werden Lücken in den Wimpern aufgefüllt?',
                answer: 'Nein, das Lifting biegt nur vorhandene Haare. Lücken werden dadurch nicht aufgefüllt, sondern sind eventuell sogar deutlicher sichtbar.'
            },
            {
                question: 'Was passiert, wenn neue Wimpern nachwachsen?',
                answer: 'Wenn die gelifteten Wimpern ausfallen und neue, gerade Haare nachwachsen, kann der Look nach ca. 5 Wochen ungleichmäßig wirken (Knick-Optik). Das ist normal und ein Zeichen, dass es Zeit für eine Auffrischung ist.'
            }
        ]
    },
    {
        title: 'Pflege & Haltbarkeit',
        icon: 'heart',
        items: [
            {
                question: 'Wie pflege ich meine Wimpern richtig?',
                answer: 'Die ersten 24-48 Stunden kein Wasser. Danach täglich mit einem sauberen Bürstchen kämmen und ölfreie Produkte verwenden. Vermeide mechanisches Reiben.'
            },
            {
                question: 'Kann ich mit Extensions schwimmen gehen?',
                answer: 'Ja, nach 24-48 Stunden ist das kein Problem. Chlor- und Salzwasser können die Haltbarkeit etwas verkürzen, aber die Extensions sind wasserfest.'
            },
            {
                question: 'Wann sollte ich zum Refill kommen?',
                answer: 'Idealerweise alle 3-4 Wochen. Wenn mehr als 50% ausgefallen sind, ist ein Neuaufbau nötig. Je regelmäßiger, desto günstiger.'
            },
            {
                question: 'Was kostet ein Refill?',
                answer: 'Refills kosten je nach Zeitabstand zwischen 45€ und 75€. Je regelmäßiger du kommst (alle 3-4 Wochen), desto günstiger. Genaue Preise besprechen wir beim Ersttermin.'
            }
        ]
    },
    {
        title: 'Preise & Buchung',
        icon: 'tag',
        items: [
            {
                question: 'Was kostet eine Wimpernverlängerung?',
                answer: 'Einzeltechnik 89€, Hybrid 99€, Volumen 109€. Wimpernlifting kostet 49€. Alle Preise inkl. Beratung und Nachsorge.'
            },
            {
                question: 'Wie kann ich bezahlen?',
                answer: 'Bar, EC-Karte oder PayPal — ganz wie du möchtest. Die Zahlung erfolgt nach der Behandlung.'
            },
            {
                question: 'Gibt es Rabatte oder Pakete?',
                answer: 'Ja! Mit der Stempelkarte bekommst du nach 10 Behandlungen eine gratis. Frag mich nach aktuellen Angeboten.'
            }
        ]
    },
    {
        title: 'Sicherheit & Verträglichkeit',
        icon: 'shield',
        items: [
            {
                question: 'Sind Wimpernextensions schädlich?',
                answer: 'Nein, wenn sie professionell angebracht werden. Ich achte darauf, dass jede Extension einzeln geklebt wird und das Gewicht passt.'
            },
            {
                question: 'Kann ich allergisch reagieren?',
                answer: 'Allergien sind selten, aber möglich. Wenn du empfindlich bist, machen wir vorher einen Patch-Test. Wenn du empfindlich auf Dauerwellen-Lotionen oder Wimpernfarbe reagierst, ist Vorsicht geboten.'
            },
            {
                question: 'Ich habe empfindliche Augen — ist das ein Problem?',
                answer: 'Nicht unbedingt. Sag mir vorher Bescheid, dann verwende ich besonders sanfte Produkte.'
            },
            {
                question: 'Welche Produkte verwendest du?',
                answer: 'Ich arbeite nur mit hochwertigen, geprüften Produkten. Alle Materialien sind hypoallergen und dermatologisch getestet.'
            },
            {
                question: 'Wie hygienisch ist die Behandlung?',
                answer: 'Hygiene hat oberste Priorität. Ich arbeite nach §43 IfSG mit sterilen Einwegmaterialien und desinfiziere alle Werkzeuge.'
            }
        ]
    }
];

export default function FAQPage() {
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleItem = (key: string) => {
        setOpenItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <Flex
            as="main"
            fillWidth
            direction="column"
            paddingY="xl"
            paddingX="l"
            horizontal="center"
            vertical="center"
        >
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

            <Column fillWidth maxWidth={64} gap="xl" style={{position: 'relative', zIndex: 1}}>
                {/* Hero */}
                <Column fillWidth gap="l" horizontal="center" vertical="center" paddingY="xl">
                    <Column gap="m" horizontal="center" vertical="center">
                        <Icon name="helpCircle" size="xl" onBackground="brand-strong"/>
                        <Column gap="s" horizontal="center">
                            <Heading as="h1" variant="display-strong-l" onBackground="brand-strong" align="center">
                                Häufige Fragen zu Wimpernverlängerung & Wimpernlifting
                            </Heading>
                            <Flex className={styles.headlineUnderline}/>
                        </Column>
                        <Column maxWidth="m" horizontal="center">
                            <Text variant="body-default-l" onBackground="brand-medium" align="center">
                                Alle Antworten zu Wimpernverlängerung, Wimpernlifting, Pflege und Preisen in
                                Oldenburg — ehrlich und verständlich erklärt
                            </Text>
                        </Column>
                    </Column>
                </Column>

                {/* FAQ Categories */}
                <Column fillWidth gap="xl">
                    {faqCategories.map((category, categoryIndex) => (
                        <Column key={categoryIndex} fillWidth gap="l">
                            <Row gap="m" vertical="center">
                                <Flex
                                    padding="s"
                                    background="brand-alpha-weak"
                                    radius="m"
                                    horizontal="center"
                                    vertical="center"
                                >
                                    <Icon name={category.icon} size="m" onBackground="brand-strong"/>
                                </Flex>
                                <Heading as="h2" variant="heading-strong-l" onBackground="brand-strong">
                                    {category.title}
                                </Heading>
                            </Row>

                            <Column fillWidth gap="s">
                                {category.items.map((item, itemIndex) => {
                                    const key = `${categoryIndex}-${itemIndex}`;
                                    const isOpen = mounted && openItems[key] === true;

                                    return (
                                        <article
                                            key={key}
                                            itemScope
                                            itemType="https://schema.org/Question"
                                            className={styles.faqArticle}
                                        >
                                            <Column
                                                fillWidth
                                                background="surface"
                                                border="brand-alpha-weak"
                                                radius="l"
                                                className={styles.faqItem}
                                            >
                                                <button
                                                    onClick={() => toggleItem(key)}
                                                    className={styles.faqButton}
                                                    aria-expanded={isOpen}
                                                >
                                                    <Row fillWidth horizontal="between" vertical="center" gap="m"
                                                         padding="m">
                                                        <Text
                                                            variant="heading-default-m"
                                                            onBackground="brand-strong"
                                                            itemProp="name"
                                                        >
                                                            {item.question}
                                                        </Text>
                                                        <Icon
                                                            name={isOpen ? 'chevronUp' : 'chevronDown'}
                                                            size="s"
                                                            onBackground="brand-medium"
                                                        />
                                                    </Row>
                                                </button>
                                                {isOpen && (
                                                    <div itemScope itemProp="acceptedAnswer"
                                                         itemType="https://schema.org/Answer">
                                                        <Column paddingX="m" paddingBottom="m">
                                                            <Text
                                                                variant="body-default-m"
                                                                onBackground="brand-medium"
                                                                itemProp="text"
                                                            >
                                                                {item.answer}
                                                            </Text>
                                                        </Column>
                                                    </div>
                                                )}
                                            </Column>
                                        </article>
                                    );
                                })}
                            </Column>
                        </Column>
                    ))}
                </Column>

                {/* CTA */}
                <Column
                    fillWidth
                    gap="l"
                    horizontal="center"
                    vertical="center"
                    paddingY="xl"
                    paddingX="l"
                    background="brand-alpha-weak"
                    radius="xl"
                    border="brand-alpha-medium"
                >
                    <Icon name="messageCircle" size="l" onBackground="brand-strong"/>
                    <Column gap="s" horizontal="center" maxWidth="xs">
                        <Heading as="h2" variant="heading-strong-l" onBackground="brand-strong" align="center">
                            Noch Fragen?
                        </Heading>
                        <Text variant="body-default-m" onBackground="brand-medium" align="center">
                            Schreib mir einfach — ich antworte dir persönlich und helfe dir gerne weiter.
                        </Text>
                    </Column>
                    <Row gap="m" wrap horizontal="center">
                        <Button href="/#contact" size="l" variant="primary">
                            Termin buchen
                        </Button>
                        <Button href="/#contact" size="l" variant="secondary">
                            Kontakt
                        </Button>
                        <Button href="/" size="l" variant="tertiary">
                            ← Startseite
                        </Button>
                    </Row>
                </Column>
            </Column>
        </Flex>
    );
}
