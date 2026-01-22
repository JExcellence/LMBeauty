'use client';

import { Text, Icon, Button } from '@once-ui-system/core';
import styles from './LoyaltyMoment.module.scss';

interface LoyaltyStatus {
  currentStamps: number;
  rewardAvailable: boolean;
}

interface Appointment {
  id: number;
  status: string;
}

interface LoyaltyMomentProps {
  status: LoyaltyStatus;
  completedAppointments: Appointment[];
}

export function LoyaltyMoment({ status, completedAppointments }: LoyaltyMomentProps) {
  const stamps = status?.currentStamps || completedAppointments.length || 0;
  const totalSlots = 10;
  const rewardAvailable = status?.rewardAvailable || false;

  const handleRedeem = async () => {
    try {
      // TODO: Implement redeem functionality
      console.log('Redeeming reward...');
    } catch (error) {
      console.error('Failed to redeem reward:', error);
    }
  };

  const getLoyaltyMessage = () => {
    if (rewardAvailable) {
      return 'Du hast dir etwas Schönes verdient';
    }
    if (stamps === 0) {
      return 'Deine Treue-Reise beginnt';
    }
    if (stamps >= 7) {
      return 'Du bist fast am Ziel';
    }
    return 'Jeder Besuch bringt dich näher';
  };

  const getSubMessage = () => {
    if (rewardAvailable) {
      return '15% Rabatt wartet auf dich';
    }
    const remaining = totalSlots - stamps;
    if (remaining === 1) {
      return 'Noch ein Besuch bis zur Belohnung';
    }
    return `Noch ${remaining} Besuche bis zur Belohnung`;
  };

  return (
    <div className={styles.loyaltyMoment}>
      <div className={styles.momentHeader}>
        <Text className={styles.momentTitle}>
          {getLoyaltyMessage()}
        </Text>
        <Text className={styles.momentDescription}>
          {getSubMessage()}
        </Text>
      </div>

      <div className={styles.stampsFlow}>
        {Array.from({ length: totalSlots }).map((_, index) => (
          <div
            key={index}
            className={`${styles.stamp} ${index < stamps ? styles.filled : ''}`}
          >
            {index < stamps ? (
              <Icon name="heart" size="xs" className={styles.stampIcon} />
            ) : (
              <div className={styles.stampEmpty} />
            )}
          </div>
        ))}
      </div>

      {rewardAvailable && (
        <div className={styles.rewardMoment}>
          <div className={styles.rewardContent}>
            <Icon name="sparkle" size="s" className={styles.rewardIcon} />
            <Text className={styles.rewardText}>
              15% Rabatt auf deine nächste Behandlung
            </Text>
          </div>
          <Button
            variant="tertiary"
            size="s"
            onClick={handleRedeem}
            className={styles.redeemButton}
          >
            <Text>Einlösen</Text>
          </Button>
        </div>
      )}

      <Text className={styles.loyaltyNote}>
        Für jede vollendete Behandlung erhältst du einen Herzstempel
      </Text>
    </div>
  );
}