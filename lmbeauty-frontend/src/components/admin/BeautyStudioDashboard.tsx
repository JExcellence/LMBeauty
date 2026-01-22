'use client';

import { useState, useEffect } from 'react';
import { Text, Icon } from '@once-ui-system/core';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard, useTodayAppointments, useTreatments } from '@/hooks/useAdmin';
import styles from './BeautyStudioDashboard.module.scss';

// Floating Metric Orb - 2026 UI Pattern
interface MetricOrbProps {
  icon: string;
  value: string | number;
  label: string;
  position: { x: number; y: number };
  size?: 'small' | 'medium' | 'large';
  pulse?: boolean;
}

function MetricOrb({ icon, value, label, position, size = 'medium', pulse = false }: MetricOrbProps) {
  return (
    <div 
      className={`${styles.metricOrb} ${styles[`orb${size.charAt(0).toUpperCase() + size.slice(1)}`]} ${pulse ? styles.orbPulse : ''}`}
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`,
        animationDelay: `${Math.random() * 2}s`
      }}
    >
      <div className={styles.orbCore}>
        <Icon name={icon as any} size="s" />
      </div>
      <div className={styles.orbHalo} />
      <div className={styles.orbData}>
        <Text className={styles.orbValue}>{value}</Text>
        <Text className={styles.orbLabel}>{label}</Text>
      </div>
    </div>
  );
}

// Flowing Timeline - Editorial Layout Pattern
interface FlowingTimelineProps {
  appointments: any[];
}

function FlowingTimeline({ appointments }: FlowingTimelineProps) {
  const now = new Date();
  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.appointmentDateTime) > now)
    .slice(0, 4);

  return (
    <div className={styles.flowingTimeline}>
      <div className={styles.timelineRiver}>
        <div className={styles.riverFlow} />
        {upcomingAppointments.map((appointment, index) => (
          <div 
            key={appointment.id} 
            className={styles.timelineNode}
            style={{ 
              left: `${20 + (index * 20)}%`,
              animationDelay: `${index * 0.2}s`
            }}
          >
            <div className={styles.nodeCore}>
              <Text className={styles.nodeTime}>
                {new Date(appointment.appointmentDateTime).toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </div>
            <div className={styles.nodeDetails}>
              <Text className={styles.nodeClient}>
                {appointment.customer?.firstName}
              </Text>
              <Text className={styles.nodeTreatment}>
                {appointment.treatment?.name}
              </Text>
            </div>
            <div className={styles.nodeConnection} />
          </div>
        ))}
      </div>
      
      {upcomingAppointments.length === 0 && (
        <div className={styles.timelineEmpty}>
          <div className={styles.emptyRipple} />
          <Text className={styles.emptyMessage}>
            Stille Wasser, tiefe Gedanken
          </Text>
          <Text className={styles.emptySubtext}>
            Ein ruhiger Tag für Inspiration
          </Text>
        </div>
      )}
    </div>
  );
}

// Constellation View - Services as Stars
interface ConstellationViewProps {
  treatments: any[];
}

function ConstellationView({ treatments }: ConstellationViewProps) {
  const activeTreatments = treatments.filter(t => t.active);
  
  return (
    <div className={styles.constellationView}>
      <div className={styles.starField}>
        {activeTreatments.slice(0, 8).map((treatment, index) => (
          <div 
            key={treatment.id}
            className={styles.treatmentStar}
            style={{
              left: `${15 + (index % 4) * 20 + Math.random() * 10}%`,
              top: `${20 + Math.floor(index / 4) * 30 + Math.random() * 15}%`,
              animationDelay: `${index * 0.3}s`
            }}
          >
            <div className={styles.starCore} />
            <div className={styles.starGlow} />
            <div className={styles.starLabel}>
              <Text className={styles.starName}>{treatment.name}</Text>
              <Text className={styles.starPrice}>{treatment.price}€</Text>
            </div>
          </div>
        ))}
        
        {/* Connecting Lines */}
        <svg className={styles.constellation} viewBox="0 0 100 100">
          {activeTreatments.slice(0, 6).map((_, index) => (
            <line
              key={index}
              x1={`${15 + (index % 3) * 25}`}
              y1={`${25 + Math.floor(index / 3) * 35}`}
              x2={`${15 + ((index + 1) % 3) * 25}`}
              y2={`${25 + Math.floor((index + 1) / 3) * 35}`}
              className={styles.constellationLine}
              style={{ animationDelay: `${index * 0.5}s` }}
            />
          ))}
        </svg>
      </div>
      
      <div className={styles.constellationInfo}>
        <Text className={styles.constellationTitle}>
          Deine Kreationen
        </Text>
        <Text className={styles.constellationSubtext}>
          {activeTreatments.length} Services leuchten heute
        </Text>
      </div>
    </div>
  );
}

export function BeautyStudioDashboard() {
  const { user } = useAuth();
  const { metrics, isLoading: metricsLoading } = useDashboard();
  const { appointments: todayAppointments, isLoading: appointmentsLoading } = useTodayAppointments();
  const { treatments, isLoading: treatmentsLoading } = useTreatments();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('Dashboard data:', {
      treatments: treatments?.length || 0,
      treatmentsData: treatments,
      todayAppointments: todayAppointments?.length || 0,
      metrics,
      loading: { metricsLoading, appointmentsLoading, treatmentsLoading }
    });
    
    // Force refresh treatments if we have 0
    if (!treatmentsLoading && treatments?.length === 0) {
      console.log('No treatments found, forcing refresh...');
      // You can manually refresh by calling the refresh function
    }
  }, [treatments, todayAppointments, metrics, metricsLoading, appointmentsLoading, treatmentsLoading]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Guten Morgen';
    if (hour < 17) return 'Schönen Tag';
    return 'Guten Abend';
  };

  const activeTreatments = treatments?.filter(t => t.active) || [];
  const totalRevenue = metrics?.weeklyRevenue || 0;
  const completedThisWeek = metrics?.completedThisWeek || 0;

  // Only show loading if all are loading or if it's the initial load
  const isInitialLoading = metricsLoading && appointmentsLoading && treatmentsLoading;
  
  if (isInitialLoading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner} />
        <Text className={styles.loadingText}>
          Dein Beauty-Studio wird geladen...
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.beautyStudioDashboard}>
      {/* Professional Header */}
      <header className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <div className={styles.greetingSection}>
            <Text className={styles.greetingText}>
              {getGreeting()}, {user?.firstName || 'Lisa'}
            </Text>
            <Text className={styles.dateText}>
              {currentTime.toLocaleDateString('de-DE', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </Text>
          </div>
          <div className={styles.timeDisplay}>
            <Text className={styles.currentTime}>
              {currentTime.toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </div>
        </div>
      </header>

      {/* Metrics Grid */}
      <section className={styles.metricsGrid}>
        <MetricOrb
          icon="calendar"
          value={todayAppointments?.length || 0}
          label="Heute"
          position={{ x: 10, y: 20 }}
          size="large"
          pulse={true}
        />
        <MetricOrb
          icon="check"
          value={completedThisWeek}
          label="Diese Woche"
          position={{ x: 35, y: 10 }}
          size="medium"
        />
        <MetricOrb
          icon="dollar-sign"
          value={`${totalRevenue}€`}
          label="Umsatz"
          position={{ x: 65, y: 25 }}
          size="medium"
        />
        <MetricOrb
          icon="heart"
          value={treatments?.length || 0}
          label="Services"
          position={{ x: 85, y: 15 }}
          size="small"
        />
      </section>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Today's Schedule */}
        <div className={styles.scheduleSection}>
          <div className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>Heute</Text>
          </div>
          <FlowingTimeline appointments={todayAppointments || []} />
        </div>

        {/* Services Overview */}
        <div className={styles.servicesSection}>
          <ConstellationView treatments={treatments || []} />
          
          {/* Studio Mood */}
          <div className={styles.studioMood}>
            <div className={styles.moodIndicator}>
              <div className={styles.moodPulse} />
            </div>
            <div className={styles.moodContent}>
              <Text className={styles.moodTitle}>
                {completedThisWeek > 5 ? 'Produktive Energie' : 
                 completedThisWeek > 2 ? 'Ruhige Klarheit' : 
                 'Sanfte Bereitschaft'}
              </Text>
              <Text className={styles.moodDescription}>
                Dein Studio-Rhythmus
              </Text>
            </div>
          </div>
        </div>
      </div>
      
      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          position: 'fixed', 
          bottom: '10px', 
          right: '10px', 
          background: 'rgba(0,0,0,0.8)', 
          color: 'white', 
          padding: '10px', 
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 9999
        }}>
          <div>Treatments: {treatments?.length || 0}</div>
          <div>Active: {activeTreatments.length}</div>
          <div>Appointments: {todayAppointments?.length || 0}</div>
          <div>Loading: {treatmentsLoading ? 'T' : ''}{appointmentsLoading ? 'A' : ''}{metricsLoading ? 'M' : ''}</div>
        </div>
      )}
    </div>
  );
}

export default BeautyStudioDashboard;