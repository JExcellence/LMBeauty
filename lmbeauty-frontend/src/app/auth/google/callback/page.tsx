'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default function GoogleCallbackPage() {
    return (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh',
            padding: '20px'
        }}>
            <div>Google Authentication Callback</div>
        </div>
    );
}