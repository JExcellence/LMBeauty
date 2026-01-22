'use client';

import { useState, useEffect } from 'react';
import { Spinner } from '@once-ui-system/core';
import { useProfile } from '@/hooks/useMeinBereich';
import styles from '../../../app/(client)/mein-bereich/mein-bereich.module.scss';

interface ConsentData {
  agbAccepted: boolean;
  agbAcceptedAt?: string;
  healthCheckCompleted: boolean;
  dataPrivacyAccepted: boolean;
}

export function ProfilSection() {
  const { profile, isLoading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [consent, setConsent] = useState<ConsentData>({
    agbAccepted: false,
    healthCheckCompleted: false,
    dataPrivacyAccepted: false
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    street: '',
    city: '',
    postalCode: '',
    contactMethod: 'whatsapp' as 'whatsapp' | 'email',
    marketingOptIn: false
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        birthDate: '',
        street: '',
        city: '',
        postalCode: '',
        contactMethod: profile.preferences?.contactMethod || 'whatsapp',
        marketingOptIn: profile.preferences?.marketingOptIn || false
      });
    }
  }, [profile]);

  if (isLoading) {
    return (
      <div className={styles.softPanel}>
        <div className={styles.loadingState}>
          <Spinner size="m" />
          <p className={styles.loadingText}>Wird geladen...</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        preferences: {
          contactMethod: formData.contactMethod,
          marketingOptIn: formData.marketingOptIn
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        birthDate: '',
        street: '',
        city: '',
        postalCode: '',
        contactMethod: profile.preferences?.contactMethod || 'whatsapp',
        marketingOptIn: profile.preferences?.marketingOptIn || false
      });
    }
  };

  const initials = profile
    ? `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`
    : '?';

  return (
    <>
      <div className={styles.softPanel}>
        <div className={styles.profileSection}>
          <div className={styles.profileHeader}>
            <div className={styles.profileAvatar}>{initials}</div>
            <div className={styles.profileInfo}>
              <p className={styles.profileName}>
                {profile?.firstName} {profile?.lastName}
              </p>
              <p className={styles.profileEmail}>{profile?.email}</p>
            </div>
          </div>

          <div className={styles.formSection}>
            <p className={styles.formSectionTitle}>Persönliche Daten</p>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>Vorname</label>
              <input
                type="text"
                className={styles.fieldInput}
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>Nachname</label>
              <input
                type="text"
                className={styles.fieldInput}
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>E-Mail</label>
              <input
                type="email"
                className={styles.fieldInput}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>Telefon</label>
              <input
                type="tel"
                className={styles.fieldInput}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                placeholder="Für Terminerinnerungen"
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>Geburtsdatum</label>
              <input
                type="date"
                className={styles.fieldInput}
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                disabled={!isEditing}
              />
              <p className={styles.fieldHint}>Für eine kleine Überraschung an deinem Ehrentag</p>
            </div>
          </div>

          <div className={styles.formSection}>
            <p className={styles.formSectionTitle}>Adresse</p>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>Straße & Hausnummer</label>
              <input
                type="text"
                className={styles.fieldInput}
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>PLZ</label>
              <input
                type="text"
                className={styles.fieldInput}
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>Stadt</label>
              <input
                type="text"
                className={styles.fieldInput}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <p className={styles.formSectionTitle}>Kontakt</p>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>Bevorzugter Kontaktweg</label>
              <div className={styles.toggleGroup}>
                <button
                  type="button"
                  className={`${styles.toggleOption} ${formData.contactMethod === 'whatsapp' ? styles.active : ''}`}
                  onClick={() => setFormData({ ...formData, contactMethod: 'whatsapp' })}
                  disabled={!isEditing}
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  className={`${styles.toggleOption} ${formData.contactMethod === 'email' ? styles.active : ''}`}
                  onClick={() => setFormData({ ...formData, contactMethod: 'email' })}
                  disabled={!isEditing}
                >
                  E-Mail
                </button>
              </div>
            </div>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>Neuigkeiten & Angebote</label>
              <div className={styles.toggleGroup}>
                <button
                  type="button"
                  className={`${styles.toggleOption} ${formData.marketingOptIn ? styles.active : ''}`}
                  onClick={() => setFormData({ ...formData, marketingOptIn: true })}
                  disabled={!isEditing}
                >
                  Ja, gerne
                </button>
                <button
                  type="button"
                  className={`${styles.toggleOption} ${!formData.marketingOptIn ? styles.active : ''}`}
                  onClick={() => setFormData({ ...formData, marketingOptIn: false })}
                  disabled={!isEditing}
                >
                  Nein, danke
                </button>
              </div>
            </div>
          </div>

          <div className={styles.actionRow}>
            {isEditing ? (
              <>
                <button
                  className={styles.primaryAction}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Wird gespeichert...' : 'Speichern'}
                </button>
                <button className={styles.secondaryAction} onClick={handleCancel}>
                  Abbrechen
                </button>
              </>
            ) : (
              <button
                className={styles.secondaryAction}
                onClick={() => setIsEditing(true)}
              >
                Bearbeiten
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.softPanel}>
        <div className={styles.consentSection}>
          <h3 className={styles.consentTitle}>Behandlungsvertrag & Einwilligung</h3>
          <p className={styles.consentText}>
            Vor deiner ersten Behandlung benötigen wir einige wichtige Informationen 
            zu deiner Gesundheit und deine Einwilligung zu den Behandlungsbedingungen.
          </p>

          {consent.agbAccepted ? (
            <div className={styles.consentStatus}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.78 5.97l-4.5 5.5a.75.75 0 0 1-1.14.02l-2-2.25a.75.75 0 1 1 1.12-1l1.42 1.6 3.96-4.85a.75.75 0 1 1 1.14.98z"/>
              </svg>
              Abgeschlossen am {consent.agbAcceptedAt}
            </div>
          ) : (
            <>
              <a href="/mein-bereich/einwilligung" className={styles.primaryAction}>
                Einwilligungen verwalten
              </a>
              <p className={styles.consentHint}>
                Falls du das Formular nicht online ausfüllst, wird es vor deinem 
                ersten Termin im Studio ausgefüllt.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
