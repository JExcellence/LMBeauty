import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ provider: string }> }
) {
    const { provider } = await params;
    
    try {
        const body = await request.json();
        const { code, state } = body;

        if (!code) {
            return NextResponse.json(
                { error: 'Authorization code is required' },
                { status: 400 }
            );
        }

        const response = await fetch(`${BACKEND_URL}/api/oauth/${provider}/callback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, state }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: errorData.message || 'OAuth callback failed' },
                { status: response.status }
            );
        }

        const apiResponse = await response.json();
        
        // Handle the new ApiResponse format
        if (!apiResponse.success) {
            return NextResponse.json(
                { error: apiResponse.error || apiResponse.message },
                { status: 400 }
            );
        }

        const authData = apiResponse.data;
        
        const res = NextResponse.json(authData);
        
        // Set cookies if authentication was successful
        if (authData.success && authData.accessToken) {
            res.cookies.set('accessToken', authData.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
            });
        }
        
        if (authData.success && authData.refreshToken) {
            res.cookies.set('refreshToken', authData.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
            });
        }

        return res;
    } catch (error) {
        console.error('OAuth callback error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
