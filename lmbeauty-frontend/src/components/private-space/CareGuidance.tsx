'use client';

import { Text } from '@once-ui-system/core';
import type { CareTip } from '@/types';
import styles from './CareGuidance.module.scss';

interface CareGuidanceProps {
  tips?: CareTip[];
}

export function CareGuidance({ tips = [] }: CareGuidanceProps) {
  if (tips.length === 0) {
    return null;
  }

  return (
    <div className={styles.careGuidance}>
      <div className={styles.guidanceHeader}>
        <Text className={styles.guidanceTitle}>
          Ein paar sanfte Gedanken für dich
        </Text>
      </div>

      <div className={styles.guidanceNotes}>
        {tips.slice(0, 2).map((tip, index) => (
          <div key={tip.id || index} className={styles.careNote}>
            <Text className={styles.noteText}>
              {tip.content}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}