'use client';

import { useState, useEffect } from 'react';
import { IconButton } from '@once-ui-system/core';
import styles from './FloatingContactButton.module.scss';

export const FloatingContactButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`${styles.floatingButton} ${isVisible ? styles.visible : ''}`}>
      <IconButton
        icon="messageCircle"
        size="l"
        variant="primary"
        onClick={scrollToContact}
        tooltip="Kontakt"
        tooltipPosition="left"
        aria-label="Zum Kontaktbereich scrollen"
      />
    </div>
  );
};
