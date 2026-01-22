"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {Column, Row, Text, Icon, IconButton, Flex, SmartLink} from "@once-ui-system/core";
import MobileSidebar from './MobileSidebar';
import MobileMenuButton from './MobileMenuButton';
import styles from './PublicSidebar.module.scss';

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
    id: "studio",
    label: "Das Studio",
    href: "/ueber-lm-beauty",
    icon: "info",
    description: "Über LM Beauty"
  }
];

interface PublicSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const PublicSidebar: React.FC<PublicSidebarProps> = ({ 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen]);

  const getActiveSection = () => {
    if (pathname === '/') return 'home';
    if (pathname === '/online-booking') return 'buchung';
    if (pathname === '/ueber-lm-beauty') return 'studio';
    if (pathname === '/' && typeof window !== 'undefined' && window.location.hash === '#services') return 'services';
    return '';
  };

  const activeSection = getActiveSection();

  return (
    <Column fill>
      {/* Desktop Sidebar */}
      <Column
        fitWidth
        position="fixed"
        left="0"
        top="0"
        right="0"
        bottom="0"
        className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
        background="brand-weak"
        zIndex={10}
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
            <Link href="/" className={styles.brandLink}>
              <Row vertical="center" gap="xs" fillWidth>
                <Icon name="sparkles" size="m" className={styles.brandIcon} />
                <Column gap="2">
                  <Text variant="label-strong-s" className={styles.brandText}>
                    LM Beauty
                  </Text>
                  <Text variant="body-default-xs" className={styles.brandSubtext}>
                    Beauty Studio
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
              NAVIGATION
            </Text>
          )}

          {navigationItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <SmartLink
                fillWidth
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
                      <Text
                        variant="body-default-s"
                        className={`${styles.navLabel} ${isActive ? styles.activeLabel : ''}`}
                      >
                        {item.label}
                      </Text>
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
              </SmartLink>
            );
          })}
        </Column>
      </Column>

      {/* Mobile Menu Button - hide when sidebar is open */}
      {!isMobileSidebarOpen && (
        <Flex
          fitWidth
          fitHeight
          position="fixed"
          top="16"
          left="16"
          zIndex={10}
          className={styles.mobileMenuButtonContainer}
          radius="l-4"
          border="brand-alpha-strong"
          background="brand-weak"
        >
          <MobileMenuButton
            onClick={() => setIsMobileSidebarOpen(true)}
          />
        </Flex>
      )}

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
    </Column>
  );
};

export default PublicSidebar;
