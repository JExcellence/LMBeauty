'use client';

import { useState, useEffect } from 'react';
import { Text, Icon, Button, Spinner } from '@once-ui-system/core';
import { useDashboard, useTodayAppointments } from '@/hooks/useAdmin';
import styles from './DashboardOverview.module.scss';

function TodayAppointment({ appointment }: { appointment: any }) {
  const time = new Date(appointment.scheduledAt).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const statusConfig = {
    PENDING: { label: 'Ausstehend', color: '#f59e0b' },
    CONFIRMED: { label: 'Bestätigt', color: '#10b981' },
    COMPLETED: { label: 'Abgeschlossen', color: '#6b7280' },
    CANCELLED: { label: 'Abgesagt', color: '#ef4444' },
  };

  const config = (statusConfig as any)[appointment.status] || statusConfig.PENDING;

  return (
    <div className={styles.appointmentCard}>
      <div className={styles.appointmentTime}>
        <Text className={styles.timeText}>{time}</Text>
      </div>
      <div className={styles.appointmentDetails}>
        <Text className={styles.customerName}>{appointment.customerName}</Text>
        <Text className={styles.treatmentName}>{appointment.treatmentName}</Text>
      </div>
      <div 
        className={styles.statusIndicator}
        style={{ backgroundColor: config.color }}
      />
    </div>
  );
}

function QuickActionCard({ 
  icon, 
  title, 
  description, 
  href, 
  badge 
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  badge?: number;
}) {
  return (
    <Button
      variant="tertiary"
      href={href}
      className={styles.quickActionCard}
    >
      <div className={styles.quickActionContent}>
        <div className={styles.quickActionHeader}>
          <div className={styles.quickActionIcon}>
            <Icon name={icon as any} size="m" />
          </div>
          {badge && badge > 0 && (
            <div className={styles.badge}>{badge}</div>
          )}
        </div>
        <div className={styles.quickActionText}>
          <Text className={styles.quickActionTitle}>{title}</Text>
          <Text className={styles.quickActionDescription}>{description}</Text>
        </div>
      </div>
    </Button>
  );
}

export function DashboardOverview() {
  const { metrics, isLoading: metricsLoading } = useDashboard();
  const { appointments, isLoading: appointmentsLoading } = useTodayAppointments();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (metricsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="m" />
        <Text className={styles.loadingText}>Dashboard wird geladen...</Text>
      </div>
    );
  }

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Guten Morgen';
    if (hour < 18) return 'Guten Tag';
    return 'Guten Abend';
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.dashboardHeader}>
        <div className={styles.welcomeSection}>
          <Text className={styles.greeting}>{greeting()}</Text>
          <Text className={styles.welcomeMessage}>
            Hier ist dein Studio-Überblick für heute
          </Text>
          <Text className={styles.currentTime}>
            {currentTime.toLocaleDateString('de-DE', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </div>
        <div className={styles.headerActions}>
          <Button 
            variant="secondary" 
            size="m" 
            href="/admin/appointments"
            className={styles.secondaryButton}
          >
            <Icon name="calendar" size="s" />
            <Text>Alle Termine</Text>
          </Button>
          <Button 
            variant="primary" 
            size="m" 
            href="/online-booking"
            className={styles.primaryButton}
          >
            <Icon name="plus" size="s" />
            <Text>Neuer Termin</Text>
          </Button>
        </div>
      </header>

      <div className={styles.contentGrid}>
        <div className={styles.appointmentsSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Icon name="calendar" size="m" />
              <Text className={styles.sectionHeading}>Heutige Termine</Text>
            </div>
            <Button 
              variant="tertiary" 
              size="s" 
              href="/admin/appointments"
              className={styles.viewAllButton}
            >
              Alle anzeigen
            </Button>
          </div>
          
          <div className={styles.appointmentsList}>
            {appointmentsLoading ? (
              <div className={styles.emptyState}>
                <Spinner size="s" />
              </div>
            ) : appointments.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <Icon name="calendar" size="xl" />
                </div>
                <Text className={styles.emptyTitle}>Keine Termine heute</Text>
                <Text className={styles.emptyDescription}>
                  Perfekt für Planungen und Vorbereitungen
                </Text>
              </div>
            ) : (
              <div className={styles.appointmentsContainer}>
                {appointments.slice(0, 6).map((apt) => (
                  <TodayAppointment key={apt.id} appointment={apt} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.sidebarSection}>
          <div className={styles.quickActionsSection}>
            <div className={styles.sectionHeader}>
              <Text className={styles.sectionHeading}>Schnellzugriff</Text>
            </div>
            <div className={styles.quickActionsGrid}>
              <QuickActionCard
                icon="clock"
                title="Ausstehende Anfragen"
                description={`${metrics?.pendingAppointments || 0} Termine bestätigen`}
                href="/admin/appointments?status=PENDING"
                badge={metrics?.pendingAppointments}
              />
              <QuickActionCard
                icon="person"
                title="Kundenverwaltung"
                description={`${metrics?.totalCustomers || 0} Kundinnen verwalten`}
                href="/admin/customers"
              />
              <QuickActionCard
                icon="settings"
                title="Verfügbarkeit"
                description="Zeiten und Slots verwalten"
                href="/admin/availability"
              />
            </div>
          </div>

          <div className={styles.statsSection}>
            <div className={styles.sectionHeader}>
              <Text className={styles.sectionHeading}>Monatsstatistik</Text>
            </div>
            <div className={styles.monthlyStats}>
              <div className={styles.statItem}>
                <Text className={styles.statValue}>{metrics?.newCustomersThisMonth || 0}</Text>
                <Text className={styles.statLabel}>Neue Kundinnen</Text>
                <div className={styles.statTrend}>
                  <Icon name="arrowUp" size="xs" />
                  <Text className={styles.statChange}>+23%</Text>
                </div>
              </div>
              <div className={styles.statItem}>
                <Text className={styles.statValue}>{metrics?.confirmedAppointments || 0}</Text>
                <Text className={styles.statLabel}>Bestätigte Termine</Text>
                <div className={styles.statTrend}>
                  <Icon name="arrowUp" size="xs" />
                  <Text className={styles.statChange}>+12%</Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;
