import {NextResponse} from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'https://api.lmbeauty.de';

// Fallback services data
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
            refillPrices: [
                {weeks: '2 Wochen', price: '45€'},
                {weeks: '3 Wochen', price: '55€'},
                {weeks: '4 Wochen', price: '65€'}
            ],
            idealFor: ['Erstes Mal Wimpernverlängerung', 'Alltag & Beruf', 'Wer es natürlich mag'],
            includes: ['Persönliche Beratung', 'Augenpad-Anwendung', 'Pflegehinweise']
        }
    },
    {
        id: 'hybridtechnik',
        slug: 'hybridtechnik',
        title: 'Hybrid Technik',
        personaTag: 'Die goldene Mitte',
        description: 'Die Hybrid-Technik kombiniert 1:1 und Volumentechnik für einen ausgewogenen Look mit natürlicher Fülle.',
        price: {amount: 85, prefix: 'ab', currency: '€'},
        duration: 150,
        image: {
            src: 'https://images.unsplash.com/photo-1583001809809-a62e8e7b9c4c?w=600&h=750&fit=crop&q=80',
            alt: 'Hybrid Technik Wimpernverlängerung – ausgewogener Look'
        },
        bookingUrl: '/#contact?service=hybridtechnik',
        details: {
            refillPrices: [
                {weeks: '2 Wochen', price: '50€'},
                {weeks: '3 Wochen', price: '60€'},
                {weeks: '4 Wochen', price: '70€'}
            ],
            idealFor: ['Mehr Volumen als 1:1', 'Besondere Anlässe', 'Ausgewogener Look'],
            includes: ['Persönliche Beratung', 'Augenpad-Anwendung', 'Pflegehinweise']
        }
    },
    {
        id: 'volumentechnik',
        slug: 'volumentechnik',
        title: 'Volumen Technik',
        personaTag: 'Der dramatische Auftritt',
        description: 'Bei der Volumentechnik werden mehrere feine Wimpern zu einem Fächer gebunden und auf eine Naturwimper gesetzt.',
        price: {amount: 95, prefix: 'ab', currency: '€'},
        duration: 180,
        image: {
            src: 'https://images.unsplash.com/photo-1583001809809-a62e8e7b9c4c?w=600&h=750&fit=crop&q=80',
            alt: 'Volumen Technik Wimpernverlängerung – dramatischer Look'
        },
        bookingUrl: '/#contact?service=volumentechnik',
        details: {
            refillPrices: [
                {weeks: '2 Wochen', price: '55€'},
                {weeks: '3 Wochen', price: '65€'},
                {weeks: '4 Wochen', price: '75€'}
            ],
            idealFor: ['Maximales Volumen', 'Glamouröser Look', 'Besondere Events'],
            includes: ['Persönliche Beratung', 'Augenpad-Anwendung', 'Pflegehinweise']
        }
    }
];

export async function GET() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/frontend/services/enhanced`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            next: {revalidate: 300}, // Cache for 5 minutes
        });

        if (!response.ok) {
            console.warn('Backend not available, using fallback data');
            return NextResponse.json({success: true, data: fallbackServices});
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json({success: true, data: fallbackServices});
    }
}
