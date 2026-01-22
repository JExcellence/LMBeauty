'use client';

import { useState, useEffect } from 'react';
import { Text, Icon, Button } from '@once-ui-system/core';
import { useAppointments } from '@/hooks/useAdmin';
import styles from './AppointmentList.module.scss';

function AppointmentMoment({ appointment, onStatusChange }: { 
  appointment: any; 
  onStatusChange: (id: string, status: string) => void;
}) {
  const date = new Date(appointment.scheduledAt);
  const time = date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const day = date.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  const isToday = date.toDateString() === new Date().toDateString();
  const isPast = date < new Date();

  const getStatusTone = (status: string) => {
    switch (status) {
      case 'PENDING': return { text: 'wartet', tone: 'gentle' };
      case 'CONFIRMED': return { text: 'bestätigt', tone: 'calm' };
      case 'COMPLETED': return { text: 'vollendet', tone: 'soft' };
      case 'CANCELLED': return { text: 'abgesagt', tone: 'quiet' };
      default: return { text: 'offen', tone: 'gentle' };
    }
  };

  const statusInfo = getStatusTone(appointment.status);

  return (
    <div className={`${styles.appointmentMoment} ${isToday ? styles.today : ''} ${isPast ? styles.past : ''}`}>
      <div className={styles.timePresence}>
        <Text className={styles.dayText}>{day}</Text>
        <Text className={styles.timeText}>{time}</Text>
      </div>
      
      <div className={styles.encounter}>
        <Text className={styles.personName}>{appointment.customerName}</Text>
        <Text className={styles.treatmentName}>{appointment.treatmentName}</Text>
        <Text className={`${styles.statusText} ${styles[statusInfo.tone]}`}>
          {statusInfo.text}
        </Text>
      </div>

      {appointment.status === 'PENDING' && (
        <div className={styles.gentleActions}>
          <Button
            variant="tertiary"
            size="s"
            onClick={() => onStatusChange(appointment.id, 'CONFIRMED')}
            style={{
              background: 'rgba(0, 0, 0, 0.04)',
              border: 'none',
              padding: '8px 16px'
            }}
          >
            <Text>Bestätigen</Text>
          </Button>
        </div>
      )}
    </div>
  );
}

function TimeFilter({ selected, onChange }: { 
  selected: string; 
  onChange: (filter: string) => void; 
}) {
  const filters = [
    { key: 'all', label: 'Alle Zeiten' },
    { key: 'today', label: 'Heute' },
    { key: 'week', label: 'Diese Woche' },
    { key: 'pending', label: 'Wartend' }
  ];

  return (
    <div className={styles.timeFilter}>
      {filters.map((filter) => (
        <button
          key={filter.key}
          className={`${styles.filterMoment} ${selected === filter.key ? styles.present : ''}`}
          onClick={() => onChange(filter.key)}
        >
          <Text className={styles.filterLabel}>{filter.label}</Text>
        </button>
      ))}
    </div>
  );
}

export function AppointmentList() {
  const { appointments, isLoading } = useAppointments();
  const [timeFilter, setTimeFilter] = useState('all');

  const filterAppointments = (appointments: any[], filter: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    switch (filter) {
      case 'today':
        return appointments.filter(apt => {
          const aptDate = new Date(apt.scheduledAt);
          return aptDate >= today && aptDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
        });
      case 'week':
        return appointments.filter(apt => {
          const aptDate = new Date(apt.scheduledAt);
          return aptDate >= weekStart && aptDate < weekEnd;
        });
      case 'pending':
        return appointments.filter(apt => apt.status === 'PENDING');
      default:
        return appointments;
    }
  };

  const filteredAppointments = filterAppointments(appointments || [], timeFilter);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      // TODO: Implement appointment status update
      console.log('Update appointment status:', id, status);
    } catch (error) {
      console.error('Failed to update appointment status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.quietSpace}>
        <Text className={styles.quietText}>Termine werden geladen...</Text>
      </div>
    );
  }

  return (
    <div className={styles.appointmentFlow}>
      <div className={styles.flowHeader}>
        <Text className={styles.flowTitle}>Termine</Text>
        <Text className={styles.flowSubtitle}>
          Alle Begegnungen in deinem Studio
        </Text>
      </div>

      <TimeFilter selected={timeFilter} onChange={setTimeFilter} />

      <div className={styles.appointmentRiver}>
        {filteredAppointments.length === 0 ? (
          <div className={styles.emptyFlow}>
            <div className={styles.emptyIcon}>
              <Icon name="calendar" size="l" />
            </div>
            <Text className={styles.emptyTitle}>
              {timeFilter === 'pending' ? 'Keine wartenden Termine' : 'Keine Termine'}
            </Text>
            <Text className={styles.emptyMessage}>
              {timeFilter === 'pending' 
                ? 'Alle Anfragen sind bearbeitet' 
                : 'Raum für neue Begegnungen'}
            </Text>
          </div>
        ) : (
          <div className={styles.momentsList}>
            {filteredAppointments.map((appointment) => (
              <AppointmentMoment
                key={appointment.id}
                appointment={appointment}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentList;