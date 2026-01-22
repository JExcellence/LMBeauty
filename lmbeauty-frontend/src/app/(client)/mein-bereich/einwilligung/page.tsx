/*
'use client';

import { useState, useEffect } from 'react';

export default function EinwilligungPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted on client
  if (typeof window === 'undefined' || !mounted) {
    return null;
  }

  return <div style={{ padding: '20px' }}>Einwilligung Page - Client Only</div>;
}
*/

export default function EinwilligungPage() {
    return (<div/>)
}