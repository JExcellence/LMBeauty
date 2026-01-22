'use client';

import { useEffect, useState, memo } from 'react';
import { useServicePreselection } from '@/hooks/useServicePreselection';
import { Spinner, Column, Text } from '@once-ui-system/core';
import styles from './ServicePreloader.module.scss';

interface ServicePreloaderProps {
  onServicePreselected?: (serviceParam: string, category: string, treatmentSlugs: readonly string[]) => void;
  onInvalidService?: (serviceParam: string) => void;
  onNoService?: () => void;
  children?: React.ReactNode;
  showLoadingState?: boolean;
  loadingDelay?: number;
}

/**
 * Component that handles URL service parameter preselection logic.
 * Automatically processes service parameters and triggers appropriate callbacks.
 */
export const ServicePreloader = memo(function ServicePreloader({
  onServicePreselected,
  onInvalidService,
  onNoService,
  children,
  showLoadingState = true,
  loadingDelay = 100
}: ServicePreloaderProps) {
  const preselection = useServicePreselection();
  const [showLoader, setShowLoader] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (preselection.serviceParam && preselection.isValid) {
      // Show loading state immediately for better UX
      setIsTransitioning(true);
      
      // Add a small delay to prevent flashing for very fast loads
      timeoutId = setTimeout(() => {
        setShowLoader(true);
      }, loadingDelay);
    } else {
      setShowLoader(false);
      setIsTransitioning(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [preselection.serviceParam, preselection.isValid, loadingDelay]);

  useEffect(() => {
    if (preselection.isValid && preselection.serviceParam && preselection.category) {
      // Valid service parameter found
      onServicePreselected?.(
        preselection.serviceParam,
        preselection.category,
        preselection.treatmentSlugs
      );
      
      // Hide loader after successful preselection
      setTimeout(() => {
        setShowLoader(false);
        setIsTransitioning(false);
      }, 300);
    } else if (preselection.serviceParam && !preselection.isValid) {
      // Invalid service parameter
      onInvalidService?.(preselection.serviceParam);
      setShowLoader(false);
      setIsTransitioning(false);
    } else {
      // No service parameter
      onNoService?.();
      setShowLoader(false);
      setIsTransitioning(false);
    }
  }, [
    preselection.isValid,
    preselection.serviceParam,
    preselection.category,
    preselection.treatmentSlugs,
    onServicePreselected,
    onInvalidService,
    onNoService
  ]);

  // Show loading state while processing
  if (showLoadingState && (showLoader || isTransitioning)) {
    return (
      <div className={styles.preloaderContainer}>
        <div className={styles.overlay} />
        <Column 
          fillWidth 
          center
          gap="16" 
          className={styles.loadingContent}
        >
          <div className={styles.spinnerContainer}>
            <Spinner size="m" />
          </div>
          <Column gap="4" center>
            <Text 
              variant="heading-strong-l" 
              align="center"
              className={styles.loadingTitle}
            >
              {preselection.displayName ? `${preselection.displayName} wird geladen...` : 'Service wird geladen...'}
            </Text>
            {preselection.description && (
              <Text 
                variant="body-default-s" 
                onBackground="neutral-weak" 
                align="center"
                className={styles.loadingDescription}
              >
                {preselection.description}
              </Text>
            )}
          </Column>
        </Column>
      </div>
    );
  }

  return <>{children}</>;
});

/**
 * Hook-based service preloader for use in components.
 */
export function useServicePreloader() {
  const preselection = useServicePreselection();

  return {
    isPreselected: preselection.isValid,
    serviceParam: preselection.serviceParam,
    category: preselection.category,
    treatmentSlugs: preselection.treatmentSlugs,
    displayName: preselection.displayName,
    description: preselection.description,
    isLoading: preselection.serviceParam !== null && preselection.isValid
  };
}