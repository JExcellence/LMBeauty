'use client';

import { useEffect, useState } from 'react';
import { Row, Column, Text, Button, Icon } from '@once-ui-system/core';
import styles from './SessionExpiredToast.module.scss';

interface SessionExpiredToastProps {
  show: boolean;
  onLogin: () => void;
  onDismiss: () => void;
}

export function SessionExpiredToast({ show, onLogin, onDismiss }: SessionExpiredToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.toastOverlay} ${show ? styles.show : ''}`}>
      <div className={`${styles.toast} ${show ? styles.toastShow : ''}`}>
        <Row gap="m" vertical="center">
          <div className={styles.iconWrapper}>
            <Icon name="warning" size="m" className={styles.icon} />
          </div>
          
          <Column gap="xs" fillWidth>
            <Text variant="label-strong-s" className={styles.title}>
              Session abgelaufen
            </Text>
            <Text variant="body-default-s" className={styles.message}>
              Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an, um fortzufahren.
            </Text>
          </Column>
          
          <Row gap="xs">
            <Button
              size="s"
              variant="tertiary"
              onClick={onDismiss}
            >
              Später
            </Button>
            <Button
              size="s"
              variant="primary"
              onClick={onLogin}
            >
              Anmelden
            </Button>
          </Row>
        </Row>
      </div>
    </div>
  );
}

export default SessionExpiredToast;