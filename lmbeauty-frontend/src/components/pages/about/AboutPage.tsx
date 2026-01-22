"use client";

import React from 'react';
import {Column, Flex, Text, Heading, Timeline, Background} from "@once-ui-system/core";
import styles from './AboutPage.module.scss';
import { useScrollReveal } from '@/hooks';
import { 
  openingContent,
  journeyContent,
  credentialsContent,
  valuesContent,
  studioContent,
  closingContent,
} from './data';

const OpeningMoment: React.FC = () => {
  return (
      <Column
          as="section"
          fillWidth
          horizontal="center"
          padding="xl"
      >
          <Flex
              fillWidth
              maxWidth={80}
              gap="xl"
              direction="row"
              vertical="center"
              m={{ direction: "column", gap: "l" }}
          >
              <Column fillWidth className={styles.openingImage}>
                  <div className={styles.imagePlaceholder}>
                      {openingContent.image.src ? (
                          <img
                              src={openingContent.image.src}
                              alt={openingContent.image.alt}
                              className={styles.portraitImage}
                          />
                      ) : (
                          <Text className={styles.imageInitials}>LM</Text>
                      )}
                  </div>
              </Column>

              <Column fillWidth gap="l">
                  <Column gap="m">
                      <Heading
                          as="h1"
                          variant="display-strong-l"
                          className={styles.openingHeadline}
                      >
                          {openingContent.headline}
                      </Heading>
                      <Text variant="heading-default-m" className={styles.openingSubheadline}>
                          {openingContent.subheadline}
                      </Text>
                  </Column>

                  <Text variant="body-default-l" className={styles.openingIntro}>
                      {openingContent.intro}
                  </Text>
              </Column>
          </Flex>
      </Column>
  );
};

const JourneyMoment: React.FC = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <Flex
      as="section"
      ref={ref}
      fillWidth
      direction="column"
      horizontal="center"
      className={`${styles.journeyMoment} ${isVisible ? styles.visible : ''}`}
    >
      <Column fillWidth maxWidth={80} gap="xl">
        <Heading
          as="h2"
          variant="heading-strong-l"
          className={styles.sectionHeadline}
        >
          {journeyContent.headline}
        </Heading>

        <Timeline
          direction="column"
          size="s"
          className={styles.timeline}
          items={journeyContent.moments.map((moment) => ({
            state: moment.state,
            label: (
              <Text variant="label-default-s" className={styles.timelineLabel}>
                {moment.year}
              </Text>
            ),
            description: (
              <Column gap="xs">
                <Text variant="heading-default-s" className={styles.timelineTitle}>
                  {moment.title}
                </Text>
                <Text variant="body-default-m" className={styles.timelineText}>
                  {moment.text}
                </Text>
              </Column>
            ),
          }))}
        />
      </Column>
    </Flex>
  );
};

const CredentialsMoment: React.FC = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <Flex
      as="section"
      ref={ref}
      fillWidth
      direction="column"
      horizontal="center"
      className={`${styles.credentialsMoment} ${isVisible ? styles.visible : ''}`}
    >
      <Column fillWidth maxWidth={68} gap="xl">
        <Column gap="m">
          <Heading
            as="h2"
            variant="heading-strong-l"
            className={styles.sectionHeadline}
          >
            {credentialsContent.headline}
          </Heading>
          <Text variant="body-default-s" className={styles.credentialsNote}>
            {credentialsContent.note}
          </Text>
        </Column>
        
        <Flex gap="l" direction="row" wrap className={styles.credentialsGrid}>
          {credentialsContent.items.map((item, index) => (
            <Column
              key={index}
              gap="m"
              className={styles.credentialCard}
              style={{ '--item-index': index } as React.CSSProperties}
            >
              <Column gap="xs">
                <Text variant="heading-default-s" className={styles.credentialTitle}>
                  {item.title}
                </Text>
                <Text variant="body-default-s" className={styles.credentialDescription}>
                  {item.description}
                </Text>
              </Column>
              {item.inProgress && (
                <Text variant="label-default-xs" className={styles.credentialBadge}>
                  In Arbeit
                </Text>
              )}
            </Column>
          ))}
        </Flex>
      </Column>
    </Flex>
  );
};

const ValuesMoment: React.FC = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <Flex
      as="section"
      ref={ref}
      fillWidth
      direction="column"
      horizontal="center"
      className={`${styles.valuesMoment} ${isVisible ? styles.visible : ''}`}
    >
      <Column fillWidth maxWidth={68} gap="xl">
        <Heading
          as="h2"
          variant="heading-strong-l"
          className={styles.sectionHeadline}
        >
          {valuesContent.headline}
        </Heading>

        <Flex gap="l" direction="row" wrap className={styles.valuesGrid}>
          {valuesContent.values.map((value, index) => (
            <Column
              key={index}
              gap="m"
              className={styles.valueCard}
              style={{ '--item-index': index } as React.CSSProperties}
            >
              <Text variant="heading-default-s" className={styles.valueTitle}>
                {value.title}
              </Text>
              <Text variant="body-default-m" className={styles.valueText}>
                {value.text}
              </Text>
            </Column>
          ))}
        </Flex>
      </Column>
    </Flex>
  );
};

const StudioMoment: React.FC = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <Flex
      as="section"
      ref={ref}
      fillWidth
      direction="column"
      horizontal="center"
      className={`${styles.studioMoment} ${isVisible ? styles.visible : ''}`}
    >
      <Flex
        fillWidth
        maxWidth={68}
        gap="xl"
        direction="row"
        vertical="start"
        m={{ direction: "column", gap: "l" }}
      >
        <Column fillWidth className={styles.studioVisual}>
          <div className={styles.studioImagePlaceholder}>
            {studioContent.image?.src ? (
              <img
                src={studioContent.image.src}
                alt={studioContent.image.alt}
                className={styles.studioImage}
              />
            ) : (
              <Text className={styles.studioImageIcon}>✦</Text>
            )}
          </div>
          <Column gap="s" className={styles.studioInfo}>
            <Text variant="body-strong-m" className={styles.studioInfoTitle}>
              {studioContent.headline}
            </Text>
            <Text variant="body-default-s" className={styles.studioLocation}>
              {studioContent.location}
            </Text>
          </Column>
        </Column>
        
        <Column fillWidth gap="l">
          <Text variant="body-default-l" className={styles.studioDescription}>
            {studioContent.description}
          </Text>
          
          <Column gap="m">
            <Text variant="label-default-s" className={styles.atmosphereLabel}>
              Was dich erwartet
            </Text>
            <Column gap="s" className={styles.atmosphereList}>
              {studioContent.atmosphere.map((item, index) => (
                <Flex
                  key={index}
                  gap="m"
                  horizontal="start"
                  vertical="center"
                  className={styles.atmosphereItem}
                >
                  <div className={styles.atmosphereDot} />
                  <Text variant="body-default-m" className={styles.atmosphereText}>
                    {item}
                  </Text>
                </Flex>
              ))}
            </Column>
          </Column>
        </Column>
      </Flex>
    </Flex>
  );
};

const ClosingMoment: React.FC = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <Flex
      as="section"
      ref={ref}
      fillWidth
      direction="column"
      horizontal="center"
      className={`${styles.closingMoment} ${isVisible ? styles.visible : ''}`}
    >
      <Column fillWidth maxWidth={48} gap="l" horizontal="center">
        <Column gap="m" horizontal="center">
          <Heading
            as="h2"
            variant="heading-strong-l"
            className={styles.closingHeadline}
          >
            {closingContent.headline}
          </Heading>
          <Text variant="body-default-l" className={styles.closingText}>
            {closingContent.text}
          </Text>
        </Column>
        
        <Flex gap="m" wrap horizontal="center" className={styles.closingActions}>
          <a
            href={closingContent.primaryCtaUrl}
            className={styles.closingPrimary}
          >
            {closingContent.primaryCta}
          </a>
          <a
            href={closingContent.secondaryCtaUrl}
            className={styles.closingSecondary}
          >
            {closingContent.secondaryCta}
          </a>
        </Flex>
      </Column>
    </Flex>
  );
};

export const AboutPage: React.FC = () => {
  return (
    <Column fillWidth style={{ minHeight: "100vh"}}>
        <Background
            position="absolute"
            fill
            gradient={{
                display: true,
                opacity: 100,
                x: 50,
                y: 50,
                colorStart: "brand-background-strong",
                colorEnd: "brand-background-weak"
            }}
            mask={{
                x: 100,
                y: 50,
                radius: 200
            }}
            zIndex={0}
        />
      <Column
        as="main"
      >
        <OpeningMoment />
        <JourneyMoment />
        <CredentialsMoment />
        <ValuesMoment />
        <StudioMoment />
        <ClosingMoment />
      </Column>
    </Column>
  );
};

export default AboutPage;
