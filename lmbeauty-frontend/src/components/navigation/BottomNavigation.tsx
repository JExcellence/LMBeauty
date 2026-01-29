"use client";

import React from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Button, Row, Text} from "@once-ui-system/core";
import {useAuth} from '@/contexts/AuthContext';
import styles from './BottomNavigation.module.scss';

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
        href: "/#contact",
        icon: "calendar"
    },
    {
        id: "mein-bereich",
        label: "Mein Bereich",
        href: "/mein-bereich",
        icon: "person"
    }
];

export const BottomNavigation: React.FC = () => {
    const pathname = usePathname();
    const {isAuthenticated} = useAuth();

    const getActiveSection = () => {
        if (pathname === '/') return 'home';
        if (pathname === '/#contact') return 'buchung';
        if (pathname.startsWith('/mein-bereich')) return 'mein-bereich';
        if (pathname === '/' && window.location.hash === '#services') return 'services';
        return '';
    };

    const activeSection = getActiveSection();

    return (
        <Row
            as="nav"
            position="fixed"
            bottom="0"
            left="0"
            right="0"
            background="surface"
            paddingY="8"
            paddingX="16"
            className={styles.bottomNav}
            zIndex={10}
            role="navigation"
            aria-label="Hauptnavigation"
        >
            <Row
                fillWidth
                horizontal="between"
                vertical="center"
                style={{maxWidth: '400px', margin: '0 auto'}}
            >
                {navigationItems.map((item) => {
                    // Skip "Mein Bereich" if not authenticated
                    if (item.id === 'mein-bereich' && !isAuthenticated) {
                        return (
                            <Link
                                key="auth"
                                href="/anmelden"
                                className={styles.navItem}
                            >
                                <Button
                                    variant="tertiary"
                                    size="s"
                                    prefixIcon="person"
                                    className={styles.navButton}
                                />
                                <Text
                                    variant="body-default-xs"
                                    className={styles.navLabel}
                                >
                                    Anmelden
                                </Text>
                            </Link>
                        );
                    }

                    const isActive = activeSection === item.id;

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                        >
                            <Button
                                variant="tertiary"
                                size="s"
                                prefixIcon={item.icon}
                                className={`${styles.navButton} ${isActive ? styles.activeButton : ''}`}
                            />
                            <Text
                                variant="body-default-xs"
                                className={`${styles.navLabel} ${isActive ? styles.activeLabel : ''}`}
                            >
                                {item.label}
                            </Text>
                        </Link>
                    );
                })}
            </Row>
        </Row>
    );
};

export default BottomNavigation;