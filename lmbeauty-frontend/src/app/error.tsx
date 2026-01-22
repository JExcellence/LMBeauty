"use client";

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
      gap: '1rem',
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Etwas ist schiefgelaufen</h1>
      <p style={{ color: '#666', maxWidth: '400px' }}>
        Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.
      </p>
      <button
        onClick={reset}
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          background: '#C4607A',
          color: 'white',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Erneut versuchen
      </button>
    </div>
  );
}
