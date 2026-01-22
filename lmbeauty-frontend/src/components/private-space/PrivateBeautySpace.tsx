'use client';

import { Column, Text, Button } from '@once-ui-system/core';
import type { User, TreatmentHistory, Appointment, ProductPurchase, CareTip } from '@/types';
import { WelcomeSpace } from './WelcomeSpace';
import { NextMoment } from './NextMoment';
import { BeautyJourney } from './BeautyJourney';
import { LoyaltyMoment } from './LoyaltyMoment';
import { CareGuidance } from './CareGuidance';
import { Connection } from './Connection';
import styles from './PrivateBeautySpace.module.scss';

interface PrivateBeautySpaceProps {
  user: User | null;
  treatments?: TreatmentHistory[];
  appointment?: Appointment;
  products?: ProductPurchase[];
  careTips?: CareTip[];
  onViewMoreTreatments?: () => void;
  onViewAppointmentDetails?: () => void;
  onRescheduleAppointment?: () => void;
  onBookAppointment?: () => void;
}

export function PrivateBeautySpace({ 
  user,
  treatments = [],
  appointment,
  products = [],
  careTips = [],
  onViewMoreTreatments,
  onViewAppointmentDetails,
  onRescheduleAppointment,
  onBookAppointment
}: PrivateBeautySpaceProps) {
  return (
    <div className={styles.beautySpace}>
      <div className={styles.journal}>
        <WelcomeSpace firstName={user?.firstName} />
        
        <NextMoment 
          appointment={appointment}
          onBookNew={onBookAppointment || (() => {})}
        />

        <LoyaltyMoment 
          status={{ currentStamps: 0, rewardAvailable: false }}
          completedAppointments={[]}
        />

        <BeautyJourney 
          treatments={treatments}
          onViewMore={onViewMoreTreatments}
        />

        <CareGuidance tips={careTips} />

        <Connection />
      </div>
    </div>
  );
}