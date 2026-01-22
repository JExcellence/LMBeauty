"use client";

import React from 'react';
import { Background, Column, Flex, Heading, RevealFx, Text, CompareImage } from '@once-ui-system/core';
import styles from './AftermathSection.module.scss';
import { useScrollReveal } from '@/hooks';

const timeframes = [
    {
        time: 'Morgen früh',
        moment: 'Du wachst auf, gehst ins Bad — und bist fertig.',
        detail: 'Kein Mascara-Ritual. Kein Wimpernzange-Drama. Du siehst einfach so aus.',
    },
    {
        time: 'Nächste Woche',
        moment: 'Du merkst, dass du anders in Spiegel schaust.',
        detail: 'Nicht kritisch. Eher so ein kurzes Lächeln, weil dir gefällt, was du siehst.',
    },
    {
        time: 'Ab jetzt',
        moment: 'Morgens zehn Minuten mehr für dich.',
        detail: 'Für den zweiten Kaffee. Für Ruhe. Für was auch immer du willst.',
    },
];

export const AftermathSection: React.FC = () => {
    const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.15 });

    return (
        <Column
            as="section"
            ref={sectionRef}
            id="aftermath"
            aria-labelledby="aftermath-headline"
            fillWidth
            paddingY="xl"
            paddingX="l"
            horizontal="center"
        >
            <Background
                position="absolute"
                fill
                gradient={{
                    display: true,
                    opacity: 100,
                    x: 50,
                    y: 0,
                    colorStart: "brand-background-strong",
                    colorEnd: "brand-background-weak"
                }}
                mask={{
                    x: 50,
                    y: 0,
                    radius: 100
                }}
                zIndex={0}
            />

            <Column fillWidth maxWidth={80} s={{ maxWidth: 100 }}>
                <Flex 
                    fillWidth 
                    gap="xl" 
                    direction="row"
                    horizontal="start"
                    vertical="start"
                    m={{ direction: "column", gap: "xs" }}
                    className={styles.contentWrapper}
                >
                    <Column fillWidth>
                        <Column gap="l" horizontal="start" paddingTop="l" paddingBottom="m" s={{ paddingBottom: "xs"}}>
                            <Column gap="2" fitWidth>
                                <RevealFx delay={0.2} translateY={20}>
                                    <Heading
                                        as="h2"
                                        id="aftermath-headline"
                                        variant="display-strong-xs"
                                        onBackground="brand-strong"
                                    >
                                        Das ändert sich <Text as="span" onBackground="brand-weak">nachher</Text>
                                    </Heading>
                                </RevealFx>
                                <RevealFx delay={0.25} translateY={20}>
                                    <Flex className={styles.headlineUnderline} />
                                </RevealFx>
                            </Column>
                        </Column>

                        <Column gap="l" fillWidth paddingY="m">
                            {timeframes.map((item, index) => (
                                <RevealFx key={item.time} delay={0.3 + (index * 0.1)} translateY={20}>
                                    <Column
                                        gap="s"
                                        paddingLeft="m"
                                        className={styles.timeframe}
                                    >
                                        <Text variant="label-strong-s" onBackground="brand-medium">
                                            {item.time}
                                        </Text>
                                        <Text variant="heading-default-m" onBackground="neutral-strong">
                                            {item.moment}
                                        </Text>
                                        <Text variant="body-default-m" onBackground="neutral-medium">
                                            {item.detail}
                                        </Text>
                                    </Column>
                                </RevealFx>
                            ))}
                        </Column>

                        <RevealFx delay={0.7} translateY={20}>
                            <Column horizontal="center" paddingTop="m" s={{ paddingTop: "xs" }} className={styles.closingText}>
                                <Text variant="body-default-m" onBackground="brand-weak" align="center" style={{ fontStyle: 'italic' }}>
                                    Keine große Veränderung. Nur du — ein bisschen mehr du.
                                </Text>
                            </Column>
                        </RevealFx>
                    </Column>

                    <Column fillWidth paddingTop="128" m={{ paddingTop: 0}}>
                        <RevealFx delay={0.4} translateY={20}>
                            <Column fillWidth gap="s">
                                <CompareImage
                                    radius="l"
                                    border="brand-alpha-medium"
                                    overflow="hidden"
                                    aspectRatio="4 / 3"
                                    leftContent={{ 
                                        src: "/images/before-lashes.jpg", 
                                        alt: ""
                                    }}
                                    rightContent={{ 
                                        src: "/images/after-lashes.jpg", 
                                        alt: ""
                                    }}
                                />
                                <Text variant="body-default-xs" onBackground="brand-medium" align="center" style={{ fontStyle: 'italic' }}>
                                    Ziehe den Regler, um den Unterschied zu sehen
                                </Text>
                            </Column>
                        </RevealFx>
                    </Column>
                </Flex>
            </Column>
        </Column>
    );
};

export default AftermathSection;
