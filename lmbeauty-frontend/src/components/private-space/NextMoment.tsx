'use client';

import { Text, Button } from '@once-ui-system/core';
import styles from './NextMoment.module.scss';
import { Appointment } from '@/types';

interface NextMomentProps {
  appointment?: Appointment;
  onBookNew: () => void;
}

export function NextMoment({ 
  appointment, 
  onBookNew
}: NextMomentProps) {
  if (!appointment) {
    return (
      <div className={styles.nextMoment}>
        <div className={styles.momentContent}>
          <Text className={styles.momentTitle}>
            Wann dürfen wir dich wieder verwöhnen
          </Text>
          <Text className={styles.momentDescription}>
            Dein nächster Termin wartet darauf, geplant zu werden
          </Text>
        </div>
        <div className={styles.gentleAction}>
          <Button
            variant="tertiary"
            size="m"
            onClick={onBookNew}
            className={styles.bookButton}
          >
            <Text>Termin finden</Text>
          </Button>
        </div>
      </div>
    );
  }

  const appointmentDate = new Date(appointment.scheduledDate);
  const isToday = appointmentDate.toDateString() === new Date().toDateString();
  const isTomorrow = appointmentDate.toDateString() === new Date(Date.now() + 86400000).toDateString();
  
  const getDateText = () => {
    if (isToday) return 'heute';
    if (isTomorrow) return 'morgen';
    return appointmentDate.toLocaleDateString('de-DE', { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long' 
    });
  };

  const getTimeText = () => {
    return appointmentDate.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMomentText = () => {
    if (isToday) return 'Heute ist es soweit';
    if (isTomorrow) return 'Morgen ist es soweit';
    return 'Dein nächster Moment';
  };

  return (
    <div className={styles.nextMoment}>
      <div className={styles.momentContent}>
        <Text className={styles.momentTitle}>
          {getMomentText()}
        </Text>
        <div className={styles.appointmentDetails}>
          <Text className={styles.treatmentName}>
            {appointment.treatmentName}
          </Text>
          <Text className={styles.appointmentTime}>
            {getDateText()} um {getTimeText()}
          </Text>
        </div>
        <Text className={styles.momentDescription}>
          Alles ist vorbereitet. Du musst nur noch kommen
        </Text>
      </div>
      
      {!isToday && (
        <div className={styles.gentleActions}>
          <Button
            variant="tertiary"
            size="s"
            className={styles.rescheduleButton}
          >
            <Text>Verschieben</Text>
          </Button>
        </div>
      )}
    </div>
  );
}