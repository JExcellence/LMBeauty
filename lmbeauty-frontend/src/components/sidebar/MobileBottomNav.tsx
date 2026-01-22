"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Row, IconButton, Text, Column } from "@once-ui-system/core";
import { useAuth } from '@/contexts/AuthContext';
import styles from './MobileBottomNav.module.scss';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    icon: "home"
  },
  {
    id: "services",
    label: "Services",
    href: "/#services",
    icon: "sparkles"
  },
  {
    id: "buchung",
    label: "Buchen",
    href: "/online-booking",
    icon: "calendar"
  },
  {
    id: "mein-bereich",
    label: "Profil",
    href: "/mein-bereich",
    icon: "person"
  }
];

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const getActiveSection = () => {
    if (pathname === '/') return 'home';
    if (pathname === '/online-booking') return 'buchung';
    if (pathname.startsWith('/mein-bereich')) return 'mein-bereich';
    if (pathname === '/' && window.location.hash === '#services') return 'services';
    return '';
  };

  const activeSection = getActiveSection();

  // Don't show on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <Row
      className={styles.mobileBottomNav}
      horizontal="between"
      vertical="center"
      paddingX="s"
      paddingY="xs"
      role="navigation"
      aria-label="Mobile Hauptnavigation"
    >
      {navigationItems.map((item) => {
        // Handle authentication for profile section
        if (item.id === 'mein-bereich' && !isAuthenticated) {
          return (
            <Link
              key="auth"
              href="/anmelden"
              className={styles.navItem}
              aria-label="Anmelden"
            >
              <Column
                horizontal="center"
                vertical="center"
                gap="4"
                className={styles.navContent}
                role="menuitem"
                tabIndex={0}
              >
                <IconButton
                  icon="person"
                  variant="ghost"
                  size="s"
                  className={styles.navIcon}
                  aria-hidden="true"
                />
                <Text
                  variant="body-default-xs"
                  className={styles.navLabel}
                >
                  Anmelden
                </Text>
              </Column>
            </Link>
          );
        }

        const isActive = activeSection === item.id;

        return (
          <Link
            key={item.id}
            href={item.href}
            className={styles.navItem}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`${item.label}${isActive ? ' (aktuelle Seite)' : ''}`}
          >
            <Column
              horizontal="center"
              vertical="center"
              gap="4"
              className={`${styles.navContent} ${isActive ? styles.active : ''}`}
              role="menuitem"
              tabIndex={0}
            >
              <IconButton
                icon={item.icon}
                variant="ghost"
                size="s"
                className={`${styles.navIcon} ${isActive ? styles.activeIcon : ''}`}
                aria-hidden="true"
              />
              <Text
                variant="body-default-xs"
                className={`${styles.navLabel} ${isActive ? styles.activeLabel : ''}`}
              >
                {item.label}
              </Text>
            </Column>
          </Link>
        );
      })}
    </Row>
  );
};

export default MobileBottomNav;