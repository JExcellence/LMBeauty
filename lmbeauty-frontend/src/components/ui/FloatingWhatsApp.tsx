"use client";

import React from 'react';
import { Icon } from '@once-ui-system/core';
import styles from './FloatingWhatsApp.module.scss';

export const FloatingWhatsApp: React.FC = () => {
    return (
        <a
            href="https://wa.me/+4915259675346"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.floatingButton}
            aria-label="WhatsApp kontaktieren"
        >
            <Icon name="whatsapp" size="l" onSolid="brand-strong" />
        </a>
    );
};

export default FloatingWhatsApp;
