"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AdminSidebar } from '@/components/sidebar/AdminSidebar';
import { UserSidebar } from '@/components/sidebar/UserSidebar';
import styles from './GlobalLayout.module.scss';
import {Background, Banner, Column, Flex, Icon} from "@once-ui-system/core";
import {Sidebar} from "@/components/sidebar";
import {Footer} from "@/components/footer";

interface GlobalLayoutProps {
  children: React.ReactNode;
  showMinimalHeader?: boolean;
}

export type SidebarType = "admin" | "user" | "public";

export const GlobalLayout: React.FC<GlobalLayoutProps> = ({ 
  children
}) => {
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarType = useMemo((): SidebarType => {
    if (isLoading) {
      return "public";
    }

    if (isAuthenticated && user && user.role === "ADMIN") {
      return "admin";
    }

    if (pathname.startsWith("/anmelden") ||
        pathname.startsWith("/registrieren") ||
        pathname.startsWith("/login")) {
      return "public";
    }

    return isAuthenticated ? 'user' : 'public';
  }, [isAuthenticated, user, isLoading, pathname]);

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    const body = document.body;
    
    if (window.innerWidth > 768) {
      if (isSidebarCollapsed) {
        body.classList.add('sidebar-collapsed');
        body.classList.remove('sidebar-expanded');
      } else {
        body.classList.add('sidebar-expanded');
        body.classList.remove('sidebar-collapsed');
      }
    }

    body.classList.remove('sidebar-admin', 'sidebar-user', 'sidebar-public');
    body.classList.add(`sidebar-${sidebarType}`);
    
    return () => {
      body.classList.remove('sidebar-collapsed', 'sidebar-expanded');
      body.classList.remove('sidebar-admin', 'sidebar-user', 'sidebar-public');
    };
  }, [isSidebarCollapsed, sidebarType]);

  const renderSidebar = () => {
    const commonProps = {
      isCollapsed: isSidebarCollapsed,
      onToggleCollapse: handleToggleCollapse,
    };

    if (isLoading) {
      return <Sidebar {...commonProps} />;
    }

    switch (sidebarType) {
      case 'admin':
        return <AdminSidebar {...commonProps} />;
      case 'user':
        return <UserSidebar {...commonProps} />;
      case 'public':
      default:
        return <Sidebar {...commonProps} />;
    }
  };

  return (
    <Column className={styles.globalLayout}>
      <Background
        position="absolute"
        fill
        background="brand-weak"
      />
      {/* Dynamic Sidebar */}
      {renderSidebar()}
      
      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <Column
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex={10}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <Column
          as="main"
          fillWidth
          className={`${styles.mainContent}${isSidebarCollapsed ? styles.collapsed : ''} ${styles[sidebarType]}`}
          style={{
              minHeight: "100vh",
          }}
      >
        {children}
        <Footer />
      </Column>
    </Column>
  );
};

export default GlobalLayout;