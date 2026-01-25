"use client";

import React, { useState, useEffect } from 'react';
import { Background, Column, Flex, Heading, RevealFx, Text, CompareImage, Spinner } from '@once-ui-system/core';
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

interface BeforeAfterImages {
    before: string;
    after: string;
}

export const AftermathSection: React.FC = () => {
    const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.15 });
    const [beforeAfterImages, setBeforeAfterImages] = useState<BeforeAfterImages | null>(null);
    const [isLoadingImages, setIsLoadingImages] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        
        const fetchBeforeAfterImages = async () => {
            try {
                setIsLoadingImages(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 
                              (process.env.NEXT_PUBLIC_BACKEND_URL ? process.env.NEXT_PUBLIC_BACKEND_URL + '/api' : 'https://api.lmbeauty.de/api');
                
                const response = await fetch(`${apiUrl}/frontend/instagram/posts`);
                const result = await response.json();
                
                if (result.success && result.data) {
                    // Get all posts from all categories
                    const allPosts = Object.values(result.data).flat() as any[];
                    
                    // Filter posts that have "Vorher" and "Nachher" in caption
                    const beforeAfterPosts = allPosts.filter(post => 
                        post.caption && 
                        post.caption.toLowerCase().includes('vorher') && 
                        post.caption.toLowerCase().includes('nachher')
                    );
                    
                    // Use first two consecutive posts as before/after pair
                    if (beforeAfterPosts.length >= 2) {
                        setBeforeAfterImages({
                            before: beforeAfterPosts[0].mediaUrl || beforeAfterPosts[0].media_url,
                            after: beforeAfterPosts[1].mediaUrl || beforeAfterPosts[1].media_url
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to fetch before/after images:', error);
            } finally {
                setIsLoadingImages(false);
            }
        };
        
        fetchBeforeAfterImages();
    }, [isMounted]);

    // Use Instagram images if available, otherwise fallback to static images
    const leftImage = beforeAfterImages?.before || "/images/before-lashes.jpg";
    const rightImage = beforeAfterImages?.after || "/images/after-lashes.jpg";

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
                                {!isMounted || isLoadingImages ? (
                                    <Column center padding="xl" aspectRatio="4 / 3" background="neutral-alpha-weak" radius="l">
                                        {isMounted && <Spinner size="m" />}
                                    </Column>
                                ) : (
                                    <>
                                        <CompareImage
                                            radius="l"
                                            border="brand-alpha-medium"
                                            overflow="hidden"
                                            aspectRatio="4 / 3"
                                            leftContent={{ 
                                                src: leftImage, 
                                                alt: "Vorher"
                                            }}
                                            rightContent={{ 
                                                src: rightImage, 
                                                alt: "Nachher"
                                            }}
                                        />
                                        <Text variant="body-default-xs" onBackground="brand-medium" align="center" style={{ fontStyle: 'italic' }}>
                                            Ziehe den Regler, um den Unterschied zu sehen
                                        </Text>
                                    </>
                                )}
                            </Column>
                        </RevealFx>
                    </Column>
                </Flex>
            </Column>
        </Column>
    );
};

export default AftermathSection;
