'use client';

import React, { useState, useEffect } from 'react';
import { Text, Spinner } from '@once-ui-system/core';
import styles from '../../../app/(client)/mein-bereich/einwilligung/einwilligung.module.scss';

// ============================================
// Types für DSGVO-konforme Datenverwaltung
// ============================================

interface EditableUserData {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'email' | 'phone' | 'textarea';
  placeholder?: string;
  required?: boolean;
}

interface ConsentRecord {
  id: string;
  title: string;
  description: string;
  type: 'treatment' | 'data_processing' | 'photo_documentation' | 'marketing' | 'terms' | 'privacy';
  status: 'granted' | 'revoked' | 'pending';
  grantedAt?: string;
  revokedAt?: string;
  version: string;
  required: boolean;
}

interface UserProfile {
  editableData: EditableUserData[];
  consents: ConsentRecord[];
  lastUpdated: string;
}

// ============================================
// Mock Data für Demo
// ============================================
const mockUserProfile: UserProfile = {
  editableData: [
    {
      id: 'phone',
      label: 'Telefonnummer',
      value: '+49 123 456789',
      type: 'phone',
      placeholder: '+49 ...',
      required: true
    },
    {
      id: 'address',
      label: 'Adresse',
      value: 'Musterstraße 123, 12345 Berlin',
      type: 'textarea',
      placeholder: 'Straße, PLZ Ort'
    },
    {
      id: 'notes',
      label: 'Persönliche Notizen',
      value: 'Trage Brille, empfindliche Haut',
      type: 'textarea',
      placeholder: 'z.B. Allergien, Präferenzen...'
    },
    {
      id: 'photo_preference',
      label: 'Foto-Präferenz',
      value: 'Keine Fotos während der Behandlung',
      type: 'text',
      placeholder: 'Ihre Präferenz...'
    }
  ],
  consents: [
    {
      id: 'terms',
      title: 'Allgemeine Geschäftsbedingungen',
      description: 'Zustimmung zu den AGB des Kosmetikstudios, einschließlich Terminbuchung und Stornierungsfristen.',
      type: 'terms',
      status: 'granted',
      grantedAt: '2024-01-15T10:30:00Z',
      version: '2024.1',
      required: true
    },
    {
      id: 'privacy',
      title: 'Datenschutzerklärung',
      description: 'Einwilligung zur Verarbeitung personenbezogener Daten gemäß DSGVO.',
      type: 'privacy',
      status: 'granted',
      grantedAt: '2024-01-15T10:30:00Z',
      version: '2024.1',
      required: true
    },
    {
      id: 'treatment_consent',
      title: 'Behandlungsaufklärung Wimpernverlängerung',
      description: 'Aufklärung über Risiken und Einwilligung in Wimpernbehandlungen (Lifting/Extensions).',
      type: 'treatment',
      status: 'granted',
      grantedAt: '2024-01-15T10:45:00Z',
      version: '2024.1',
      required: true
    },
    {
      id: 'health_data',
      title: 'Gesundheitsdaten-Verarbeitung',
      description: 'Einwilligung zur Speicherung und Verarbeitung von Anamnese-Daten (Allergien, Augenerkrankungen).',
      type: 'data_processing',
      status: 'granted',
      grantedAt: '2024-01-15T10:45:00Z',
      version: '2024.1',
      required: true
    },
    {
      id: 'photo_documentation',
      title: 'Foto-Dokumentation',
      description: 'Vorher-/Nachher-Fotos zu Dokumentations- und Behandlungszwecken im passwortgeschützten System.',
      type: 'photo_documentation',
      status: 'granted',
      grantedAt: '2024-01-15T10:45:00Z',
      version: '2024.1',
      required: false
    },
    {
      id: 'marketing_photos',
      title: 'Marketing-Fotos',
      description: 'Verwendung anonymisierter Fotos für Marketingzwecke (Website, Social Media).',
      type: 'marketing',
      status: 'revoked',
      grantedAt: '2024-01-15T10:45:00Z',
      revokedAt: '2024-02-10T14:20:00Z',
      version: '2024.1',
      required: false
    }
  ],
  lastUpdated: '2024-02-10T14:20:00Z'
};

// ============================================
// Hauptkomponente
// ============================================
export function ConsentManagement() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showRevokeModal, setShowRevokeModal] = useState<string | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState<string | null>(null);

  // Simuliere API-Aufruf
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      // Simuliere Netzwerk-Delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfile(mockUserProfile);
      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleEditField = (fieldId: string, currentValue: string) => {
    setEditingField(fieldId);
    setEditValue(currentValue);
  };

  const handleSaveField = async (fieldId: string) => {
    if (!profile) return;

    // Simuliere API-Aufruf
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedProfile = {
      ...profile,
      editableData: profile.editableData.map(field =>
        field.id === fieldId ? { ...field, value: editValue } : field
      ),
      lastUpdated: new Date().toISOString()
    };

    setProfile(updatedProfile);
    setEditingField(null);
    setEditValue('');
  };

  const handleRevokeConsent = async (consentId: string) => {
    if (!profile) return;

    // Simuliere API-Aufruf
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedProfile = {
      ...profile,
      consents: profile.consents.map(consent =>
        consent.id === consentId
          ? {
              ...consent,
              status: 'revoked' as const,
              revokedAt: new Date().toISOString()
            }
          : consent
      ),
      lastUpdated: new Date().toISOString()
    };

    setProfile(updatedProfile);
    setShowRevokeModal(null);

    // Hier würde normalerweise ein Admin-Signal ausgelöst werden
    console.log(`Admin-Signal: Einwilligung ${consentId} wurde widerrufen`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <Spinner size="l" />
        <Text className={styles.loadingText}>
          Lade Ihre Datenschutz-Einstellungen...
        </Text>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.loadingState}>
        <Text>Fehler beim Laden der Daten</Text>
      </div>
    );
  }

  return (
    <div className={styles.compactConsentContainer}>
      {/* Compact Header */}
      <div className={styles.compactHeader}>
        <h1 className={styles.compactTitle}>
          <span className={styles.headerAccent}>Daten</span> & Einwilligungen
        </h1>
        <p className={styles.compactSubtitle}>
          DSGVO-konforme Verwaltung Ihrer persönlichen Daten und Einwilligungen
        </p>
      </div>

      {/* Daten-Kategorien */}
      <div className={styles.dataCategories}>
        
        {/* Variable Kundendaten */}
        <div className={styles.categoryCard}>
          <div className={styles.categoryHeader}>
            <div className={`${styles.categoryIcon} ${styles.editable}`}>
              ✏️
            </div>
            <div className={styles.categoryInfo}>
              <h2 className={styles.categoryTitle}>Variable Kundendaten</h2>
              <p className={styles.categoryDescription}>
                Diese Daten können Sie jederzeit selbst bearbeiten und aktualisieren.
              </p>
            </div>
          </div>

          <div className={styles.dataFields}>
            {profile.editableData.map((field) => (
              <div key={field.id} className={styles.dataField}>
                <div className={styles.fieldInfo}>
                  <div className={styles.fieldLabel}>{field.label}</div>
                  {editingField === field.id ? (
                    <div style={{ marginTop: '8px' }}>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          placeholder={field.placeholder}
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(196, 96, 122, 0.2)',
                            fontFamily: 'Merriweather Sans, sans-serif',
                            fontSize: '14px',
                            resize: 'vertical'
                          }}
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          placeholder={field.placeholder}
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(196, 96, 122, 0.2)',
                            fontFamily: 'Merriweather Sans, sans-serif',
                            fontSize: '14px'
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className={`${styles.fieldValue} ${!field.value ? styles.fieldEmpty : ''}`}>
                      {field.value || 'Nicht angegeben'}
                    </div>
                  )}
                </div>
                <div className={styles.fieldActions}>
                  {editingField === field.id ? (
                    <>
                      <button
                        className={styles.editButton}
                        onClick={() => handleSaveField(field.id)}
                        disabled={!editValue.trim()}
                      >
                        Speichern
                      </button>
                      <button
                        className={styles.viewButton}
                        onClick={() => {
                          setEditingField(null);
                          setEditValue('');
                        }}
                      >
                        Abbrechen
                      </button>
                    </>
                  ) : (
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditField(field.id, field.value)}
                    >
                      Bearbeiten
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feste Einwilligungen */}
        <div className={styles.categoryCard}>
          <div className={styles.categoryHeader}>
            <div className={`${styles.categoryIcon} ${styles.consent}`}>
              🔒
            </div>
            <div className={styles.categoryInfo}>
              <h2 className={styles.categoryTitle}>Feste Einwilligungen & Dokumente</h2>
              <p className={styles.categoryDescription}>
                Diese Einwilligungen sind nach Erteilung gesperrt. Sie können sie nur einsehen. 
                Ein Widerruf löst ein Admin-Signal aus.
              </p>
            </div>
          </div>

          <div className={styles.consentItems}>
            {profile.consents.map((consent) => (
              <div 
                key={consent.id} 
                className={`${styles.consentItem} ${styles[consent.status]}`}
              >
                <div className={`${styles.consentStatus} ${styles[consent.status]}`}>
                  {consent.status === 'granted' ? '✓' : consent.status === 'revoked' ? '⚠' : '⏳'}
                </div>
                
                <div className={styles.consentContent}>
                  <div className={styles.consentTitle}>{consent.title}</div>
                  <div className={styles.consentDescription}>{consent.description}</div>
                  
                  <div className={styles.consentMeta}>
                    <div className={styles.consentDate}>
                      📅 {consent.status === 'granted' && consent.grantedAt 
                        ? `Erteilt: ${formatDate(consent.grantedAt)}`
                        : consent.status === 'revoked' && consent.revokedAt
                        ? `Widerrufen: ${formatDate(consent.revokedAt)}`
                        : 'Ausstehend'
                      }
                    </div>
                    <div>Version: {consent.version}</div>
                    {consent.required && <div>🔴 Erforderlich</div>}
                  </div>
                </div>

                <div className={styles.consentActions}>
                  <button
                    className={styles.viewButton}
                    onClick={() => setShowDocumentModal(consent.id)}
                  >
                    Dokument ansehen
                  </button>
                  
                  {consent.status === 'granted' && !consent.required && (
                    <button
                      className={styles.revokeButton}
                      onClick={() => setShowRevokeModal(consent.id)}
                    >
                      Widerrufen
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Warnung für erforderliche Einwilligungen */}
      {profile.consents.some(c => c.required && c.status === 'revoked') && (
        <div className={styles.warningCard}>
          <div className={styles.warningHeader}>
            <div className={styles.warningIcon}>⚠️</div>
            <div className={styles.warningTitle}>Wichtiger Hinweis</div>
          </div>
          <div className={styles.warningText}>
            Einige erforderliche Einwilligungen wurden widerrufen. Dies kann die Nutzung 
            unserer Dienstleistungen einschränken. Bitte kontaktieren Sie uns für weitere Informationen.
          </div>
        </div>
      )}

      {/* Rechtliche Informationen */}
      <div className={styles.legalSection}>
        <h3 className={styles.legalTitle}>Ihre Rechte nach DSGVO</h3>
        <div className={styles.legalText}>
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, 
          Datenübertragbarkeit und Widerspruch. Bei Fragen zu Ihren Daten oder zum Widerruf von 
          Einwilligungen kontaktieren Sie uns gerne.
        </div>
        <div className={styles.legalLinks}>
          <a href="/datenschutz" className={styles.legalLink}>Datenschutzerklärung</a>
          <a href="/agb" className={styles.legalLink}>AGB</a>
          <a href="/kontakt" className={styles.legalLink}>Kontakt</a>
        </div>
      </div>

      {/* Widerruf-Modal */}
      {showRevokeModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Einwilligung widerrufen</h3>
              <p className={styles.modalSubtitle}>
                Sind Sie sicher, dass Sie diese Einwilligung widerrufen möchten?
              </p>
            </div>
            
            <div className={styles.modalContent}>
              <p className={styles.modalText}>
                Der Widerruf Ihrer Einwilligung hat zur Folge, dass wir die entsprechenden 
                Datenverarbeitungen nicht mehr durchführen können. Dies kann Auswirkungen 
                auf die Erbringung unserer Dienstleistungen haben.
              </p>
              <p className={styles.modalText}>
                <strong>Wichtig:</strong> Ein Admin wird über Ihren Widerruf informiert und 
                wird sich gegebenenfalls mit Ihnen in Verbindung setzen.
              </p>
            </div>

            <div className={styles.modalActions}>
              <button
                className={`${styles.modalButton} ${styles.secondary}`}
                onClick={() => setShowRevokeModal(null)}
              >
                Abbrechen
              </button>
              <button
                className={`${styles.modalButton} ${styles.danger}`}
                onClick={() => handleRevokeConsent(showRevokeModal)}
              >
                Widerrufen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dokument-Ansicht Modal */}
      {showDocumentModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Dokument ansehen</h3>
              <p className={styles.modalSubtitle}>
                {profile.consents.find(c => c.id === showDocumentModal)?.title}
              </p>
            </div>
            
            <div className={styles.modalContent}>
              <p className={styles.modalText}>
                Hier würde der vollständige Text des Dokuments angezeigt werden. 
                In einer echten Implementierung würde hier der entsprechende 
                Vertragstext, die Datenschutzerklärung oder das Aufklärungsformular 
                geladen werden.
              </p>
              <p className={styles.modalText}>
                <strong>Version:</strong> {profile.consents.find(c => c.id === showDocumentModal)?.version}
              </p>
            </div>

            <div className={styles.modalActions}>
              <button
                className={`${styles.modalButton} ${styles.primary}`}
                onClick={() => setShowDocumentModal(null)}
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsentManagement;