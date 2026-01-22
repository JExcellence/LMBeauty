'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Text, Icon, Button, Avatar } from '@once-ui-system/core';
import { useAuth } from '@/contexts/AuthContext';
import styles from './AdminLayout.module.scss';

interface NavItem {
  icon: string;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { 
    icon: 'home', 
    label: 'Übersicht', 
    href: '/admin'
  },
  { 
    icon: 'calendar', 
    label: 'Termine', 
    href: '/admin/appointments'
  },
  { 
    icon: 'person', 
    label: 'Kundinnen', 
    href: '/admin/customers'
  },
  { 
    icon: 'heart', 
    label: 'Behandlungen', 
    href: '/admin/treatments'
  },
  { 
    icon: 'clock', 
    label: 'Verfügbarkeit', 
    href: '/admin/availability'
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

export function AdminLayout({ children, activeTab }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getActiveTab = () => {
    if (pathname === '/admin') return 'übersicht';
    if (pathname.includes('/appointments')) return 'termine';
    if (pathname.includes('/customers')) return 'kundinnen';
    if (pathname.includes('/treatments')) return 'behandlungen';
    if (pathname.includes('/availability')) return 'verfügbarkeit';
    return activeTab?.toLowerCase() || '';
  };

  const currentActiveTab = getActiveTab();

  return (
    <div className={styles.adminContainer}>
      <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.sidebarContent}>
          <header className={styles.sidebarHeader}>
            <div className={styles.brandSection}>
              <div className={styles.logoContainer}>
                <div className={styles.logoIcon}>
                  <Text className={styles.logoText}>LM</Text>
                </div>
                {!isCollapsed && (
                  <div className={styles.brandInfo}>
                    <Text className={styles.brandName}>LM Beauty</Text>
                    <Text className={styles.brandRole}>Studio Management</Text>
                  </div>
                )}
              </div>
              <Button
                variant="tertiary"
                size="s"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={styles.collapseButton}
              >
                <Icon name={isCollapsed ? 'chevronRight' : 'chevronLeft'} size="s" />
              </Button>
            </div>
          </header>

          <nav className={styles.navigation}>
            <div className={styles.navSection}>
              {!isCollapsed && (
                <Text className={styles.sectionLabel}>Verwaltung</Text>
              )}
              <div className={styles.navItems}>
                {navItems.map((item) => {
                  const isActive = currentActiveTab === item.label.toLowerCase();
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                    >
                      <div className={styles.navItemIcon}>
                        <Icon name={item.icon as any} size="m" />
                      </div>
                      {!isCollapsed && (
                        <div className={styles.navItemContent}>
                          <Text className={styles.navItemLabel}>{item.label}</Text>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          <footer className={styles.sidebarFooter}>
            <div className={styles.userSection}>
              <div className={styles.userProfile}>
                <Avatar
                  size="m"
                  src={user?.profileImage}
                  value={user?.firstName?.[0] || user?.email?.[0] || 'A'}
                  className={styles.userAvatar}
                />
                {!isCollapsed && (
                  <div className={styles.userInfo}>
                    <Text className={styles.userName}>
                      {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email}
                    </Text>
                    <Text className={styles.userRole}>
                      {user?.role === 'ADMIN' ? 'Studio Inhaberin' : 'Administrator'}
                    </Text>
                  </div>
                )}
              </div>
              
              <div className={styles.footerActions}>
                <Button
                  variant="tertiary"
                  size="s"
                  href="/"
                  className={styles.footerButton}
                >
                  <Icon name="home" size="s" />
                </Button>
                <Button
                  variant="tertiary"
                  size="s"
                  onClick={logout}
                  className={styles.footerButton}
                >
                  <Icon name="logout" size="s" />
                </Button>
              </div>
            </div>
          </footer>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
