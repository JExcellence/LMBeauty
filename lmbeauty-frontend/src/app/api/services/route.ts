import {NextRequest, NextResponse} from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'https://api.lmbeauty.de';

export async function GET(request: NextRequest) {
    try {
        const {searchParams} = new URL(request.url);
        const category = searchParams.get('category');
        const all = searchParams.get('all');

        let endpoint = '/api/frontend/services';

        if (all === 'true') {
            endpoint = '/api/frontend/services/all';
        } else if (category) {
            endpoint = `/api/frontend/services/category/${category}`;
        }

        const response = await fetch(`${BACKEND_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Add cache control for better performance
            next: {revalidate: 300}, // Revalidate every 5 minutes
        });

        if (!response.ok) {
            console.error('Backend response not ok:', response.status, response.statusText);
            throw new Error(`Backend responded with ${response.status}`);
        }

        const data = await response.json();

        // The backend returns { success: true, data: [...] }
        if (data.success && data.data) {
            return NextResponse.json(data.data);
        } else {
            console.error('Backend returned unsuccessful response:', data);
            throw new Error('Backend returned unsuccessful response');
        }

    } catch (error) {
        console.error('Error fetching services:', error);

        // Return fallback data in case of error
        const fallbackServices = [
            {
                id: 'einzeltechnik',
                slug: 'einzeltechnik',
                title: '1:1 Technik',
                personaTag: 'Der natürliche Weg',
                description: 'Bei der 1:1 Technik wird auf jede Naturwimper eine einzelne Wimper geklebt. Somit wird ein sehr natürliches Ergebnis erzielt.',
                price: {amount: 75, prefix: 'ab', currency: '€'},
                duration: 120,
                image: {
                    src: 'https://images.unsplash.com/photo-1588528402605-6e6e1b8f2b3a?w=600&h=750&fit=crop&q=80',
                    alt: '1:1 Technik Wimpernverlängerung – natürlicher, definierter Look'
                },
                badge: 'popular',
                bookingUrl: '/#contact?service=einzeltechnik',
                details: {
                    refillPrices: [],
                    idealFor: ['Erstes Mal Wimpernverlängerung', 'Alltag & Beruf', 'Wer es natürlich mag'],
                    includes: ['Persönliche Beratung', 'Augenpad-Anwendung', 'Pflegehinweise']
                }
            }
        ];

        return NextResponse.json(fallbackServices);
    }
}