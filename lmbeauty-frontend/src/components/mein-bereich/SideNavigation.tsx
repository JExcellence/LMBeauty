"use client";

import React from 'react';
import { Column, Row, Text, Icon } from "@once-ui-system/core";
import { TabType } from './MeinBereichLayout';
import styles from './SideNavigation.module.scss';

interface NavigationItem {
  id: TabType;
  label: string;
  icon: string;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: "termine",
    label: "Termine",
    icon: "calendar",
    description: "Deine Buchungen & nächster Termin"
  },
  {
    id: "reise",
    label: "Beauty-Reise",
    icon: "heart",
    description: "Deine Behandlungshistorie"
  },
  {
    id: "treue",
    label: "Treue",
    icon: "star",
    description: "Treuepunkte & Belohnungen"
  },
  {
    id: "profil",
    label: "Profil",
    icon: "person",
    description: "Persönliche Einstellungen"
  },
  {
    id: "hilfe",
    label: "Hilfe",
    icon: "help",
    description: "Support & Kontakt"
  }
];

interface SideNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <Column
      className={styles.sideNavigation}
      role="navigation"
      aria-label="Mein Bereich Navigation"
    >
      {/* Header */}
      <Row
        paddingX="l"
        paddingY="m"
        vertical="center"
        className={styles.navHeader}
      >
        <Row vertical="center" gap="xs" fillWidth>
          <Icon name="sparkles" size="m" className={styles.brandIcon} />
          <Column gap="2">
            <Text variant="label-strong-m" className={styles.brandText}>
              Mein Bereich
            </Text>
            <Text variant="body-default-xs" className={styles.brandSubtext}>
              Dein persönlicher Beauty-Space
            </Text>
          </Column>
        </Row>
      </Row>

      {/* Navigation Items */}
      <Column
        padding="s"
        vertical="start"
        className={styles.navItems}
      >
        <Text
          variant="body-default-xs"
          className={styles.sectionLabel}
        >
          NAVIGATION
        </Text>

        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={styles.navItem}
              aria-current={isActive ? 'page' : undefined}
            >
              <Row
                gap="xs"
                vertical="center"
                padding="xs"
                radius="m"
                fillWidth
                className={`${styles.navContent} ${isActive ? styles.active : ''}`}
                role="menuitem"
                tabIndex={0}
              >
                <Icon
                  name={item.icon}
                  size="s"
                  className={`${styles.navIcon} ${isActive ? styles.activeIcon : ''}`}
                />
                <Column gap="2">
                  <Text
                    variant="body-default-s"
                    className={`${styles.navLabel} ${isActive ? styles.activeLabel : ''}`}
                  >
                    {item.label}
                  </Text>
                  <Text
                    variant="body-default-xs"
                    className={styles.navDescription}
                  >
                    {item.description}
                  </Text>
                </Column>
              </Row>
            </button>
          );
        })}
      </Column>
    </Column>
  );
};

export default SideNavigation;