import {Service} from './types';

export const defaultServices: Service[] = [
    {
        id: 'einzeltechnik',
        slug: 'einzeltechnik',
        title: '1:1 Technik',
        personaTag: 'Der natürliche Weg',
        description: 'Bei der 1:1 Technik wird auf jede Naturwimper eine einzelne Wimper geklebt. Somit wird ein sehr natürliches Ergebnis erzielt.',
        price: {amount: 75, prefix: 'NEUANLAGE', currency: '€'},
        duration: 120,
        badge: 'refill' as const,
        bookingUrl: '/#contact?service=einzeltechnik',
        image: {
            src: "",
            alt: '1:1 Technik Wimpernverlängerung Oldenburg LM Beauty'
        },
        details: {
            refillPrices: [
                {weeks: 'bis 2 Wochen', price: '35€'},
                {weeks: 'ab 3 Wochen', price: '40€'},
                {weeks: 'ab 5 Wochen', price: '75€'}
            ],
            idealFor: [
                'Erstes Mal Wimpernverlängerung',
                'Alltag & Beruf',
                'Wer es natürlich mag'
            ],
            includes: [
                'Persönliche Beratung',
                'Augenpad-Anwendung',
                'Pflegehinweise'
            ]
        }
    },
    {
        id: 'hybridtechnik',
        slug: 'hybridtechnik',
        title: 'Hybrid Technik',
        personaTag: 'Mehr Fülle, natürlicher Ausdruck',
        description: 'Bei der Hybrid Technik werden abwechselnd Volumenfächer und Einzelwimpern auf die Naturwimpern geklebt. Perfekt für alle, die noch unsicher sind wie intensiv das Ergebnis werden soll.',
        price: {amount: 85, prefix: 'NEUANLAGE', currency: '€'},
        duration: 120,
        badge: 'popular' as const,
        bookingUrl: '/#contact?service=hybridtechnik',
        image: {
            src: "",
            alt: 'Hybrid Technik Wimpernverlängerung Oldenburg LM Beauty'
        },
        details: {
            refillPrices: [
                {weeks: 'bis 2 Wochen', price: '35€'},
                {weeks: 'bis 3 Wochen', price: '40€'},
                {weeks: 'bis 5 Wochen', price: '85€'}
            ],
            idealFor: [
                'Wer mehr möchte als 1:1 Technik',
                'Vielseitiger Alltag',
                'Besondere Anlässe'
            ],
            includes: [
                'Persönliche Beratung',
                'Augenpad-Anwendung',
                'Pflegehinweise'
            ]
        }
    },
    {
        id: 'volumentechnik',
        slug: 'volumentechnik',
        title: 'Volumen Technik',
        personaTag: 'Ausdrucksstark und definiert',
        description: 'Bei der Volumen Technik wird auf eine einzelne Naturwimper ein handgemachter Fächer gesetzt. Je nach Wunsch von leichtem Volumen bis Mega Volumen möglich.',
        price: {amount: 110, prefix: 'NEUANLAGE', currency: '€'},
        duration: 150,
        badge: 'premium' as const,
        bookingUrl: '/#contact?service=volumentechnik',
        image: {
            src: "",
            alt: 'Volumen Technik Wimpernverlängerung Oldenburg LM Beauty'
        },
        details: {
            refillPrices: [
                {weeks: 'bis 2 Wochen', price: '50€'},
                {weeks: 'bis 3 Wochen', price: '55€'},
                {weeks: 'bis 5 Wochen', price: '110€'}
            ],
            idealFor: [
                'Besondere Anlässe',
                'Fotoshootings & Events',
                'Wer einen starken Look bevorzugt'
            ],
            includes: [
                'Ausführliche Beratung',
                'Augenpad-Anwendung',
                'Pflegehinweise'
            ]
        }
    }
];

// Default testimonial data
export const defaultTestimonial = {
    quote: "Die Wimpernverlängerung bei LM Beauty ist einfach perfekt! Natürlich, langanhaltend und professionell gemacht.",
    author: "Sarah M.",
    service: "Wimpernverlängerung"
};

// Section content
export const sectionContent = {
    title: "Wimpernverlängerung",
    subtitle: "Deine Augen, nur wacher",
    description: "Professionelle Wimpernverlängerung mit verschiedenen Techniken für jeden Typ und Anlass.",
    refillNote: "Alle Preise verstehen sich als Neuanlage. Refill-Preise sind günstiger und abhängig vom Zeitabstand.",
    styleQuizUrl: "/style-quiz",
    styleQuizText: "Style-Quiz: Finde deinen perfekten Look",
    allServicesUrl: "/services",
    allServicesText: "Alle Services entdecken"
};