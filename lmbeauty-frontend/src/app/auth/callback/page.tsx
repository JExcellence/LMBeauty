'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default function AuthCallbackPage() {
    return (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh',
            padding: '20px'
        }}>
            <div>Authentication Callback</div>
        </div>
    );
}