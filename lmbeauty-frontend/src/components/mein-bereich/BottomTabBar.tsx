/*
"use client";

import React from 'react';
import { Row, Column, Text, Icon } from "@once-ui-system/core";
import styles from './BottomTabBar.module.scss';

interface NavigationItem {
  id: TabType;
  label: string;
  icon: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: "termine",
    label: "Termine",
    icon: "calendar"
  },
  {
    id: "reise",
    label: "Reise",
    icon: "heart"
  },
  {
    id: "treue",
    label: "Treue",
    icon: "star"
  },
  {
    id: "profil",
    label: "Profil",
    icon: "person"
  },
  {
    id: "hilfe",
    label: "Hilfe",
    icon: "help"
  }
];

interface BottomTabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <Row
      className={styles.bottomTabBar}
      horizontal="between"
      vertical="center"
      paddingX="s"
      paddingY="xs"
      role="navigation"
      aria-label="Mein Bereich Mobile Navigation"
    >
      {navigationItems.map((item) => {
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
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
              <Icon
                name={item.icon}
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
          </button>
        );
      })}
    </Row>
  );
};

export default BottomTabBar;*/
