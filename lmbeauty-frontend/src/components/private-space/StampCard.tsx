'use client';

import { Column, Row, Text, Icon, Button } from '@once-ui-system/core';
import { useLoyaltyStatus } from '@/hooks/useBooking';
import styles from './StampCard.module.scss';

interface StampCardProps {
  onRedeem?: () => void;
}

export function StampCard({ onRedeem }: StampCardProps) {
  const { status, isLoading, redeemReward } = useLoyaltyStatus();

  const handleRedeem = async () => {
    try {
      await redeemReward();
      onRedeem?.();
    } catch (error) {
      console.error('Failed to redeem reward:', error);
    }
  };

  if (isLoading) {
    return (
      <Column className={styles.container}>
        <Column center padding="32">
          <Text variant="body-default-s" style={{ color: '#8A8580' }}>
            Stempelkarte wird geladen...
          </Text>
        </Column>
      </Column>
    );
  }

  const stamps = status?.currentStamps || 0;
  const totalSlots = 10;
  const rewardAvailable = status?.rewardAvailable || false;

  return (
    <Column className={styles.container} gap="20">
      <Row horizontal="between" vertical="center">
        <Column gap="4">
          <Text variant="heading-strong-m" className={styles.title}>
            Deine Stempelkarte
          </Text>
          <Text variant="body-default-s" className={styles.subtitle}>
            {rewardAvailable 
              ? '🎉 Du hast eine Belohnung verdient!' 
              : `Noch ${totalSlots - stamps} Stempel bis zur Belohnung`}
          </Text>
        </Column>
        {rewardAvailable && (
          <Button
            variant="primary"
            size="s"
            onClick={handleRedeem}
            label="Einlösen"
          />
        )}
      </Row>

      <Row gap="8" wrap className={styles.stampsGrid}>
        {Array.from({ length: totalSlots }).map((_, index) => (
          <Column
            key={index}
            center
            className={`${styles.stamp} ${index < stamps ? styles.filled : ''} ${
              index === stamps - 1 ? styles.recent : ''
            }`}
          >
            {index < stamps ? (
              <Icon name="heart" size="s" className={styles.stampIcon} />
            ) : (
              <Text variant="label-default-xs" className={styles.stampNumber}>
                {index + 1}
              </Text>
            )}
          </Column>
        ))}
      </Row>

      {rewardAvailable && (
        <Column className={styles.rewardBanner} center gap="8">
          <Icon name="sparkle" size="m" className={styles.rewardIcon} />
          <Text variant="body-strong-m" className={styles.rewardText}>
            15% Rabatt auf deine nächste Behandlung!
          </Text>
        </Column>
      )}

      <Text variant="body-default-xs" className={styles.info}>
        Für jede abgeschlossene Behandlung erhältst du einen Stempel.
      </Text>
    </Column>
  );
}

export default StampCard;
