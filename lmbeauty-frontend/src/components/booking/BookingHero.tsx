'use client';

import { useState } from 'react';
import { Column, Row, Text, SegmentedControl, RevealFx, Background } from '@once-ui-system/core';
import styles from './BookingHero.module.scss';

type TreatmentCategory = 'wimpern' | 'refill' | 'extras';

interface BookingHeroProps {
  onCategorySelect: (category: TreatmentCategory) => void;
  selectedCategory: TreatmentCategory;
}

const categoryButtons = [
  { value: 'wimpern', label: 'Wimpern' },
  { value: 'refill', label: 'Refill' },
  { value: 'extras', label: 'Extras' },
];

export function BookingHero({ onCategorySelect, selectedCategory }: BookingHeroProps) {
  return (
    <Column fillWidth className={styles.heroSection}>
      <Background
        position="absolute"
        className={styles.heroBackground}
        gradient={{
          display: true,
          colorStart: 'page-background',
          colorEnd: 'surface',
          opacity: 100,
        }}
      />
      
      <div className={styles.decorativeOrb} />
      <div className={styles.decorativeOrbSecondary} />
      
      <Column className={styles.heroContent} gap="32" center>
        <RevealFx speed="medium" translateY={24}>
          <Column gap="16" center>
            <Text variant="label-default-s" className={styles.heroLabel}>
              Online Terminbuchung
            </Text>
            <Text variant="display-default-l" className={styles.heroTitle}>
              Dein Wunschtermin
            </Text>
            <Text variant="body-default-l" className={styles.heroSubtitle}>
              Wähle deine Behandlung und finde den perfekten Moment für dich.
            </Text>
          </Column>
        </RevealFx>

        <RevealFx speed="medium" delay={0.2} translateY={16}>
          <Column className={styles.categorySelector} gap="8" center>
            <Text variant="label-default-xs" className={styles.categoryLabel}>
              Was darf es sein?
            </Text>
            <SegmentedControl
              buttons={categoryButtons}
              selected={selectedCategory}
              onToggle={(value) => onCategorySelect(value as TreatmentCategory)}
              className={styles.segmentedControl}
            />
          </Column>
        </RevealFx>
      </Column>
    </Column>
  );
}

export default BookingHero;
