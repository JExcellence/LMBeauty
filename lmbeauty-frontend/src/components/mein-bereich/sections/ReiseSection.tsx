'use client';

import { Spinner } from '@once-ui-system/core';
import { useHistory } from '@/hooks/useMeinBereich';
import styles from '../../../app/(client)/mein-bereich/mein-bereich.module.scss';

export function ReiseSection() {
  const { history, isLoading, rebook } = useHistory();

  if (isLoading) {
    return (
      <div className={styles.softPanel}>
        <div className={styles.loadingState}>
          <Spinner size="m" />
          <p className={styles.loadingText}>Wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.softPanel}>
      <div className={styles.journeySection}>
        <h2 className={styles.journeyTitle}>Deine Beauty-Reise</h2>

        {history.length === 0 ? (
          <p className={styles.journeyEmpty}>
            Deine erste Behandlung wird hier erscheinen.
          </p>
        ) : (
          <div className={styles.journeyTimeline}>
            {history.map((entry) => (
              <div key={entry.id} className={styles.journeyItem}>
                <div className={styles.journeyMarker} />
                <div className={styles.journeyContent}>
                  <p className={styles.journeyTreatment}>{entry.treatmentName}</p>
                  <p className={styles.journeyDate}>{entry.relativeTime}</p>
                  <button
                    className={styles.journeyRebook}
                    onClick={() => rebook(entry.id)}
                  >
                    Noch einmal buchen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
