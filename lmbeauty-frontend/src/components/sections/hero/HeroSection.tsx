"use client";

import {HeroContent} from './HeroContent';
import {ScrollIndicator} from './ScrollIndicator';
import {Background, Column, Fade, Flex} from "@once-ui-system/core";

export function Hero() {
    return (
        <Flex
            zIndex={1}
            fillWidth
            direction="column"
            center
            aria-label="Willkommen bei LM Beauty"
            role="banner"
            style={{
                minHeight: "100vh",
            }}
        >
            <Column
                position="absolute"
                fill
                zIndex={0}
                style={{
                    minHeight: "100vh",
                    overflow: "hidden"
                }}
                background="surface"
                opacity={20}
            >
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    style={{
                        minHeight: "100vh",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        position: "absolute",
                        top: 0,
                        left: 0
                    }}
                >
                    <source src="/videos/lmbeauty_store.mp4" type="video/mp4" />
                </video>
            </Column>

            <Background
                position="absolute"
                fill
                gradient={{
                    display: true,
                    opacity: 90,
                    x: 50,
                    y: 50,
                    colorStart: "brand-background-weak",
                    colorEnd: "accent-background-weak"
                }}
                mask={{
                    x: 75,
                    y: 50,
                    radius: 140
                }}
                zIndex={1}
            />

            <Fade
                fillWidth
                position="absolute"
                top="0"
                to="bottom"
                height={12}
                style={{zIndex: 2}}
            />

            <Column
                fillWidth
                maxWidth={48}
                gap="xl"
                paddingX="l"
                m={{maxWidth: 100, paddingX: "m"}}
                s={{paddingX: "s"}}
                style={{zIndex: 3}}
            >
                <HeroContent/>
            </Column>

            <ScrollIndicator/>
        </Flex>
    );
}

export default Hero;
