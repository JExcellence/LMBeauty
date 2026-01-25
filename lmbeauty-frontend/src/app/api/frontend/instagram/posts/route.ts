import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'https://api.lmbeauty.de';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/frontend/instagram/posts`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      console.warn('Backend not available, Instagram posts unavailable');
      return NextResponse.json({ success: true, data: {} });
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    // Return empty data instead of error - Instagram is optional
    return NextResponse.json({ success: true, data: {} });
  }
}
