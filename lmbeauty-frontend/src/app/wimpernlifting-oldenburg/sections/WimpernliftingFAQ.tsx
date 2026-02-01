"use client";

import React, { useState } from 'react';
import { Background, Column, Flex, Heading, Text, Icon } from '@once-ui-system/core';
import styles from './WimpernliftingFAQ.module.scss';

const faqs = [
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
        question: 'Für wen ist Wimpernlifting nicht geeignet?',
        answer: 'Bei sehr kurzen oder feinen Wimpern ist der Effekt kaum sichtbar – ähnlich wie bei einem Push-up-BH muss eine gewisse Basis vorhanden sein. Bei Augenentzündungen, Bindehautentzündungen, Lidrandentzündungen oder Gerstenkörnern darf die Behandlung keinesfalls durchgeführt werden.'
    },
    {
        question: 'Kann ich nach einer Augen-OP ein Wimpernlifting machen?',
        answer: 'Nach Laser-OPs oder anderen Eingriffen am Auge solltest du mindestens 6–12 Monate warten. Eine Rücksprache mit deinem Arzt ist hier unbedingt nötig.'
    },
    {
        question: 'Was ist mit Allergien?',
        answer: 'Wenn du empfindlich auf Dauerwellen-Lotionen oder Wimpernfarbe reagierst, ist Vorsicht geboten. Wir machen vorher einen Patch-Test, um sicherzugehen.'
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
    },
    {
        question: 'Was muss ich in den ersten 24 Stunden beachten?',
        answer: 'In den ersten 24 Stunden nach der Behandlung ist es essenziell, dass kein Wasser, Dampf oder Schweiß an die Wimpern kommt, damit die Struktur stabil bleibt. Danach ist alles wieder erlaubt.'
    },
    {
        question: 'Kann ich danach Mascara verwenden?',
        answer: 'Ja, nach 24 Stunden kannst du wieder normal schminken. Viele verzichten aber darauf, weil die Wimpern schon so schön aussehen.'
    },
    {
        question: 'Wie pflege ich meine Wimpern nach dem Lifting?',
        answer: 'Nach den ersten 24 Stunden kannst du deine Wimpern ganz normal behandeln. Für besonders lange Haltbarkeit empfehle ich ein Wimpernserum mit Keratin und sanftes Bürsten mit einem sauberen Bürstchen.'
    },
    {
        question: 'Tut Wimpernlifting weh?',
        answer: 'Nein. Die Behandlung ist schmerzfrei und entspannend. Du liegst bequem, die Augen sind geschlossen. Viele Kundinnen schlafen sogar ein.'
    }
];

export const WimpernliftingFAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <Flex
            as="section"
            id="faq"
            fillWidth
            paddingY="l"
            direction="column"
            horizontal="center"
            style={{ position: 'relative' }}
        >
            <Background
                position="absolute"
                fill
                gradient={{
                    display: true,
                    opacity: 100,
                    x: 50,
                    y: 50,
                    colorStart: "accent-background-weak",
                    colorEnd: "brand-background-weak"
                }}
                mask={{
                    x: 50,
                    y: 50,
                    radius: 100
                }}
                zIndex={0}
                suppressHydrationWarning
            />

            <Column
                fillWidth
                maxWidth={56}
                paddingX="xl"
                gap="l"
                style={{ position: 'relative', zIndex: 1 }}
                s={{maxWidth: 100, paddingX: "l"}}
            >
                <Column gap="m" horizontal="center">
                    <Column gap="2" fitWidth>
                        <Heading as="h2" variant="display-strong-s" onBackground="brand-strong" align="center" style={{ fontWeight: 400 }}>
                            Häufige Fragen
                        </Heading>
                        <Flex className={styles.headlineUnderline} />
                    </Column>
                    <Text variant="heading-strong-l" onBackground="brand-strong" align="center">
                        Alles, was du wissen musst
                    </Text>
                </Column>

                <Column gap="0" className={styles.faqList} style={{ marginTop: '32px' }}>
                    {faqs.map((faq, index) => (
                        <Flex
                            key={index}
                            className={`${styles.faqItem} ${openIndex === index ? styles.open : ''}`}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        >
                            <Column gap="m" fillWidth>
                                <Flex fillWidth horizontal="between" vertical="center">
                                    <Text variant="heading-strong-m" onBackground="brand-strong">
                                        {faq.question}
                                    </Text>
                                    <Icon 
                                        name={openIndex === index ? 'chevronUp' : 'chevronDown'} 
                                        size="m" 
                                        onBackground="brand-medium"
                                        className={styles.icon}
                                    />
                                </Flex>
                                {openIndex === index && (
                                    <Text 
                                        variant="body-default-m" 
                                        onBackground="brand-medium"
                                        style={{ lineHeight: 1.7 }}
                                        className={styles.answer}
                                    >
                                        {faq.answer}
                                    </Text>
                                )}
                            </Column>
                        </Flex>
                    ))}
                </Column>
            </Column>
        </Flex>
    );
};

export default WimpernliftingFAQ;
