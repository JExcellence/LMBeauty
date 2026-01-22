"use client";

import React from 'react';
import { IconButton } from "@once-ui-system/core";
import styles from './MobileMenuButton.module.scss';

interface MobileMenuButtonProps {
  onClick: () => void;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ 
  onClick
}) => {
  return (
    <IconButton
      variant="primary"
      size="m"
      icon="menu"
      onClick={onClick}
      className={styles.menuButton}
      aria-label="Menü öffnen"
      aria-expanded={false}
    />
  );
};

export default MobileMenuButton;