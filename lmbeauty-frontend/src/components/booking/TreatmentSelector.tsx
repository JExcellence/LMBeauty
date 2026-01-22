'use client';

import { Column, Row, Text, Grid, RevealFx, Skeleton } from '@once-ui-system/core';
import { TreatmentCard } from './TreatmentCard';
import { Treatment } from '@/lib/bookingApi';
import styles from './TreatmentSelector.module.scss';

interface TreatmentSelectorProps {
  treatments: Treatment[];
  selectedTreatment: Treatment | null;
  onSelect: (treatment: Treatment) => void;
  isLoading?: boolean;
}

export function TreatmentSelector({ 
  treatments, 
  selectedTreatment, 
  onSelect,
  isLoading = false 
}: TreatmentSelectorProps) {
  if (isLoading) {
    return (
      <Column className={styles.selectorContainer}>
        <Grid columns="3" s={{ columns: '1' }} m={{ columns: '2' }} gap="24">
          {[1, 2, 3].map((i) => (
            <Column key={i} className={styles.skeletonCard}>
              <Skeleton shape="block" width="xl" height="xl" style={{ aspectRatio: '4/3' }} />
              <Column gap="8" padding="20">
                <Skeleton shape="line" width="l" height="m" />
                <Skeleton shape="line" width="xl" height="s" />
                <Skeleton shape="line" width="m" height="s" />
              </Column>
            </Column>
          ))}
        </Grid>
      </Column>
    );
  }

  if (treatments.length === 0) {
    return (
      <Column className={styles.emptyState} center gap="16">
        <Text variant="body-default-m" style={{ color: '#5A5550' }}>
          Keine Behandlungen in dieser Kategorie verfügbar.
        </Text>
      </Column>
    );
  }

  return (
    <Column className={styles.selectorContainer}>
      <RevealFx speed="fast" translateY={12}>
        <Row className={styles.sectionHeader} horizontal="between" vertical="center">
          <Text variant="heading-strong-s" style={{ color: '#2D2A26' }}>
            Wähle deine Behandlung
          </Text>
          <Text variant="label-default-xs" style={{ color: '#8A8580' }}>
            {treatments.length} verfügbar
          </Text>
        </Row>
      </RevealFx>

      <Grid columns="3" s={{ columns: '1' }} m={{ columns: '2' }} gap="24" className={styles.treatmentGrid}>
        {treatments.map((treatment, index) => (
          <TreatmentCard
            key={treatment.id}
            treatment={treatment}
            onSelect={onSelect}
            isSelected={selectedTreatment?.id === treatment.id}
            delay={0.1 + index * 0.08}
          />
        ))}
      </Grid>
    </Column>
  );
}

export default TreatmentSelector;
