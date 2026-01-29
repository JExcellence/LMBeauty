"use client";

import React from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Button, Column, Icon, IconButton, Row, Text} from "@once-ui-system/core";
import {useAuth} from '@/contexts/AuthContext';
import styles from './UserSidebar.module.scss';

interface NavigationItem {
    id: string;
    label: string;
    href: string;
    icon: string;
    description?: string;
}

const userNavigationItems: NavigationItem[] = [
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
        href: "/#contact",
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

interface UserSidebarProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({
                                                            isCollapsed,
                                                            onToggleCollapse
                                                        }) => {
    const pathname = usePathname();
    const {user, logout} = useAuth();

    const getActiveSection = () => {
        if (pathname === '/') return 'home';
        if (pathname === '/#contact') return 'buchung';
        if (pathname.startsWith('/mein-bereich')) return 'mein-bereich';
        if (pathname === '/ueber-lm-beauty') return 'studio';
        if (pathname === '/' && window.location.hash === '#services') return 'services';
        return '';
    };

    const activeSection = getActiveSection();

    return (
        <Column
            fitWidth
            position="fixed"
            left="0"
            top="0"
            className={`${styles.userSidebar} ${isCollapsed ? styles.collapsed : ''}`}
            role="navigation"
            aria-label="Hauptnavigation"
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
                            <Icon name="sparkles" size="m" className={styles.brandIcon}/>
                            <Text variant="label-strong-m" className={styles.brandText}>
                                LM Beauty
                            </Text>
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
                {!isCollapsed && (
                    <Text
                        variant="body-default-xs"
                        className={styles.sectionLabel}
                    >
                        NAVIGATION
                    </Text>
                )}

                {userNavigationItems.map((item, index) => {
                    const isActive = activeSection === item.id;

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
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
                                {!isCollapsed && (
                                    <Column gap="2">
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
                        </Link>
                    );
                })}
            </Column>

            {/* User Section */}
            {user && (
                <Column className={styles.sidebarUser}>
                    <Row
                        gap="xs"
                        vertical="center"
                        padding="m"
                        className={styles.userInfo}
                    >
                        <Column
                            width="40"
                            height="40"
                            radius="full"
                            center
                            className={styles.userAvatar}
                        >
                            <Text variant="label-strong-m" className={styles.userInitial}>
                                {(user.firstName || user.username || 'U').charAt(0).toUpperCase()}
                            </Text>
                        </Column>
                        {!isCollapsed && (
                            <Column gap="4" fillWidth>
                                <Text variant="label-strong-s" className={styles.userName}>
                                    {user.firstName || user.username}
                                </Text>
                                <Text variant="body-default-xs" className={styles.userEmail}>
                                    {user.email}
                                </Text>
                            </Column>
                        )}
                    </Row>

                    {!isCollapsed && (
                        <Button
                            variant="tertiary"
                            size="s"
                            onClick={logout}
                            className={styles.logoutButton}
                            prefixIcon="logout"
                            aria-label="Vom Konto abmelden"
                        >
                            Abmelden
                        </Button>
                    )}
                </Column>
            )}
        </Column>
    );
};

export default UserSidebar;