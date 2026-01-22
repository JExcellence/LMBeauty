"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {Column, Row, Text, IconButton, Icon, SmartLink, Flex, Button} from "@once-ui-system/core";
import { useAuth } from '@/contexts/AuthContext';
import styles from './MobileSidebar.module.scss';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  description?: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    icon: "home",
    description: "Zurück zur Startseite"
  },
  {
    id: "services",
    label: "Services",
    href: "/#services",
    icon: "sparkles",
    description: "Unsere Behandlungen"
  },
  {
    id: "buchung",
    label: "Termin buchen",
    href: "/online-booking",
    icon: "calendar",
    description: "Online Terminbuchung"
  },
  {
    id: "mein-bereich",
    label: "Mein Bereich",
    href: "/mein-bereich",
    icon: "person",
    description: "Persönlicher Bereich"
  },
  {
    id: "studio",
    label: "Das Studio",
    href: "/ueber-lm-beauty",
    icon: "info",
    description: "Über LM Beauty"
  }
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();

  const getActiveSection = () => {
    if (pathname === '/') return 'home';
    if (pathname === '/online-booking') return 'buchung';
    if (pathname.startsWith('/mein-bereich')) return 'mein-bereich';
    if (pathname === '/ueber-lm-beauty') return 'studio';
    if (pathname === '/' && window.location.hash === '#services') return 'services';
    return '';
  };

  const currentYear = new Date().getFullYear();
  const activeSection = getActiveSection();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Mobile Sidebar */}
      <Column
        className={`${styles.mobileSidebar} ${isOpen ? styles.open : ''}`}
        role="navigation"
        aria-label="Mobile Hauptnavigation"
        aria-hidden={!isOpen}
        background="brand-weak"
        zIndex={10}
        position="fixed"
        top="0"
        left="0"
        fill
      >
        {/* Header */}
        <Row
          padding="l"
          vertical="center"
          horizontal="between"
          className={styles.sidebarHeader}
        >
          <IconButton
            variant="secondary"
            size="m"
            icon="close"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Menü schließen"
          />
        </Row>

        {/* Navigation */}
        <Column
          padding="m"
          gap="s"
          className={styles.sidebarNav}
          overflow="hidden"
        >
          <Text
            variant="body-default-xs"
            className={styles.sectionLabel}
          >
            NAVIGATION
          </Text>

          {navigationItems.map((item) => {
            if (item.id === 'mein-bereich' && !isAuthenticated) {
              return (
                  <Column key="space"/>
              )

              //TODO SOON
              return (
                <SmartLink
                  fillWidth
                  key="auth"
                  href="/anmelden"
                  className={styles.navItem}
                  onClick={onClose}
                >
                  <Row
                    gap="m"
                    vertical="center"
                    padding="m"
                    radius="l"
                    fillWidth
                    className={styles.navContent}
                  >
                    <Icon
                      name="person"
                      size="m"
                      className={styles.navIcon}
                    />
                    <Column gap="4">
                      <Text
                        variant="body-default-m"
                        className={styles.navLabel}
                      >
                        Anmelden
                      </Text>
                      <Text
                        variant="body-default-s"
                        className={styles.navDescription}
                      >
                        Konto erstellen oder anmelden
                      </Text>
                    </Column>
                  </Row>
                </SmartLink>
              );
            }

            const isActive = activeSection === item.id;

            return (
              <SmartLink
                fillWidth
                key={item.id}
                href={item.href}
                onClick={onClose}
              >
                <Row
                  gap="m"
                  vertical="center"
                  padding="m"
                  radius="l"
                  fillWidth
                  background="brand-weak"
                  border="brand-alpha-strong"
                >
                  <Icon
                    name={item.icon}
                    size="m"
                  />
                  <Column gap="4">
                    <Text
                      variant="body-default-m"
                      onBackground="brand-weak"
                    >
                      {item.label}
                    </Text>
                    {item.description && (
                      <Text
                        variant="body-default-s"
                        className={styles.navDescription}
                      >
                        {item.description}
                      </Text>
                    )}
                  </Column>
                </Row>
              </SmartLink>
            );
          })}
        </Column>

        {/* User Section */}
        {isAuthenticated && user && (
          <Column
            padding="m"
            className={styles.sidebarUser}
          >
            <div className={styles.divider} />
            
            <Text
              variant="body-default-xs"
              className={styles.sectionLabel}
            >
              PROFIL
            </Text>

            <Row
              gap="m"
              vertical="center"
              padding="m"
              radius="l"
              className={styles.userInfo}
            >
              <Column
                width="48"
                height="48"
                radius="full"
                center
                className={styles.userAvatar}
              >
                <Text variant="label-strong-m" className={styles.userInitial}>
                  {(user.firstName || user.username || 'U').charAt(0).toUpperCase()}
                </Text>
              </Column>
              <Column gap="4" className={styles.userDetails}>
                <Text variant="label-strong-m" className={styles.userName}>
                  {user.firstName || user.username}
                </Text>
                <Text variant="body-default-s" className={styles.userEmail}>
                  {user.email}
                </Text>
              </Column>
            </Row>

            <Button
              onClick={() => {
                logout().then(r => onClose());
              }}
              prefixIcon="logout"
              label="Abmelden"
              className={styles.logoutButton}
            >
            </Button>
          </Column>
        )}

        <Flex
          horizontal="between"
          align="center"
          gap="s"
          paddingBottom="l"
          background="brand-alpha-weak"
          className={styles.bottomBar}
          paddingTop="s"
        >
          <Text as="p" variant="body-default-xs">
            © 2023 - {currentYear} LM Beauty. Alle Rechte vorbehalten.
          </Text>

          <Row gap="xl" onBackground="brand-alpha-medium" horizontal="center">
            <SmartLink
              href="/impressum"
              target="_blank"
              rel="noopener noreferrer"
            >
              Impressum
            </SmartLink>
            <SmartLink
              href="/datenschutz"
              target="_blank"
              rel="noopener noreferrer"
            >
              Datenschutz
            </SmartLink>
            <SmartLink
              href="/agb"
              target="_blank"
              rel="noopener noreferrer"
            >
              AGB
            </SmartLink>
          </Row>

          {/*<Text onBackground="brand-alpha-weak">
            Entwickelt von{' '}
            <SmartLink
              href="https://www.jexcellence.de"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--brand-weak)"}}
            >
              JExcellence
            </SmartLink>
          </Text>*/}
        </Flex>
      </Column>
    </>
  );
};

export default MobileSidebar;