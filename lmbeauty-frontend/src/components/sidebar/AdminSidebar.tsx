"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Column, Row, Text, Button, Icon, IconButton } from "@once-ui-system/core";
import { useAuth } from '@/contexts/AuthContext';
import styles from './AdminSidebar.module.scss';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  description?: string;
  badge?: string;
}

const adminNavigationItems: NavigationItem[] = [
  {
    id: "admin-dashboard",
    label: "Übersicht",
    href: "/admin",
    icon: "home",
    description: "Dashboard & Statistiken"
  },
  {
    id: "admin-appointments",
    label: "Termine",
    href: "/admin/appointments",
    icon: "calendar",
    description: "Terminverwaltung"
  },
  {
    id: "admin-customers",
    label: "Kundinnen",
    href: "/admin/customers",
    icon: "person",
    description: "Kundenverwaltung"
  },
  {
    id: "admin-treatments",
    label: "Behandlungen",
    href: "/admin/treatments",
    icon: "heart",
    description: "Behandlungsverwaltung"
  },
  {
    id: "admin-availability",
    label: "Verfügbarkeit",
    href: "/admin/availability",
    icon: "clock",
    description: "Arbeitszeiten & Pausen"
  },
  {
    id: "admin-analytics",
    label: "Analytics",
    href: "/admin/analytics",
    icon: "chart",
    description: "Berichte & Auswertungen"
  },
  {
    id: "admin-settings",
    label: "Einstellungen",
    href: "/admin/settings",
    icon: "settings",
    description: "System-Einstellungen"
  }
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getActiveSection = () => {
    if (pathname === '/admin') return 'admin-dashboard';
    if (pathname.includes('/appointments')) return 'admin-appointments';
    if (pathname.includes('/customers')) return 'admin-customers';
    if (pathname.includes('/treatments')) return 'admin-treatments';
    if (pathname.includes('/availability')) return 'admin-availability';
    if (pathname.includes('/analytics')) return 'admin-analytics';
    if (pathname.includes('/settings')) return 'admin-settings';
    return '';
  };

  const activeSection = getActiveSection();

  return (
    <Column
      fitWidth
      position="fixed"
      left="0"
      top="0"
      className={`${styles.adminSidebar} ${isCollapsed ? styles.collapsed : ''}`}
    >
      {/* Header */}
      <Row
        paddingX={isCollapsed ? "m" : "l"}
        paddingY="m"
        vertical="center"
        horizontal="between"
        className={styles.sidebarHeader}
      >
        {!isCollapsed && (
          <Link href="/admin" className={styles.brandLink}>
            <Row vertical="center" gap="xs" fillWidth>
              <Icon name="shield" size="m" className={styles.adminIcon} />
              <Column gap="2">
                <Text variant="label-strong-s" className={styles.brandText}>
                  LM Beauty
                </Text>
                <Text variant="body-default-xs" className={styles.adminLabel}>
                  Admin Panel
                </Text>
              </Column>
            </Row>
          </Link>
        )}

        <Column
          horizontal={isCollapsed ? "center" : "end"}
          radius="m"
          fillWidth={isCollapsed}
        >
          <IconButton
            variant="ghost"
            size="m"
            icon={isCollapsed ? "chevronRight" : "chevronLeft"}
            onClick={onToggleCollapse}
            className={styles.collapseButton}
            aria-label={isCollapsed ? "Sidebar erweitern" : "Sidebar minimieren"}
          />
        </Column>
      </Row>

      {/* Navigation */}
      <Column
        padding="s"
        vertical="start"
        className={styles.sidebarNav}
      >
        {/* Main Navigation */}
        {!isCollapsed && (
          <Text
            variant="body-default-xs"
            className={styles.sectionLabel}
          >
            VERWALTUNG
          </Text>
        )}

        {adminNavigationItems.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={styles.navItem}
            >
              <Row
                gap="xs"
                vertical="center"
                padding="xs"
                radius="m"
                fillWidth
                className={`${styles.navContent} ${isActive ? styles.active : ''}`}
              >
                <Icon
                  name={item.icon}
                  size="s"
                  className={`${styles.navIcon} ${isActive ? styles.activeIcon : ''}`}
                />
                {!isCollapsed && (
                  <Column gap="2" fillWidth>
                    <Row vertical="center" horizontal="between" fillWidth>
                      <Text
                        variant="body-default-s"
                        className={`${styles.navLabel} ${isActive ? styles.activeLabel : ''}`}
                      >
                        {item.label}
                      </Text>
                      {item.badge && (
                        <Text
                          variant="body-default-xs"
                          className={styles.navBadge}
                        >
                          {item.badge}
                        </Text>
                      )}
                    </Row>
                    {item.description && (
                      <Text
                        variant="body-default-xs"
                        className={styles.navDescription}
                      >
                        {item.description}
                      </Text>
                    )}
                  </Column>
                )}
              </Row>
            </Link>
          );
        })}

        {/* Quick Actions */}
        <div className={styles.divider} />
        {!isCollapsed && (
          <Text
            variant="body-default-xs"
            className={styles.sectionLabel}
          >
            SCHNELLZUGRIFF
          </Text>
        )}
        
        <Link
          href="/"
          className={styles.navItem}
        >
          <Row
            gap="xs"
            vertical="center"
            padding="xs"
            radius="m"
            fillWidth
            className={styles.navContent}
          >
            <Icon
              name="external"
              size="s"
              className={styles.navIcon}
            />
            {!isCollapsed && (
              <Column gap="2">
                <Text
                  variant="body-default-s"
                  className={styles.navLabel}
                >
                  Website besuchen
                </Text>
                <Text
                  variant="body-default-xs"
                  className={styles.navDescription}
                >
                  Zur Hauptseite
                </Text>
              </Column>
            )}
          </Row>
        </Link>
      </Column>

      {/* User Section */}
      {user && (
        <Column className={styles.sidebarUser}>
          {!isCollapsed ? (
            <Column gap="s" padding="m">
              {/* Custom User Component */}
              <Row gap="xs" vertical="center" className={styles.userInfo}>
                <Column
                  width="40"
                  height="40"
                  radius="full"
                  center
                  className={styles.userAvatar}
                >
                  <Text variant="label-strong-m" className={styles.userInitial}>
                    LM
                  </Text>
                </Column>
                <Column gap="2" fillWidth>
                  <Row vertical="center" gap="xs">
                    <Text variant="label-strong-s" className={styles.userName}>
                      Lisa Marie
                    </Text>
                    <div className={styles.userTag}>
                      <Text variant="body-default-xs" className={styles.tagText}>
                        Besitzer
                      </Text>
                    </div>
                  </Row>
                  <Text variant="body-default-xs" className={styles.userRole}>
                    Inhaberin
                  </Text>
                </Column>
              </Row>
              
              <Button
                variant="tertiary"
                size="s"
                onClick={logout}
                className={styles.logoutButton}
                prefixIcon="logout"
                label="Abmelden"
              />
            </Column>
          ) : (
            <Column center padding="m">
              <IconButton
                variant="ghost"
                size="m"
                icon="logout"
                onClick={logout}
                className={styles.logoutButtonCollapsed}
                aria-label="Abmelden"
              />
            </Column>
          )}
        </Column>
      )}
    </Column>
  );
};

export default AdminSidebar;