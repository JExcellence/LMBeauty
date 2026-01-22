'use client';

import { Column, Row, Text, Icon, TiltFx, RevealFx } from '@once-ui-system/core';
import Image from 'next/image';
import { Treatment } from '@/lib/bookingApi';
import styles from './TreatmentCard.module.scss';

interface TreatmentCardProps {
  treatment: Treatment;
  onSelect: (treatment: Treatment) => void;
  isSelected: boolean;
  delay?: number;
}

export function TreatmentCard({ treatment, onSelect, isSelected, delay = 0 }: TreatmentCardProps) {
  return (
    <RevealFx speed="medium" delay={delay} translateY={20}>
      <TiltFx intensity={2}>
        <Column
          className={`${styles.treatmentCard} ${isSelected ? styles.selected : ''}`}
          onClick={() => onSelect(treatment)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onSelect(treatment)}
        >
          <div className={styles.imageContainer}>
            {treatment.imageUrl ? (
              <Image
                src={treatment.imageUrl}
                alt={treatment.name}
                fill
                sizes="(max-width: 640px) 100vw, 300px"
                className={styles.treatmentImage}
              />
            ) : (
              <Column center fill className={styles.imagePlaceholder}>
                <Icon name="sparkle" size="xl" />
              </Column>
            )}
            <div className={styles.imageOverlay} />
          </div>
          
          <Column className={styles.cardContent} gap="12">
            <Column gap="4">
              <Text variant="heading-strong-m" className={styles.treatmentName}>
                {treatment.name}
              </Text>
              <Text variant="body-default-s" className={styles.treatmentDescription}>
                {treatment.description}
              </Text>
            </Column>
            
            <Row horizontal="between" vertical="center" className={styles.cardMeta}>
              <Row gap="8" vertical="center">
                <Icon name="clock" size="xs" className={styles.metaIcon} />
                <Text variant="label-default-xs" className={styles.metaText}>
                  {treatment.durationMinutes} Min
                </Text>
              </Row>
              <Text variant="heading-strong-l" className={styles.price}>
                {treatment.price}€
              </Text>
            </Row>
          </Column>
          
          <Row className={styles.selectIndicator} center>
            <Icon name={isSelected ? 'check' : 'chevronRight'} size="s" />
          </Row>
        </Column>
      </TiltFx>
    </RevealFx>
  );
}

export default TreatmentCard;
