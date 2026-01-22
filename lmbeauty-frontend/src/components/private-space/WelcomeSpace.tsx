'use client';

import { Text } from '@once-ui-system/core';
import styles from './WelcomeSpace.module.scss';

interface WelcomeSpaceProps {
  firstName?: string;
}

export function WelcomeSpace({ firstName }: WelcomeSpaceProps) {
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    
    if (firstName) {
      if (hour < 12) return `Schön, dass du da bist, ${firstName}`;
      if (hour < 18) return `Wie schön, dich zu sehen, ${firstName}`;
      return `Einen wunderschönen Abend, ${firstName}`;
    }
    
    if (hour < 12) return 'Schön, dass du da bist';
    if (hour < 18) return 'Wie schön, dich zu sehen';
    return 'Einen wunderschönen Abend';
  };

  return (
    <div className={styles.welcomeSpace}>
      <Text className={styles.welcomeText}>
        {getWelcomeMessage()}
      </Text>
      <Text className={styles.subText}>
        Hier ist dein ruhiger Ort für alles, was deine Schönheit betrifft
      </Text>
    </div>
  );
}