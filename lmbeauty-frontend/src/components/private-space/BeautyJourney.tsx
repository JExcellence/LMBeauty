'use client';

import { Text } from '@once-ui-system/core';
import type { TreatmentHistory } from '@/types';
import styles from './BeautyJourney.module.scss';

interface BeautyJourneyProps {
  treatments?: TreatmentHistory[];
  onViewMore?: () => void;
}

export function BeautyJourney({ treatments = [] }: BeautyJourneyProps) {
  if (treatments.length === 0) {
    return (
      <div className={styles.beautyJourney}>
        <div className={styles.journeyHeader}>
          <Text className={styles.journeyTitle}>
            Deine Beauty-Geschichte beginnt hier
          </Text>
          <Text className={styles.journeyDescription}>
            Jede Behandlung wird zu einem besonderen Kapitel in deiner persönlichen Schönheitsreise
          </Text>
        </div>
      </div>
    );
  }

  const getChapterText = (treatment: TreatmentHistory, index: number) => {
    const date = new Date(treatment.completedAt);
    const monthsAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    if (monthsAgo === 0) return 'Vor kurzem';
    if (monthsAgo === 1) return 'Letzten Monat';
    if (monthsAgo < 12) return `Vor ${monthsAgo} Monaten`;
    return date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  };

  return (
    <div className={styles.beautyJourney}>
      <div className={styles.journeyHeader}>
        <Text className={styles.journeyTitle}>
          Deine Beauty-Geschichte
        </Text>
        <Text className={styles.journeyDescription}>
          Jede Behandlung, ein neues Kapitel deiner Schönheit
        </Text>
      </div>

      <div className={styles.chapters}>
        {treatments.slice(0, 3).map((treatment, index) => (
          <div key={treatment.id} className={styles.chapter}>
            <div className={styles.chapterMoment}>
              <Text className={styles.chapterTime}>
                {getChapterText(treatment, index)}
              </Text>
            </div>
            <div className={styles.chapterContent}>
              <Text className={styles.chapterTitle}>
                {treatment.treatmentName}
              </Text>
              {treatment.notes && (
                <Text className={styles.chapterMemory}>
                  {treatment.notes}
                </Text>
              )}
            </div>
          </div>
        ))}
      </div>

      {treatments.length > 3 && (
        <div className={styles.moreChapters}>
          <Text className={styles.moreText}>
            Und {treatments.length - 3} weitere schöne Momente
          </Text>
        </div>
      )}
    </div>
  );
}