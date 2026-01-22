'use client';

import { Column, Row, Text, Icon } from '@once-ui-system/core';
import type { CareTip } from '@/types';
import styles from './GentleGuidance.module.scss';

interface GentleGuidanceProps {
  tips: CareTip[];
}

const defaultTips: CareTip[] = [
  {
    id: '1',
    title: 'Die ersten 24 Stunden',
    content: 'Vermeide Wasser, Dampf und Make-up im Augenbereich. So kann der Kleber optimal aushärten.',
    icon: 'clock',
  },
  {
    id: '2',
    title: 'Tägliche Pflege',
    content: 'Bürste deine Wimpern morgens sanft mit einem sauberen Bürstchen. Das hält sie in Form.',
    icon: 'sparkle',
  },
];

export function GentleGuidance({ tips }: GentleGuidanceProps) {
  const displayTips = tips && tips.length > 0 ? tips.slice(0, 2) : defaultTips;

  return (
    <Column className={styles.gentleGuidance} gap="20">
      <Row gap="12" vertical="center">
        <Column center className={styles.sectionIcon}>
          <Icon name="info" size="m" />
        </Column>
        <Text variant="heading-strong-m" style={{ color: '#2D2A26' }}>
          Pflege-Tipps
        </Text>
      </Row>
      
      <Column gap="12">
        {displayTips.map((tip) => (
          <Row key={tip.id} className={styles.tipItem} gap="16" vertical="start">
            <Column center className={styles.tipIcon}>
              <Icon name={(tip.icon as any) || 'sparkle'} size="s" />
            </Column>
            <Column gap="4" flex={1}>
              <Text variant="body-strong-s" style={{ color: '#2D2A26' }}>
                {tip.title}
              </Text>
              <Text variant="body-default-s" style={{ color: '#5A5550' }}>
                {tip.content}
              </Text>
            </Column>
          </Row>
        ))}
      </Column>
    </Column>
  );
}
