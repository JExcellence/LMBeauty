'use client';

import { useState } from 'react';
import { Text, Icon, Button, Avatar, Spinner } from '@once-ui-system/core';
import { useCustomers } from '@/hooks/useAdmin';
import styles from './CustomerList.module.scss';

function CustomerCard({ customer }: { customer: any }) {
  const lastVisit = customer.lastVisit 
    ? new Date(customer.lastVisit).toLocaleDateString('de-DE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : null;

  const visitCount = customer.appointmentCount || 0;
  const isVIP = visitCount >= 5;
  const fullName = customer.firstName ? `${customer.firstName} ${customer.lastName || ''}`.trim() : null;
  const displayName = fullName || customer.email;
  const initials = fullName 
    ? `${customer.firstName?.[0] || ''}${customer.lastName?.[0] || ''}`.toUpperCase()
    : customer.email?.[0]?.toUpperCase() || '?';

  const getCustomerStatus = () => {
    if (visitCount === 0) return { text: 'Neue Kundin', color: 'new' };
    if (visitCount === 1) return { text: 'Erste Begegnung', color: 'first' };
    if (visitCount < 5) return { text: `${visitCount} Besuche`, color: 'regular' };
    return { text: `${visitCount} Besuche • VIP`, color: 'vip' };
  };

  const status = getCustomerStatus();

  return (
    <div className={`${styles.customerCard} ${isVIP ? styles.vip : ''}`}>
      <div className={styles.customerHeader}>
        <div className={styles.avatarSection}>
          <Avatar
            size="l"
            src={customer.profileImage}
            value={initials}
            className={styles.customerAvatar}
          />
          {isVIP && (
            <div className={styles.vipBadge}>
              <Icon name="star" size="xs" />
            </div>
          )}
        </div>

        <div className={styles.customerInfo}>
          <Text className={styles.customerName}>
            {displayName}
          </Text>
          {fullName && customer.email && (
            <Text className={styles.customerEmail}>
              {customer.email}
            </Text>
          )}
          {customer.phone && (
            <Text className={styles.customerPhone}>
              {customer.phone}
            </Text>
          )}
        </div>

        <div className={styles.customerMeta}>
          <div className={`${styles.statusBadge} ${styles[status.color]}`}>
            <Text className={styles.statusText}>
              {status.text}
            </Text>
          </div>
          {lastVisit && (
            <Text className={styles.lastVisit}>
              Zuletzt: {lastVisit}
            </Text>
          )}
        </div>
      </div>

      {customer.notes && (
        <div className={styles.customerNotes}>
          <Text className={styles.notesText}>
            {customer.notes}
          </Text>
        </div>
      )}

      <div className={styles.customerActions}>
        <Button
          variant="tertiary"
          size="s"
          href={`/admin/customers/${customer.id}`}
          className={styles.viewButton}
        >
          <Icon name="eye" size="xs" />
          <Text>Details</Text>
        </Button>
        <Button
          variant="tertiary"
          size="s"
          href={`/online-booking?customer=${customer.id}`}
          className={styles.bookButton}
        >
          <Icon name="calendar" size="xs" />
          <Text>Termin</Text>
        </Button>
      </div>
    </div>
  );
}

function CustomerSearch({ value, onChange, totalCount }: { 
  value: string; 
  onChange: (value: string) => void;
  totalCount: number;
}) {
  return (
    <div className={styles.searchSection}>
      <div className={styles.searchBar}>
        <Icon name="search" size="s" className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Nach Namen oder E-Mail suchen..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      <Text className={styles.resultCount}>
        {value ? `${totalCount} Ergebnisse` : `${totalCount} Kundinnen insgesamt`}
      </Text>
    </div>
  );
}

export function CustomerList() {
  const { customers, isLoading } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers?.filter(customer => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.toLowerCase();
    return fullName.includes(searchLower) || 
           customer.email?.toLowerCase().includes(searchLower) ||
           customer.phone?.includes(searchTerm);
  }) || [];

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="m" />
        <Text className={styles.loadingText}>Kundinnen werden geladen...</Text>
      </div>
    );
  }

  return (
    <div className={styles.customerManager}>
      <div className={styles.managerHeader}>
        <div className={styles.headerContent}>
          <Text className={styles.managerTitle}>Kundenverwaltung</Text>
          <Text className={styles.managerSubtitle}>
            Verwalte alle Kundinnen und ihre Informationen
          </Text>
        </div>
      </div>

      <CustomerSearch 
        value={searchTerm} 
        onChange={setSearchTerm}
        totalCount={filteredCustomers.length}
      />

      <div className={styles.customerGrid}>
        {filteredCustomers.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Icon name="person" size="xl" />
            </div>
            <Text className={styles.emptyTitle}>
              {searchTerm ? 'Keine Kundinnen gefunden' : 'Noch keine Kundinnen'}
            </Text>
            <Text className={styles.emptyMessage}>
              {searchTerm 
                ? 'Versuche andere Suchbegriffe oder passe die Filter an'
                : 'Deine ersten Kundinnen werden hier angezeigt, sobald sie Termine buchen'}
            </Text>
          </div>
        ) : (
          <div className={styles.customersList}>
            {filteredCustomers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerList;