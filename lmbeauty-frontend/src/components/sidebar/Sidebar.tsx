"use client";

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Button, Column, Flex, Icon, IconButton, Row, SmartLink, Text} from "@once-ui-system/core";
import {useAuth} from '@/contexts/AuthContext';
import MobileSidebar from './MobileSidebar';
import MobileMenuButton from './MobileMenuButton';
import styles from './Sidebar.module.scss';

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

interface SidebarProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
                                                    isCollapsed,
                                                    onToggleCollapse
                                                }) => {
    const pathname = usePathname();
    const {isAuthenticated, user, logout} = useAuth();
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
        if (pathname === '/#contact') return 'buchung';
        if (pathname.startsWith('/mein-bereich')) return 'mein-bereich';
        if (pathname === '/ueber-lm-beauty') return 'studio';
        if (pathname === '/' && window.location.hash === '#services') return 'services';
        return '';
    };

    const activeSection = getActiveSection();

    return (
        <Column fill>
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
                    background="brand-alpha-strong"
                >
                    {!isCollapsed && (
                        <Link href="/" className={styles.brandLink}>
                            <Row vertical="center" gap="xs" fillWidth>
                                <Column gap="2">
                                    <Text variant="label-strong-s">
                                        LM Beauty
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
                            variant="secondary"
                            size="m"
                            icon={isCollapsed ? "chevronRight" : "chevronLeft"}
                            onClick={onToggleCollapse}
                            aria-label={isCollapsed ? "Sidebar erweitern" : "Sidebar minimieren"}
                        />
                    </Column>
                </Row>

                <Column
                    padding="s"
                    vertical="start"
                    gap="xs"
                >
                    {/* Main Navigation */}
                    {!isCollapsed && (
                        <Column paddingY="4">
                            <Text
                                variant="body-default-xs"
                                onBackground="brand-weak"
                            >
                                NAVIGATION
                            </Text>
                        </Column>
                    )}

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
                                >
                                    <Row
                                        gap="xs"
                                        vertical="center"
                                        padding="xs"
                                        radius="m"
                                        fillWidth
                                        className={styles.navContent}
                                    >
                                        <Icon
                                            name="person"
                                            size="s"
                                            className={styles.navIcon}
                                        />
                                        {!isCollapsed && (
                                            <Column gap="2" fillWidth>
                                                <Text
                                                    variant="body-default-s"
                                                    className={styles.navLabel}
                                                >
                                                    Anmelden
                                                </Text>
                                                <Text
                                                    variant="body-default-xs"
                                                    className={styles.navDescription}
                                                >
                                                    Konto erstellen oder anmelden
                                                </Text>
                                            </Column>
                                        )}
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
                                className={styles.navItem}
                            >
                                <Row
                                    gap="xs"
                                    vertical="center"
                                    padding="xs"
                                    radius="m"
                                    fillWidth
                                    background="brand-alpha-weak"
                                >
                                    <Icon
                                        name={item.icon}
                                        size="m"
                                        onBackground="brand-weak"
                                    />
                                    {!isCollapsed && (
                                        <Column gap="2" fillWidth>
                                            <Text
                                                variant="body-default-m"
                                                onBackground="brand-weak"
                                            >
                                                {item.label}
                                            </Text>
                                            {item.description && (
                                                <Text
                                                    variant="body-default-xs"
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

                    {/* Quick Actions */}
                    {isAuthenticated && user?.role === 'ADMIN' && (
                        <>
                            <div className={styles.divider}/>
                            {!isCollapsed && (
                                <Text
                                    variant="body-default-xs"
                                    className={styles.sectionLabel}
                                >
                                    VERWALTUNG
                                </Text>
                            )}

                            <Link
                                href="/admin"
                                className={styles.navItem}
                            >
                                <Row
                                    gap="xs"
                                    vertical="center"
                                    padding="xs"
                                    radius="m"
                                    fillWidth
                                    className={styles.navContent}
                                >
                                    <Icon
                                        name="shield"
                                        size="s"
                                        className={styles.navIcon}
                                    />
                                    {!isCollapsed && (
                                        <Column gap="2">
                                            <Text
                                                variant="body-default-s"
                                                className={styles.navLabel}
                                            >
                                                Admin Panel
                                            </Text>
                                            <Text
                                                variant="body-default-xs"
                                                className={styles.navDescription}
                                            >
                                                Verwaltungsbereich
                                            </Text>
                                        </Column>
                                    )}
                                </Row>
                            </Link>
                        </>
                    )}
                </Column>

                {/* User Section */}
                {isAuthenticated && user && (
                    <Column className={styles.sidebarUser}>
                        {!isCollapsed ? (
                            <Column gap="s" padding="m">
                                {/* Custom User Component */}
                                <Row gap="xs" vertical="center" className={styles.userInfo}>
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
                                    <Column gap="2" fillWidth>
                                        <Row vertical="center" gap="xs">
                                            <Text variant="label-strong-s" className={styles.userName}>
                                                {user.firstName || user.username || 'User'}
                                            </Text>
                                            {user.role === 'ADMIN' && (
                                                <div className={styles.userTag}>
                                                    <Text variant="body-default-xs" className={styles.tagText}>
                                                        Besitzer
                                                    </Text>
                                                </div>
                                            )}
                                        </Row>
                                        <Text variant="body-default-xs" className={styles.userRole}>
                                            {user.role === 'ADMIN' ? 'Inhaberin' : (user.email || 'Kundin')}
                                        </Text>
                                    </Column>
                                </Row>

                                <Button
                                    variant="tertiary"
                                    size="s"
                                    onClick={logout}
                                    className={styles.logoutButton}
                                    prefixIcon="logout"
                                    label="Abmelden"
                                />
                            </Column>
                        ) : (
                            <Column center padding="m">
                                <IconButton
                                    variant="ghost"
                                    size="m"
                                    icon="logout"
                                    onClick={logout}
                                    className={styles.logoutButtonCollapsed}
                                    aria-label="Abmelden"
                                />
                            </Column>
                        )}
                    </Column>
                )}
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

export default Sidebar;