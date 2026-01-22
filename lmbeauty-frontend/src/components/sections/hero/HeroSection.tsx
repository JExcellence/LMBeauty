"use client";

import { HeroContent } from './HeroContent';
import { ScrollIndicator } from './ScrollIndicator';
import { Column, Flex, Background, Fade } from "@once-ui-system/core";
import styles from './HeroSection.module.scss';

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
        position: "relative",
      }}
    >
      {/* Video Background - using native video for autoplay support */}
      <Column
        position="absolute"
        fill
        zIndex={0}
        className={styles.videoContainer}
        overflow="hidden"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className={styles.videoBackground}
        >
          <source src="/videos/lmbeauty_store_full_hd.mp4" type="video/mp4" />
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
        style={{ zIndex: 2 }}
      />
      
      <Column
        fillWidth
        maxWidth={48}
        gap="xl"
        horizontal="center"
        paddingX="l"
        m={{ maxWidth: 100, paddingX: "m" }}
        s={{ paddingX: "s" }}
        style={{ zIndex: 3 }}
      >
        <HeroContent />
      </Column>

      <ScrollIndicator />
    </Flex>
  );
}

export default Hero;
