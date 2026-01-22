'use client';

import { Badge, Button } from '@once-ui-system/core';
import styles from './RefillPricingCard.module.scss';

export interface RefillOption {
  id: string;
  weekThreshold: number;
  price: number;
  description: string;
  recommended?: boolean;
}

export interface RefillEligibility {
  isEligible: boolean;
  weeksSinceLastAppointment?: number;
  availableRefills: RefillOption[];
  recommendedOption?: RefillOption;
  lastAppointmentDate?: string;
  message: string;
}

interface RefillPricingCardProps {
  eligibility: RefillEligibility;
  newApplicationPrice: number;
  treatmentName: string;
  onSelectRefill?: (refillOption: RefillOption) => void;
  onSelectNewApplication?: () => void;
  selectedOption?: RefillOption | 'new' | null;
  className?: string;
}

/**
 * Component for displaying refill pricing options based on customer eligibility.
 */
export function RefillPricingCard({
  eligibility,
  newApplicationPrice,
  treatmentName,
  onSelectRefill,
  onSelectNewApplication,
  selectedOption,
  className
}: RefillPricingCardProps) {
  const formatPrice = (price: number) => `${price.toFixed(0)}€`;
  
  const formatWeeks = (weeks: number) => {
    if (weeks === 1) return '1 Woche';
    return `${weeks} Wochen`;
  };

  if (!eligibility.isEligible) {
    return (
      <div className={`${styles.refillCard} ${styles.notEligible} ${className || ''}`}>
        <div className={styles.header}>
          <h3 className={styles.title}>Refill nicht verfügbar</h3>
          <p className={styles.message}>{eligibility.message}</p>
        </div>
        
        <div className={styles.newApplicationOption}>
          <div className={styles.optionHeader}>
            <span className={styles.optionTitle}>Neuanlage</span>
            <span className={styles.price}>{formatPrice(newApplicationPrice)}</span>
          </div>
          <p className={styles.optionDescription}>
            Komplette neue {treatmentName} Behandlung
          </p>
          <Button
            variant={selectedOption === 'new' ? 'primary' : 'secondary'}
            size="s"
            onClick={onSelectNewApplication}
            className={styles.selectButton}
          >
            {selectedOption === 'new' ? 'Ausgewählt' : 'Auswählen'}
          </Button>
        </div>
      </div>
    );
  }

  const savings = eligibility.recommendedOption 
    ? newApplicationPrice - eligibility.recommendedOption.price
    : 0;

  return (
    <div className={`${styles.refillCard} ${styles.eligible} ${className || ''}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Refill verfügbar</h3>
        <p className={styles.message}>
          Letzter Termin vor {formatWeeks(eligibility.weeksSinceLastAppointment || 0)}
        </p>
        {savings > 0 && (
          <Badge className={styles.savingsBadge}>
            Spare {formatPrice(savings)}
          </Badge>
        )}
      </div>

      <div className={styles.options}>
        {eligibility.availableRefills.map((refill) => (
          <div 
            key={refill.id} 
            className={`${styles.refillOption} ${refill.recommended ? styles.recommended : ''}`}
          >
            <div className={styles.optionHeader}>
              <div className={styles.optionTitleGroup}>
                <span className={styles.optionTitle}>Refill {refill.description}</span>
                {refill.recommended && (
                  <Badge>Empfohlen</Badge>
                )}
              </div>
              <span className={styles.price}>{formatPrice(refill.price)}</span>
            </div>
            
            <p className={styles.optionDescription}>
              Auffrischung nach {formatWeeks(refill.weekThreshold)}
            </p>
            
            <Button
              variant={selectedOption && typeof selectedOption === 'object' && selectedOption.id === refill.id ? 'primary' : 'secondary'}
              size="s"
              onClick={() => onSelectRefill?.(refill)}
              className={styles.selectButton}
            >
              {selectedOption && typeof selectedOption === 'object' && selectedOption.id === refill.id ? 'Ausgewählt' : 'Auswählen'}
            </Button>
          </div>
        ))}

        <div className={styles.newApplicationOption}>
          <div className={styles.optionHeader}>
            <span className={styles.optionTitle}>Neuanlage</span>
            <span className={styles.price}>{formatPrice(newApplicationPrice)}</span>
          </div>
          <p className={styles.optionDescription}>
            Komplette neue {treatmentName} Behandlung
          </p>
          <Button
            variant={selectedOption === 'new' ? 'primary' : 'secondary'}
            size="s"
            onClick={onSelectNewApplication}
            className={styles.selectButton}
          >
            {selectedOption === 'new' ? 'Ausgewählt' : 'Auswählen'}
          </Button>
        </div>
      </div>

      {eligibility.lastAppointmentDate && (
        <div className={styles.footer}>
          <p className={styles.lastAppointment}>
            Letzter Termin: {new Date(eligibility.lastAppointmentDate).toLocaleDateString('de-DE')}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Simple refill pricing display without selection functionality.
 */
export function RefillPricingDisplay({
  eligibility,
  newApplicationPrice,
  treatmentName,
  className
}: Omit<RefillPricingCardProps, 'onSelectRefill' | 'onSelectNewApplication' | 'selectedOption'>) {
  return (
    <RefillPricingCard
      eligibility={eligibility}
      newApplicationPrice={newApplicationPrice}
      treatmentName={treatmentName}
      className={className}
    />
  );
}