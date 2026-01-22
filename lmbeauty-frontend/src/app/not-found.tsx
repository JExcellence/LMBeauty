import Link from 'next/link';

/**
 * 404 Not Found Page
 */
export default function NotFound() {
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
      <h1 style={{ fontSize: '4rem', fontWeight: 700, margin: 0 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Seite nicht gefunden</h2>
      <p style={{ color: '#666', maxWidth: '400px' }}>
        Die Seite, die du suchst, existiert leider nicht.
      </p>
      <Link 
        href="/" 
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          background: '#C4607A',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Zurück zur Startseite
      </Link>
    </div>
  );
}
