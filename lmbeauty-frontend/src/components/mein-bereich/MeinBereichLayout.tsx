/*
'use client';

import { useState, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BottomTabBar } from './BottomTabBar';
import { SideNavigation } from './SideNavigation';
import { TermineSection } from './sections/TermineSection';
import { ReiseSection } from './sections/ReiseSection';
import { TreueSection } from './sections/TreueSection';
import { ProfilSection } from './sections/ProfilSection';
import { HilfeSection } from './sections/HilfeSection';
import styles from '../../app/(client)/mein-bereich/mein-bereich.module.scss';

export type TabType = 'termine' | 'reise' | 'treue' | 'profil' | 'hilfe' | 'einwilligung';

interface MeinBereichLayoutProps {
  children?: ReactNode;
  activeTab?: TabType;
}

export function MeinBereichLayout({ children, activeTab: propActiveTab }: MeinBereichLayoutProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>(propActiveTab || 'termine');

  const firstName = user?.firstName || user?.email?.split('@')[0] || 'du';

  const renderContent = () => {
    // If children are provided (like for einwilligung page), render them
    if (children) {
      return children;
    }

    switch (activeTab) {
      case 'termine':
        return <TermineSection />;
      case 'reise':
        return <ReiseSection />;
      case 'treue':
        return <TreueSection />;
      case 'profil':
        return <ProfilSection />;
      case 'hilfe':
        return <HilfeSection />;
      default:
        return <TermineSection />;
    }
  };

  const showTabs = !children; // Hide tabs when showing children (like einwilligung)

  return (
    <div className={styles.beautySpace}>
      <div className={styles.desktopNav}>
        <SideNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className={styles.contentFlow}>
        <div className={styles.mainContent}>
          {showTabs && (
            <>
              <div className={styles.welcomeHeader}>
                <p className={styles.welcomeGreeting}>Willkommen zurück</p>
                <h1 className={styles.welcomeName}>
                  Hallo, <span className={styles.welcomeAccent}>{firstName}</span>
                </h1>
              </div>

              <nav className={styles.sectionNav}>
                <button
                  className={`${styles.sectionNavItem} ${activeTab === 'termine' ? styles.active : ''}`}
                  onClick={() => setActiveTab('termine')}
                >
                  Termine
                </button>
                <button
                  className={`${styles.sectionNavItem} ${activeTab === 'reise' ? styles.active : ''}`}
                  onClick={() => setActiveTab('reise')}
                >
                  Reise
                </button>
                <button
                  className={`${styles.sectionNavItem} ${activeTab === 'treue' ? styles.active : ''}`}
                  onClick={() => setActiveTab('treue')}
                >
                  Treue
                </button>
                <button
                  className={`${styles.sectionNavItem} ${activeTab === 'profil' ? styles.active : ''}`}
                  onClick={() => setActiveTab('profil')}
                >
                  Profil
                </button>
                <button
                  className={`${styles.sectionNavItem} ${activeTab === 'hilfe' ? styles.active : ''}`}
                  onClick={() => setActiveTab('hilfe')}
                >
                  Hilfe
                </button>
              </nav>
            </>
          )}

          <div className={styles.sectionContent}>
            {renderContent()}
          </div>
        </div>
      </div>

      {showTabs && (
        <div className={styles.mobileNav}>
          <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      )}
    </div>
  );
}
*/
