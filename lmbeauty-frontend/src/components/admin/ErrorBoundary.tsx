'use client';

import React, { Component, ReactNode } from 'react';
import { Text, Icon, Button } from '@once-ui-system/core';
import styles from './ErrorBoundary.module.scss';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.errorBoundary}>
          <div className={styles.errorIcon}>
            <Icon name="warning" size="xl" />
          </div>
          <Text className={styles.errorTitle}>Etwas ist schiefgelaufen</Text>
          <Text className={styles.errorDescription}>
            Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
          </Text>
          <div className={styles.errorActions}>
            <Button
              variant="primary"
              size="m"
              onClick={this.handleRetry}
              prefixIcon="refresh"
              style={{
                background: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)',
                border: 'none'
              }}
            >
              Erneut versuchen
            </Button>
            <Button
              variant="tertiary"
              size="m"
              onClick={() => window.location.reload()}
              prefixIcon="refresh"
            >
              Seite neu laden
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className={styles.errorDetails}>
              <summary>Fehlerdetails (nur in Entwicklung sichtbar)</summary>
              <pre className={styles.errorStack}>
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;