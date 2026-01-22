'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Text, Icon, Button, Spinner, Avatar, Switch, Input, Textarea } from '@once-ui-system/core';
import { useCustomerProfile } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import styles from './CustomerDetail.module.scss';

interface CustomerDetailProps {
  customerId: number;
}

interface EditData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  active: boolean;
}

const statusConfig = {
  PENDING: { label: 'Ausstehend', color: '#f59e0b' },
  CONFIRMED: { label: 'Bestätigt', color: '#10b981' },
  COMPLETED: { label: 'Abgeschlossen', color: '#6b7280' },
  CANCELLED: { label: 'Storniert', color: '#ef4444' },
};

function CustomerProfileCard({ 
  customer, 
  currentUser,
  onEdit, 
  onSave, 
  onCancel, 
  isEditing, 
  isSaving,
  editData, 
  onEditDataChange, 
  onStatusToggle 
}: {
  customer: any;
  currentUser: any;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
  isSaving: boolean;
  editData: EditData;
  onEditDataChange: (field: string, value: any) => void;
  onStatusToggle: (active: boolean) => void;
}) {
  const fullName = customer.firstName ? `${customer.firstName} ${customer.lastName || ''}`.trim() : null;
  const displayName = fullName || customer.email;
  const initials = fullName 
    ? `${customer.firstName?.[0] || ''}${customer.lastName?.[0] || ''}`.toUpperCase()
    : customer.email?.[0]?.toUpperCase() || '?';

  const memberSince = new Date(customer.createdAt).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long'
  });

  // Check if this customer is the current user (admin)
  const isCurrentUser = currentUser && customer && (
    String(currentUser.id) === String(customer.id) || 
    currentUser.email === customer.email
  );

  // Prevent admin from disabling themselves
  const canToggleStatus = !isCurrentUser || editData.active;

  return (
    <div className={styles.profileCard}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarSection}>
          <Avatar
            size="xl"
            src={customer.profileImage}
            value={initials}
            className={styles.customerAvatar}
          />
          <div className={styles.statusIndicator}>
            <Switch
              id="customer-active"
              isChecked={editData.active}
              onToggle={() => {
                if (!canToggleStatus) return;
                
                const newValue = !editData.active;
                if (isEditing) {
                  onEditDataChange('active', newValue);
                } else {
                  onStatusToggle(newValue);
                }
              }}
              disabled={!canToggleStatus}
            />
            <Text className={styles.statusLabel}>
              {editData.active ? 'Aktiv' : 'Deaktiviert'}
            </Text>
            {isCurrentUser && (
              <Text className={editData.active ? styles.infoText : styles.warningText}>
                {editData.active ? 'Eigenes Konto' : 'Sie können sich nicht selbst deaktivieren'}
              </Text>
            )}
          </div>
        </div>

        <div className={styles.profileInfo}>
          {isEditing ? (
            <div className={styles.editForm}>
              <div className={styles.nameFields}>
                <Input
                  id="firstName"
                  label="Vorname"
                  value={editData.firstName}
                  onChange={(e) => onEditDataChange('firstName', e.target.value)}
                  className={styles.nameInput}
                />
                <Input
                  id="lastName"
                  label="Nachname"
                  value={editData.lastName}
                  onChange={(e) => onEditDataChange('lastName', e.target.value)}
                  className={styles.nameInput}
                />
              </div>
              <Input
                id="email"
                label="E-Mail"
                type="email"
                value={editData.email}
                onChange={(e) => onEditDataChange('email', e.target.value)}
              />
              <Input
                id="phone"
                label="Telefon"
                type="tel"
                value={editData.phone}
                onChange={(e) => onEditDataChange('phone', e.target.value)}
              />
              <Textarea
                id="notes"
                label="Persönliche Notizen"
                value={editData.notes}
                onChange={(e) => onEditDataChange('notes', e.target.value)}
                rows={3}
              />
            </div>
          ) : (
            <div className={styles.profileDetails}>
              <Text className={styles.customerName}>{displayName}</Text>
              {fullName && customer.email && (
                <Text className={styles.customerEmail}>{customer.email}</Text>
              )}
              {customer.phone && (
                <Text className={styles.customerPhone}>{customer.phone}</Text>
              )}
              <Text className={styles.memberSince}>Kundin seit {memberSince}</Text>
              {customer.notes && (
                <div className={styles.notesSection}>
                  <Text className={styles.notesLabel}>Persönliche Notizen:</Text>
                  <Text className={styles.notesText}>{customer.notes}</Text>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.profileActions}>
          {isEditing ? (
            <div className={styles.editActions}>
              <Button
                variant="tertiary"
                size="s"
                onClick={onCancel}
                className={styles.cancelButton}
              >
                <Text>Abbrechen</Text>
              </Button>
              <Button
                variant="primary"
                size="s"
                onClick={onSave}
                className={styles.saveButton}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Spinner size="xs" />
                    <Text>Speichern...</Text>
                  </>
                ) : (
                  <Text>Speichern</Text>
                )}
              </Button>
            </div>
          ) : (
            <Button
              variant="tertiary"
              size="s"
              onClick={onEdit}
              className={styles.editButton}
            >
              <Icon name="edit" size="xs" />
              <Text>Bearbeiten</Text>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function LoyaltyCard({ customer }: { customer: any }) {
  const stamps = customer.loyaltyStatus?.currentStamps || 0;
  const requiredStamps = customer.loyaltyStatus?.requiredStamps || 10;
  const progress = (stamps / requiredStamps) * 100;

  return (
    <div className={styles.loyaltyCard}>
      <div className={styles.loyaltyHeader}>
        <Icon name="heart" size="m" className={styles.loyaltyIcon} />
        <Text className={styles.loyaltyTitle}>Treueprogramm</Text>
      </div>
      
      <div className={styles.loyaltyContent}>
        <div className={styles.stampsGrid}>
          {Array.from({ length: requiredStamps }).map((_, index) => (
            <div
              key={index}
              className={`${styles.stamp} ${index < stamps ? styles.filled : ''}`}
            >
              {index < stamps ? (
                <Icon name="heart" size="xs" className={styles.stampIcon} />
              ) : (
                <div className={styles.stampEmpty} />
              )}
            </div>
          ))}
        </div>
        
        <div className={styles.loyaltyProgress}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <Text className={styles.progressText}>
            {stamps} von {requiredStamps} Stempel
          </Text>
        </div>
      </div>
    </div>
  );
}

function AppointmentHistory({ appointments }: { appointments: any[] }) {
  if (appointments.length === 0) {
    return (
      <div className={styles.historyCard}>
        <div className={styles.historyHeader}>
          <Icon name="calendar" size="m" />
          <Text className={styles.historyTitle}>Terminhistorie</Text>
        </div>
        <div className={styles.emptyHistory}>
          <Icon name="calendar" size="l" className={styles.emptyIcon} />
          <Text className={styles.emptyTitle}>Noch keine Termine</Text>
          <Text className={styles.emptyDescription}>
            Die Terminhistorie wird hier angezeigt, sobald Termine gebucht werden
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.historyCard}>
      <div className={styles.historyHeader}>
        <Icon name="calendar" size="m" />
        <Text className={styles.historyTitle}>Terminhistorie</Text>
        <div className={styles.historyCount}>
          <Text className={styles.countText}>{appointments.length} Termine</Text>
        </div>
      </div>
      
      <div className={styles.appointmentsList}>
        {appointments.map((appointment) => {
          const config = (statusConfig as any)[appointment.status] || statusConfig.PENDING;
          const appointmentDate = new Date(appointment.scheduledAt);
          
          return (
            <div key={appointment.id} className={styles.appointmentItem}>
              <div className={styles.appointmentDate}>
                <Text className={styles.dateText}>
                  {appointmentDate.toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </Text>
                <Text className={styles.timeText}>
                  {appointmentDate.toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </div>
              
              <div className={styles.appointmentDetails}>
                <Text className={styles.treatmentName}>{appointment.treatmentName}</Text>
                <div 
                  className={styles.statusDot}
                  style={{ backgroundColor: config.color }}
                />
                <Text className={styles.statusText} style={{ color: config.color }}>
                  {config.label}
                </Text>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CustomerDetail({ customerId }: CustomerDetailProps) {
  const { user: currentUser } = useAuth();
  const { profile: customer, isLoading, error, refresh, updateCustomer, toggleStatus } = useCustomerProfile(customerId);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
    active: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (customer) {
      setEditData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phone: customer.phone || '',
        notes: customer.notes || '',
        active: customer.active !== false, // Default to true if not specified
      });
    }
  }, [customer]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (customer) {
      setEditData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phone: customer.phone || '',
        notes: customer.notes || '',
        active: customer.active !== false,
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateCustomer(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update customer:', error);
      // TODO: Show error toast
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditDataChange = (field: string, value: any) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStatusToggle = async (active: boolean) => {
    // Prevent admin from disabling themselves
    const isCurrentUser = currentUser && customer && (
      String(currentUser.id) === String(customer.id) || 
      currentUser.email === customer.email
    );
    
    if (isCurrentUser && !active) {
      console.warn('Cannot disable own account');
      return;
    }

    try {
      await toggleStatus(active);
      setEditData((prev) => ({ ...prev, active }));
    } catch (error) {
      console.error('Failed to toggle customer status:', error);
      // TODO: Show error toast
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="m" />
        <Text className={styles.loadingText}>Kundendaten werden geladen...</Text>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>
          <Icon name="warning" size="xl" />
        </div>
        <Text className={styles.errorTitle}>Kunde nicht gefunden</Text>
        <Text className={styles.errorDescription}>
          Die angeforderten Kundendaten konnten nicht geladen werden
        </Text>
        <Button
          variant="secondary"
          size="m"
          onClick={() => router.back()}
          className={styles.backButton}
        >
          <Icon name="arrowLeft" size="s" />
          <Text>Zurück zur Übersicht</Text>
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.customerDetail}>
      <div className={styles.detailHeader}>
        <Button
          variant="tertiary"
          size="s"
          onClick={() => router.back()}
          className={styles.backButton}
        >
          <Icon name="arrowLeft" size="s" />
          <Text>Zurück</Text>
        </Button>
        
        <div className={styles.headerActions}>
          <Button
            variant="secondary"
            size="m"
            href={`/online-booking?customer=${customerId}`}
            className={styles.bookButton}
          >
            <Icon name="calendar" size="s" />
            <Text>Neuer Termin</Text>
          </Button>
        </div>
      </div>

      <div className={styles.detailContent}>
        <CustomerProfileCard
          customer={customer}
          currentUser={currentUser}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          isEditing={isEditing}
          isSaving={isSaving}
          editData={editData}
          onEditDataChange={handleEditDataChange}
          onStatusToggle={handleStatusToggle}
        />

        <LoyaltyCard customer={customer} />

        <AppointmentHistory appointments={customer.recentAppointments || []} />
      </div>
    </div>
  );
}

export default CustomerDetail;