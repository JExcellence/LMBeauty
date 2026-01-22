'use client';

import { Column, Row, Text, Avatar, Icon } from '@once-ui-system/core';
import styles from './WelcomeMoment.module.scss';

interface WelcomeMomentProps {
  firstName?: string;
  profileImage?: string;
}

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Guten Morgen';
  if (hour < 18) return 'Hallo';
  return 'Guten Abend';
};

export function WelcomeMoment({ firstName, profileImage }: WelcomeMomentProps) {
  const greeting = getGreeting();
  const displayName = firstName || 'Schön, dass du da bist';

  return (
    <Column className={styles.welcomeMoment} gap="20">
      <Row gap="16" vertical="center">
        {profileImage ? (
          <Avatar src={profileImage} size="xl" className={styles.avatar} />
        ) : (
          <Column center className={styles.avatarPlaceholder}>
            <Icon name="person" size="l" />
          </Column>
        )}
        <Column gap="4">
          <Text variant="body-default-s" className={styles.greetingLabel}>
            {greeting}
          </Text>
          <Text variant="heading-strong-l" className={styles.name}>
            {firstName ? displayName : 'Willkommen'}
          </Text>
        </Column>
      </Row>
      <Text variant="body-default-m" className={styles.subtext}>
        Dein persönlicher Beauty-Raum
      </Text>
    </Column>
  );
}
