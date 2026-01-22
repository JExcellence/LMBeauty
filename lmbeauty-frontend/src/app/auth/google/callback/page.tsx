/*
'use client';

import { useEffect, useState } from 'react';

export default function GoogleCallbackPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted on client
  if (typeof window === 'undefined' || !mounted) {
    return null;
  }

  return <div style={{ padding: '20px' }}>Google Callback - Client Only</div>;
}
*/


export default function GoogleCallbackPage() {
    return (<div/>)
}