"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Button,
  Column,
  Row,
  Text,
  Flex,
  Media,
  Hover,
  MobileMegaMenu,
  NavIcon,
} from "@once-ui-system/core";
import { useAuth } from '@/contexts/AuthContext';
import { HeaderProps, NavigationState, NavigationItem } from '@/types/header';
import styles from './Header.module.scss';

// Editorial navigation - feels like part of the content flow
const navigation: NavigationItem[] = [
  {
    id: "services",
    label: "Services",
    href: "/#services"
  },
  {
    id: "buchung", 
    label: "Termin buchen",
    href: "/online-booking"
  },
  {
    id: "mein-bereich",
    label: "Mein Bereich", 
    href: "/mein-bereich"
  },
  {
    id: "studio",
    label: "Das Studio",
    href: "/ueber-lm-beauty"
  }
];

// Mobile mega menu - editorial chapter structure
const mobileMenuGroups = [
  {
    id: "services",
    label: "Unsere Services",
    sections: [
      {
        title: "Wimpernkunst",
        description: "Für einen natürlichen, wachen Blick",
        links: [
          {
            label: "Classic Lashes",
            href: "/services/classic-lashes",
            description: "Wimper für Wimper",
            subtle: "Natürlich verstärkt"
          },
          {
            label: "Volume Lashes",
            href: "/services/volume-lashes",
            description: "Für dramatische Fülle",
            subtle: "Maximaler Glamour"
          }
        ]
      },
      {
        title: "Verfeinerung",
        description: "Die letzten Details machen den Unterschied",
        links: [
          {
            label: "Wimpernlifting",
            href: "/services/lash-lift",
            description: "Deine Naturwimpern, nur wacher",
            subtle: "Ohne Extensions"
          },
          {
            label: "Augenbrauen",
            href: "/services/brow-styling",
            description: "Der perfekte Rahmen",
            subtle: "Struktur & Form"
          }
        ]
      }
    ]
  },
  { id: "buchung", label: "Termin buchen", href: "/online-booking" },
  { id: "mein-bereich", label: "Mein Bereich", href: "/mein-bereich" },
  { id: "studio", label: "Das Studio", href: "/ueber-lm-beauty" }
];

export const Header: React.FC<HeaderProps> = ({
  variant = 'full',
  showSidebar = false,
  userState = 'guest',
  currentSection,
  className,
  ...props
}) => {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  
  const [navigationState, setNavigationState] = useState<NavigationState>({
    activeSection: currentSection || '',
    sidebarOpen: false, // Always false now
    userMenuOpen: false,
    mobileMenuOpen: false,
    scrollPosition: 0,
    lastInteraction: Date.now()
  });

  // Editorial scroll detection - gradual blur like fog rolling in
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrolled = scrollPosition > 24; // After ~24px as per spec
      
      setIsScrolled(scrolled);
      setNavigationState(prev => ({
        ...prev,
        scrollPosition,
        lastInteraction: Date.now()
      }));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Network status detection for offline scenarios
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setError(null);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setError('Keine Internetverbindung');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cached navigation state for offline scenarios (simplified)
  useEffect(() => {
    try {
      const cachedState = localStorage.getItem('lm-navigation-state');
      if (cachedState && !isOnline) {
        const parsed = JSON.parse(cachedState);
        setNavigationState(prev => ({
          ...prev,
          activeSection: parsed.activeSection || '',
          lastInteraction: Date.now()
        }));
      }
    } catch (error) {
      console.warn('Failed to load cached navigation state:', error);
    }
  }, [isOnline]);

  // Cache navigation state (simplified - no sidebar)
  useEffect(() => {
    try {
      localStorage.setItem('lm-navigation-state', JSON.stringify({
        activeSection: navigationState.activeSection
      }));
    } catch (error) {
      console.warn('Failed to cache navigation state:', error);
    }
  }, [navigationState.activeSection]);

  // Update active section based on pathname
  useEffect(() => {
    let activeSection = '';
    
    // Handle specific route matching
    if (pathname === '/online-booking') {
      activeSection = 'buchung';
    } else if (pathname.startsWith('/mein-bereich')) {
      activeSection = 'mein-bereich';
    } else if (pathname === '/ueber-lm-beauty') {
      activeSection = 'studio';
    } else if (pathname === '/' && window.location.hash === '#services') {
      activeSection = 'services';
    } else {
      // Fallback to finding matching navigation item
      activeSection = navigation.find(item => 
        item.href && pathname.startsWith(item.href.split('#')[0])
      )?.id || '';
    }
    
    setNavigationState(prev => ({
      ...prev,
      activeSection
    }));
  }, [pathname]);

  // Keyboard navigation support (simplified for Once-UI components)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key closes menus
      if (event.key === 'Escape') {
        if (navigationState.mobileMenuOpen) {
          setNavigationState(prev => ({ ...prev, mobileMenuOpen: false }));
        }
        if (navigationState.userMenuOpen) {
          setNavigationState(prev => ({ ...prev, userMenuOpen: false }));
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigationState.mobileMenuOpen, navigationState.userMenuOpen]);

  const handleMobileMenuToggle = () => {
    setNavigationState(prev => ({
      ...prev,
      mobileMenuOpen: !prev.mobileMenuOpen,
      lastInteraction: Date.now()
    }));
  };

  const handleUserMenuToggle = () => {
    setNavigationState(prev => ({
      ...prev,
      userMenuOpen: !prev.userMenuOpen,
      lastInteraction: Date.now()
    }));
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    
    // Simulate retry logic
    setTimeout(() => {
      setIsLoading(false);
      if (navigator.onLine) {
        setIsOnline(true);
      } else {
        setError('Verbindung konnte nicht hergestellt werden');
      }
    }, 1000);
  };

  const handleAuthError = (errorMessage: string) => {
    setError(errorMessage);
    // Soft redirect to login without harsh error messages
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  return (
    <Row
      as="header"
      fillWidth
      paddingX="24"
      paddingY="20"
      vertical="center"
      position="sticky"
      top="0"
      zIndex={10}
      className={`${styles.editorialHeader} ${isScrolled ? styles.scrolled : ''} ${className || ''}`}
      style={{
        background: 'transparent',
        backdropFilter: isScrolled ? `blur(${Math.min(navigationState.scrollPosition / 10, 20)}px)` : 'blur(0px)',
        transition: 'backdrop-filter 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      role="banner"
      aria-label="LM Beauty Navigation"
      {...props}
    >
      {/* Offline Status - Reassuring, never alarming */}
      {(error || !isOnline) && (
        <Row
          position="absolute"
          top="0"
          left="0"
          right="0"
          paddingY="8"
          paddingX="24"
          className={styles.offlineStatus}
          zIndex={10}
        >
          <Row
            fillWidth
            horizontal="center"
            vertical="center"
            gap="12"
          >
            <Text
              variant="body-default-xs"
              className={styles.offlineText}
            >
              {error ? 'Wir sind noch da. Versuchen Sie es gerne erneut.' : 'Wir sind noch hier. Nehmen Sie sich Zeit.'}
            </Text>
            {error && (
              <Button
                variant="tertiary"
                size="s"
                label="Erneut versuchen"
                onClick={handleRetry}
                className={styles.retryButton}
                disabled={isLoading}
              />
            )}
          </Row>
        </Row>
      )}
      {/* Brand Zone - Appears as artifact, not button */}
      <Flex
        vertical="center"
        gap="16"
        className={styles.brandZone}
      >
        {/* Mobile menu toggle - calm, not menu-ish */}
        <NavIcon
          isActive={navigationState.mobileMenuOpen}
          onClick={handleMobileMenuToggle}
          aria-label="Navigation öffnen"
          aria-expanded={navigationState.mobileMenuOpen}
          hide
          s={{ hide: false }}
          l={{ hide: true }}
          className={styles.mobileToggle}
        />

        {/* Logo - feels like returning home, not navigation */}
        <Link href="/" className={styles.brandLink}>
          <Row vertical="center" gap="12" className={styles.brandContainer}>
            <div className={styles.logoContainer}>
              <Media
                src="/images/logo.png"
                alt="LM Beauty"
                width={40}
                height={40}
                className={styles.logoImage}
                sizes="40px"
              />
            </div>
            
            <Text
              variant="heading-default-l"
              className={styles.brandText}
            >
              LM<Text as="span" className={styles.brandAccent}>.</Text>Beauty
            </Text>
          </Row>
        </Link>
      </Flex>

      {/* Editorial Navigation - Feels like part of content flow */}
      <Row
        fillWidth
        horizontal="center"
        vertical="center"
        gap="56"
        className={styles.editorialNavigation}
        role="navigation"
        aria-label="Hauptbereiche"
      >
        {navigation.map((item) => (
          <Link
            key={item.id}
            href={item.href || '#'}
            className={`${styles.editorialLink} ${
              navigationState.activeSection === item.id ? styles.active : ''
            }`}
            aria-current={navigationState.activeSection === item.id ? 'page' : undefined}
          >
            <Text
              variant="body-default-m"
              className={styles.editorialText}
            >
              {item.label}
            </Text>
          </Link>
        ))}
      </Row>

      {/* Auth Presence - Optional, never urgent */}
      <Flex
        vertical="center"
        gap="16"
        className={styles.authZone}
      >
        {isLoading ? (
          <Row
            vertical="center"
            gap="12"
            className={styles.userSkeleton}
          >
            <div className={styles.skeletonText}></div>
            <div className={styles.skeletonAvatar}></div>
          </Row>
        ) : isAuthenticated && user ? (
          /* Logged-in - Human greeting, symbolic avatar */
          <Row
            vertical="center"
            gap="12"
            className={styles.authenticatedUser}
          >
            <Text
              variant="body-default-s"
              className={styles.userGreeting}
            >
              Hallo, {user.firstName || user.username}
            </Text>
            <Button
              variant="tertiary"
              size="s"
              prefixIcon="person"
              onClick={handleUserMenuToggle}
              className={styles.userAvatar}
              aria-label="Profil"
            />
          </Row>
        ) : (
          /* Guest - Anmelden feels optional */
          <Button
            size="s"
            variant="tertiary"
            label="Anmelden"
            href={isOnline ? "/anmelden" : "#"}
            disabled={!isOnline}
            className={styles.authButton}
            onClick={!isOnline ? () => handleAuthError('Anmeldung erfordert eine Internetverbindung') : undefined}
          />
        )}
      </Flex>

      {/* Mobile Navigation - Private room, editorial chapter */}
      {navigationState.mobileMenuOpen && (
        <Column
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          background="surface"
          overflowY="auto"
          zIndex={9}
          className={styles.mobileChapter}
          style={{
            animation: 'editorialUnfold 650ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <Column paddingY="32" paddingX="24">
            <MobileMegaMenu
              menuGroups={mobileMenuGroups}
              radius="none"
            />

            {/* Booking invitation - feels like suggestion, not CTA */}
            <Column gap="16" paddingTop="32" className={styles.bookingInvitation}>
              <Button
                fillWidth
                size="m"
                variant="primary"
                label="Einen Termin vereinbaren"
                href="/online-booking"
                className={styles.bookingButton}
              />

              {!isAuthenticated && (
                <Button
                  fillWidth
                  size="m"
                  variant="tertiary"
                  label="Anmelden"
                  href="/anmelden"
                  className={styles.mobileAuthButton}
                />
              )}
            </Column>
          </Column>
        </Column>
      )}
    </Row>
  );
};

export default Header;