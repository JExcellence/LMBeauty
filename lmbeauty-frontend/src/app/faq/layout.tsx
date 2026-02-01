import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'FAQ - Häufige Fragen zu Wimpernverlängerung & Wimpernlifting | LM Beauty Oldenburg',
    description: 'Alle Antworten zu Wimpernverlängerung, Wimpernlifting, Pflege, Preisen und Buchung in Oldenburg ✓ Ehrlich und verständlich erklärt ✓ Von Lisa bei LM Beauty',
    keywords: 'FAQ Wimpernverlängerung, FAQ Wimpernlifting, Wimpern Fragen, Wimpernverlängerung Oldenburg Fragen, Wimpernlifting Oldenburg Fragen, LM Beauty FAQ, Wimpern Pflege, Wimpern Haltbarkeit, Wimpern Preise',
    openGraph: {
        title: 'FAQ - Häufige Fragen zu Wimpern | LM Beauty Oldenburg',
        description: 'Alle Antworten zu Wimpernverlängerung, Wimpernlifting, Pflege und Preisen ✓ Ehrlich erklärt',
        url: 'https://lmbeauty.de/faq',
        siteName: 'LM Beauty Oldenburg',
        locale: 'de_DE',
        type: 'website',
        images: [
            {
                url: '/images/logo.png',
                width: 1200,
                height: 630,
                alt: 'LM Beauty Oldenburg - FAQ',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'FAQ - Häufige Fragen zu Wimpern | LM Beauty Oldenburg',
        description: 'Alle Antworten zu Wimpernverlängerung, Wimpernlifting, Pflege und Preisen',
        images: ['/images/logo.png'],
    },
    alternates: {
        canonical: 'https://lmbeauty.de/faq',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    other: {
        'geo.region': 'DE-NI',
        'geo.placename': 'Oldenburg',
        'geo.position': '53.1435;8.2146',
    }
};

export default function FAQLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Wie lange hält eine Wimpernverlängerung?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Eine Wimpernverlängerung hält 4-6 Wochen, abhängig von deinem natürlichen Wimpernzyklus und der Pflege. Mit regelmäßigen Refills alle 3-4 Wochen bleiben deine Wimpern dauerhaft perfekt."
                }
            },
            {
                "@type": "Question",
                "name": "Wie lange hält ein Wimpernlifting?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ein professionelles Lifting hält in der Regel 6 bis 8 Wochen, was dem natürlichen Wachstumszyklus deiner Wimpern entspricht."
                }
            },
            {
                "@type": "Question",
                "name": "Was kostet eine Wimpernverlängerung?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Einzeltechnik 89€, Hybrid 99€, Volumen 109€. Wimpernlifting kostet 49€. Alle Preise inkl. Beratung und Nachsorge."
                }
            },
            {
                "@type": "Question",
                "name": "Schädigt die Verlängerung meine Naturwimpern?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Bei fachgerechter Anwendung und richtiger Pflege werden deine Naturwimpern nicht beschädigt. Ich arbeite mit hochwertigen Produkten und achte darauf, dass jede Extension einzeln und mit dem richtigen Gewicht aufgebracht wird."
                }
            },
            {
                "@type": "Question",
                "name": "Tut Wimpernlifting weh?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Nein. Die Behandlung ist schmerzfrei und entspannend. Du liegst bequem, die Augen sind geschlossen. Viele Kundinnen schlafen sogar ein."
                }
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            {children}
        </>
    );
}
