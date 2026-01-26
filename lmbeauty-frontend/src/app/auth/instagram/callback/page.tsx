'use client';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

export default function InstagramCallbackPage() {
    return (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh',
            padding: '20px'
        }}>
            <div>Instagram Authentication Callback</div>
        </div>
    );
}
