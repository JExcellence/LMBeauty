'use client';

import { useState } from 'react';
import { Badge, Button } from '@once-ui-system/core';
import { RefillPricingCard, RefillEligibility, RefillOption } from './RefillPricingCard';
import styles from './TreatmentWithRefills.module.scss';

export interface Treatment {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  imageUrl?: string;
  hasRefillOptions: boolean;
  category: string;
}

interface TreatmentWithRefillsProps {
  treatment: Treatment;
  refillEligibility?: RefillEligibility;
  isSelected?: boolean;
  onSelect?: (treatment: Treatment, refillOption?: RefillOption | 'new') => void;
  showRefillPricing?: boolean;
  customerId?: string;
  className?: string;
}

/**
 * Enhanced treatment card component that displays refill pricing when applicable.
 */
export function TreatmentWithRefills({
  treatment,
  refillEligibility,
  isSelected = false,
  onSelect,
  showRefillPricing = true,
  customerId,
  className
}: TreatmentWithRefillsProps) {
  const [selectedRefillOption, setSelectedRefillOption] = useState<RefillOption | 'new' | null>(null);
  const [showRefillDetails, setShowRefillDetails] = useState(false);

  const formatPrice = (price: number) => `${price.toFixed(0)}€`;
  const formatDuration = (duration: number) => `${duration} Min.`;

  const handleSelectTreatment = () => {
    if (treatment.hasRefillOptions && refillEligibility?.isEligible && showRefillPricing) {
      // Show refill options
      setShowRefillDetails(true);
    } else {
      // Direct selection for treatments without refills or when not eligible
      onSelect?.(treatment, 'new');
    }
  };

  const handleRefillSelection = (refillOption: RefillOption) => {
    setSelectedRefillOption(refillOption);
    onSelect?.(treatment, refillOption);
  };

  const handleNewApplicationSelection = () => {
    setSelectedRefillOption('new');
    onSelect?.(treatment, 'new');
  };

  const getDisplayPrice = () => {
    if (refillEligibility?.isEligible && refillEligibility.recommendedOption) {
      return refillEligibility.recommendedOption.price;
    }
    return treatment.price;
  };

  const hasRefillDiscount = refillEligibility?.isEligible && 
                           refillEligibility.recommendedOption && 
                           refillEligibility.recommendedOption.price < treatment.price;

  return (
    <div className={`${styles.treatmentCard} ${isSelected ? styles.selected : ''} ${className || ''}`}>
      {/* Treatment Image */}
      {treatment.imageUrl && (
        <div className={styles.imageContainer}>
          <img 
            src={treatment.imageUrl} 
            alt={treatment.name}
            className={styles.treatmentImage}
          />
          {hasRefillDiscount && (
            <Badge className={styles.discountBadge}>
              Refill verfügbar
            </Badge>
          )}
        </div>
      )}

      {/* Treatment Info */}
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.treatmentName}>{treatment.name}</h3>
          <div className={styles.priceContainer}>
            {hasRefillDiscount && (
              <span className={styles.originalPrice}>
                {formatPrice(treatment.price)}
              </span>
            )}
            <span className={styles.currentPrice}>
              {formatPrice(getDisplayPrice())}
            </span>
          </div>
        </div>

        <p className={styles.description}>{treatment.description}</p>

        <div className={styles.meta}>
          <span className={styles.duration}>{formatDuration(treatment.duration)}</span>
          {treatment.hasRefillOptions && (
            <Badge>
              Refill möglich
            </Badge>
          )}
        </div>

        {/* Refill Eligibility Info */}
        {treatment.hasRefillOptions && refillEligibility && showRefillPricing && (
          <div className={styles.refillInfo}>
            {refillEligibility.isEligible ? (
              <div className={styles.eligibleInfo}>
                <span className={styles.eligibleText}>
                  ✓ Refill verfügbar - spare bis zu {formatPrice(treatment.price - (refillEligibility.recommendedOption?.price || treatment.price))}
                </span>
              </div>
            ) : (
              <div className={styles.notEligibleInfo}>
                <span className={styles.notEligibleText}>
                  {refillEligibility.message}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button
          variant={isSelected ? 'primary' : 'secondary'}
          size="m"
          onClick={handleSelectTreatment}
          className={styles.selectButton}
        >
          {isSelected ? 'Ausgewählt' : 'Auswählen'}
        </Button>
      </div>

      {/* Refill Pricing Details */}
      {showRefillDetails && refillEligibility && (
        <div className={styles.refillDetails}>
          <RefillPricingCard
            eligibility={refillEligibility}
            newApplicationPrice={treatment.price}
            treatmentName={treatment.name}
            onSelectRefill={handleRefillSelection}
            onSelectNewApplication={handleNewApplicationSelection}
            selectedOption={selectedRefillOption}
          />
          
          <Button
            variant="tertiary"
            size="s"
            onClick={() => setShowRefillDetails(false)}
            className={styles.hideRefillsButton}
          >
            Optionen ausblenden
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Simple treatment card without refill functionality.
 */
export function SimpleTreatmentCard({
  treatment,
  isSelected = false,
  onSelect,
  className
}: Omit<TreatmentWithRefillsProps, 'refillEligibility' | 'showRefillPricing' | 'customerId'>) {
  return (
    <TreatmentWithRefills
      treatment={treatment}
      isSelected={isSelected}
      onSelect={onSelect}
      showRefillPricing={false}
      className={className}
    />
  );
}