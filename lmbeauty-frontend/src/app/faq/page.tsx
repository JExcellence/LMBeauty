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
    icon: 'calendar' | 'sparkles' | 'heart' | 'tag' | 'shield';
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
        title: 'Während der Behandlung',
        icon: 'sparkles',
        items: [
            {
                question: 'Tut das weh?',
                answer: 'Nein, überhaupt nicht. Du liegst entspannt mit geschlossenen Augen. Viele Kundinnen schlafen dabei sogar ein.'
            },
            {
                question: 'Wie lange dauert die Behandlung?',
                answer: 'Einzeltechnik ca. 90-120 Minuten, Hybrid ca. 120-150 Minuten, Volumen ca. 150-180 Minuten. Refills sind kürzer.'
            },
            {
                question: 'Kann ich während der Behandlung mein Handy benutzen?',
                answer: 'Deine Augen müssen geschlossen bleiben. Aber du kannst gerne Musik oder Podcasts über Kopfhörer hören.'
            },
            {
                question: 'Kann ich zwischendurch eine Pause machen?',
                answer: 'Natürlich! Sag einfach Bescheid, wenn du eine kurze Pause brauchst. Dein Komfort ist wichtig.'
            }
        ]
    },
    {
        title: 'Nach der Behandlung',
        icon: 'heart',
        items: [
            {
                question: 'Wie lange halten die Wimpern?',
                answer: 'Bei guter Pflege 2-4 Wochen, abhängig von deinem natürlichen Wimpernzyklus. Danach empfehle ich ein Refill.'
            },
            {
                question: 'Wie pflege ich meine Wimpern richtig?',
                answer: 'Die ersten 24 Stunden kein Wasser. Danach täglich mit einem sauberen Bürstchen kämmen und ölfreie Produkte verwenden.'
            },
            {
                question: 'Kann ich mit Extensions schwimmen gehen?',
                answer: 'Ja, nach 24 Stunden ist das kein Problem. Chlor- und Salzwasser können die Haltbarkeit etwas verkürzen.'
            },
            {
                question: 'Wann sollte ich zum Refill kommen?',
                answer: 'Idealerweise alle 2-3 Wochen. Wenn mehr als 50% ausgefallen sind, ist ein Neuaufbau nötig.'
            },
            {
                question: 'Kann ich Make-up tragen?',
                answer: 'Ja, aber verwende ölfreie Produkte. Wasserfeste Mascara solltest du vermeiden, da sie schwer zu entfernen ist.'
            },
            {
                question: 'Was mache ich, wenn eine Wimper abfällt?',
                answer: 'Das ist normal! Deine Naturwimpern haben einen Zyklus. Nicht ziehen oder zupfen, einfach ausfallen lassen.'
            }
        ]
    },
    {
        title: 'Preise & Buchung',
        icon: 'tag',
        items: [
            {
                question: 'Was kostet eine Wimpernverlängerung?',
                answer: 'Einzeltechnik ab 89€, Hybrid ab 109€, Volumen ab 129€. Refills sind günstiger.'
            },
            {
                question: 'Wie kann ich bezahlen?',
                answer: 'Bar, EC-Karte oder PayPal — ganz wie du möchtest. Die Zahlung erfolgt nach der Behandlung.'
            },
            {
                question: 'Gibt es Rabatte oder Pakete?',
                answer: 'Ja! Mit der Stempelkarte bekommst du nach 10 Behandlungen eine gratis. Frag mich nach aktuellen Angeboten.'
            },
            {
                question: 'Was kostet ein Refill?',
                answer: 'Je nach Zeitabstand: 2 Wochen ab 35€, 3 Wochen ab 45€, 4 Wochen ab 55€. Abhängig vom Zustand.'
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
                answer: 'Allergien sind selten, aber möglich. Wenn du empfindlich bist, machen wir vorher einen Patch-Test.'
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
