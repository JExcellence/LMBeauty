"use client";

import React, { useEffect } from 'react';
import { Banner, Icon, Row } from "@once-ui-system/core";

/**
 * Construction Banner — "Im Aufbau" Notice
 * 
 * Uses Once UI Banner component to display a warning when the site is under construction.
 */

interface ConstructionBannerProps {
  message?: string;
}

export const ConstructionBanner: React.FC<ConstructionBannerProps> = ({
  message = "Diese Webseite befindet sich noch im Aufbau. Online-Buchung kommt bald!"
}) => {
  const isUnderConstruction = process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION === 'true';

  // Add class to body when banner is visible for header offset
  useEffect(() => {
    if (isUnderConstruction) {
      document.body.classList.add('has-construction-banner');
      return () => {
        document.body.classList.remove('has-construction-banner');
      };
    }
  }, [isUnderConstruction]);

  if (!isUnderConstruction) {
    return null;
  }

  return (
    <Row
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex={10}
      fillWidth
      style={{ 
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      }}
    >
      <Banner 
        fillWidth
        horizontal="center"
        paddingY="12"
        paddingX="16"
        gap="8"
        style={{
          background: 'transparent',
          color: '#1f2937',
        }}
      >
        <Icon name="warning" size="s" />
        {message}
      </Banner>
    </Row>
  );
};

export default ConstructionBanner;
