"use client";

import React, { useState } from 'react';
import { Column, Flex, Heading, Icon, Text } from '@once-ui-system/core';
import styles from './WimpernliftingFAQ.module.scss';

const faqs = [
    {
        question: 'Wie lange hält eine Wimpernverlängerung?',
        answer: 'Eine Wimpernverlängerung hält 4-6 Wochen, abhängig von deinem natürlichen Wimpernzyklus und der Pflege. Mit regelmäßigen Refills alle 3-4 Wochen bleiben deine Wimpern dauerhaft perfekt.'
    },
    {
        question: 'Tut die Behandlung weh?',
        answer: 'Nein, die Behandlung ist völlig schmerzfrei. Du liegst entspannt mit geschlossenen Augen. Viele Kundinnen schlafen sogar während der Behandlung ein.'
    },
    {
        question: 'Schädigt die Verlängerung meine Naturwimpern?',
        answer: 'Bei fachgerechter Anwendung und richtiger Pflege werden deine Naturwimpern nicht beschädigt. Ich arbeite mit hochwertigen Produkten und achte darauf, dass jede Extension einzeln und mit dem richtigen Gewicht aufgebracht wird.'
    },
    {
        question: 'Kann ich mit Extensions schwimmen gehen?',
        answer: 'Ja! Nach den ersten 24-48 Stunden sind die Extensions wasserfest. Du kannst schwimmen, duschen, Sport machen und in die Sauna gehen. Vermeide nur übermäßiges Reiben.'
    },
    {
        question: 'Welche Technik ist die richtige für mich?',
        answer: 'Das hängt von deinem Wunsch-Look und deinen Naturwimpern ab. Einzeltechnik ist natürlich und alltagstauglich, Hybrid bietet mehr Volumen bei natürlichem Look, Volumen ist glamourös und dramatisch. Wir besprechen das vor der Behandlung.'
    },
    {
        question: 'Was kostet ein Refill?',
        answer: 'Refills kosten je nach Zeitabstand zwischen 45€ und 75€. Je regelmäßiger du kommst (alle 3-4 Wochen), desto günstiger. Genaue Preise besprechen wir beim Ersttermin.'
    },
    {
        question: 'Kann ich Mascara verwenden?',
        answer: 'Du brauchst normalerweise keine Mascara mehr. Falls doch, verwende nur ölfreie Mascara und trage sie nur auf die Spitzen auf. Wasserfeste Mascara solltest du vermeiden.'
    },
    {
        question: 'Wie lange dauert die Behandlung?',
        answer: 'Die Erstbehandlung dauert 2-3 Stunden, je nach gewählter Technik. Refills dauern 1-2 Stunden. Nimm dir Zeit und genieße die Entspannung.'
    }
];

export const WimpernverlaengerungFAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <Flex
            as="section"
            id="faq"
            fillWidth
            paddingY="xl"
            direction="column"
            horizontal="center"
        >
            <Column fillWidth maxWidth={56} gap="xl" paddingX="xl" s={{ maxWidth: 100, paddingX: "l" }}>
                <Column gap="xs" center>
                    <Heading as="h2" variant="display-strong-xs" align="center">
                        Häufige <Text as="span" onBackground="brand-weak">Fragen</Text>
                    </Heading>
                    <div className={styles.headlineUnderline}></div>
                </Column>

                <Column gap="s" fillWidth>
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`${styles.faqItem} ${openIndex === index ? styles.open : ''}`}
                            onClick={() => toggleFAQ(index)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggleFAQ(index);
                                }
                            }}
                            aria-expanded={openIndex === index}
                        >
                            <Flex
                                fillWidth
                                horizontal="between"
                                vertical="center"
                                gap="m"
                                className={styles.faqQuestion}
                            >
                                <Text variant="heading-strong-s" onBackground="brand-strong">
                                    {faq.question}
                                </Text>
                                <Icon
                                    name="chevronDown"
                                    size="s"
                                    onBackground="brand-medium"
                                    className={styles.faqIcon}
                                />
                            </Flex>
                            <div className={styles.faqAnswer}>
                                <Text variant="body-default-m" onBackground="brand-medium" style={{ lineHeight: 1.7 }}>
                                    {faq.answer}
                                </Text>
                            </div>
                        </div>
                    ))}
                </Column>
            </Column>
        </Flex>
    );
};

export default WimpernverlaengerungFAQ;
