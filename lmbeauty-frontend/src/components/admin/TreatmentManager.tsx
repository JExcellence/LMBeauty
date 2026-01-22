'use client';

import { useState } from 'react';
import { Text, Icon, Button } from '@once-ui-system/core';
import { useTreatments } from '@/hooks/useAdmin';
import styles from './TreatmentManager.module.scss';

function TreatmentOffering({ treatment }: { treatment: any }) {
  const categoryNames = {
    'WIMPERN': 'Wimpern',
    'AUGENBRAUEN': 'Augenbrauen', 
    'GESICHT': 'Gesicht',
    'NAEGEL': 'Nägel',
    'EXTRAS': 'Extras'
  };

  const categoryName = (categoryNames as any)[treatment.category] || treatment.category;

  return (
    <div className={styles.treatmentOffering}>
      <div className={styles.essence}>
        <Text className={styles.treatmentName}>{treatment.name}</Text>
        <Text className={styles.treatmentDescription}>
          {treatment.description}
        </Text>
        <Text className={styles.categoryLabel}>{categoryName}</Text>
      </div>

      <div className={styles.details}>
        <div className={styles.duration}>
          <Text className={styles.durationText}>{treatment.durationMinutes} Min</Text>
        </div>
        <div className={styles.investment}>
          <Text className={styles.priceText}>{treatment.price}€</Text>
        </div>
      </div>

      <div className={styles.gentleActions}>
        <Button
          variant="tertiary"
          size="s"
          style={{
            background: 'rgba(0, 0, 0, 0.04)',
            border: 'none',
            padding: '8px 12px'
          }}
        >
          <Icon name="edit" size="xs" />
        </Button>
      </div>
    </div>
  );
}

function CategoryGroup({ category, treatments }: { 
  category: string; 
  treatments: any[]; 
}) {
  const categoryNames = {
    'WIMPERN': 'Wimpern',
    'AUGENBRAUEN': 'Augenbrauen', 
    'GESICHT': 'Gesicht',
    'NAEGEL': 'Nägel',
    'EXTRAS': 'Extras'
  };

  const categoryName = (categoryNames as any)[category] || category;

  if (treatments.length === 0) return null;

  return (
    <div className={styles.categoryGroup}>
      <div className={styles.categoryHeader}>
        <Text className={styles.categoryTitle}>{categoryName}</Text>
        <Text className={styles.categoryCount}>
          {treatments.length} {treatments.length === 1 ? 'Behandlung' : 'Behandlungen'}
        </Text>
      </div>
      
      <div className={styles.offeringsList}>
        {treatments.map((treatment) => (
          <TreatmentOffering key={treatment.id} treatment={treatment} />
        ))}
      </div>
    </div>
  );
}

export function TreatmentManager() {
  const { treatments, isLoading } = useTreatments();

  const groupedTreatments = treatments?.reduce((groups: any, treatment: any) => {
    const category = treatment.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(treatment);
    return groups;
  }, {}) || {};

  if (isLoading) {
    return (
      <div className={styles.quietSpace} style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '64px 24px',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '20px',
        margin: '20px'
      }}>
        <Text className={styles.quietText} style={{ 
          fontSize: '14px', 
          color: 'rgba(0, 0, 0, 0.4)' 
        }}>
          Behandlungen werden geladen...
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.treatmentFlow} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '48px',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <div className={styles.flowHeader} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        textAlign: 'center',
        padding: '40px 24px',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(255, 107, 157, 0.12)'
      }}>
        <Text className={styles.flowTitle} style={{
          fontSize: '36px',
          fontWeight: '300',
          color: '#2D2A26',
          letterSpacing: '-0.01em'
        }}>
          Behandlungen
        </Text>
        <Text className={styles.flowSubtitle} style={{
          fontSize: '16px',
          fontWeight: '300',
          color: '#8A8580',
          textTransform: 'lowercase',
          letterSpacing: '0.02em'
        }}>
          Deine kuratierte Auswahl an Beauty-Services
        </Text>
      </div>

      <div className={styles.offeringsRiver} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '48px'
      }}>
        {Object.keys(groupedTreatments).length === 0 ? (
          <div className={styles.emptyFlow} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            padding: '80px 24px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 107, 157, 0.08)'
          }}>
            <div className={styles.emptyIcon} style={{
              opacity: '0.3',
              marginBottom: '8px',
              color: '#D4708A'
            }}>
              <Icon name="heart" size="l" />
            </div>
            <Text className={styles.emptyTitle} style={{
              fontSize: '20px',
              fontWeight: '300',
              color: '#2D2A26'
            }}>
              Noch keine Behandlungen
            </Text>
            <Text className={styles.emptyMessage} style={{
              fontSize: '16px',
              fontWeight: '300',
              color: '#8A8580',
              lineHeight: '1.5'
            }}>
              Deine ersten Services werden hier erscheinen
            </Text>
          </div>
        ) : (
          <div className={styles.categoriesList} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '48px'
          }}>
            {Object.entries(groupedTreatments).map(([category, categoryTreatments]) => (
              <CategoryGroup 
                key={category} 
                category={category} 
                treatments={categoryTreatments as any[]} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TreatmentManager;