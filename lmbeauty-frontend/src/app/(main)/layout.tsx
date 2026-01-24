"use client";

import React, { useState } from 'react';
import { Column } from "@once-ui-system/core";
import { Footer } from "@/components/footer/Footer";
import { FloatingContactButton } from "@/components/FloatingContactButton";
import styles from './layout.module.scss';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Column fillWidth style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <Column 
        fillWidth 
        className={`${styles.mainContent} ${isSidebarCollapsed ? styles.sidebarCollapsed : ''}`}
      >
        <Column fillWidth>
          {children}
        </Column>

          <Column fillWidth>
              <Footer />
          </Column>
      </Column>
      
      <FloatingContactButton />
    </Column>
  );
}
