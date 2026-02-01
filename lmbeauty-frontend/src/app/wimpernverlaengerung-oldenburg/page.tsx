import { Background, Column } from "@once-ui-system/core";
import { Metadata } from 'next';
import { ContactSection } from "@/components/sections";
import { Footer } from "@/components/footer/Footer";
import { FloatingContactButton } from "@/components/ui/FloatingContactButton";
import {
    WimpernverlaengerungHero,
    WimpernverlaengerungAbout,
    WimpernverlaengerungTechniques,
    WimpernverlaengerungProcess,
    WimpernverlaengerungBenefits,
    WimpernverlaengerungForWhom,
    WimpernverlaengerungAftercare,
    WimpernverlaengerungGallery,
    WimpernverlaengerungComparison,
    WimpernverlaengerungFAQCTA
} from './sections/index';

export const metadata: Metadata = {
    title: 'Wimpernverlängerung Oldenburg ab 89€ | Einzeltechnik, Hybrid & Volumen | LM Beauty',
    description: 'Professionelle Wimpernverlängerung in Oldenburg ✓ Einzeltechnik, Hybrid & Volumentechnik ✓ 4-6 Wochen Haltbarkeit ✓ Hochwertige Produkte ✓ Ab 89€ ✓ Jetzt Termin bei LM Beauty buchen!',
    keywords: 'Wimpernverlängerung Oldenburg, Lash Extensions Oldenburg, Wimpern Extensions, Einzeltechnik Oldenburg, Hybrid Wimpern, Volumen Wimpern, Wimpernverlängerung Preise Oldenburg, LM Beauty Oldenburg, Wimpernverlängerung 26129, Wimpernverlängerung in meiner Nähe',
    openGraph: {
        title: 'Wimpernverlängerung Oldenburg ab 89€ | LM Beauty',
        description: 'Professionelle Wimpernverlängerung in Oldenburg ✓ Einzeltechnik, Hybrid & Volumen ✓ 4-6 Wochen Haltbarkeit ✓ Jetzt buchen!',
        url: 'https://lmbeauty.de/wimpernverlaengerung-oldenburg',
        siteName: 'LM Beauty Oldenburg',
        locale: 'de_DE',
        type: 'website',
        images: [
            {
                url: '/images/logo.png',
                width: 1200,
                height: 630,
                alt: 'LM Beauty Oldenburg - Wimpernverlängerung',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Wimpernverlängerung Oldenburg ab 89€ | LM Beauty',
        description: 'Professionelle Wimpernverlängerung in Oldenburg ✓ Einzeltechnik, Hybrid & Volumen ✓ Jetzt buchen!',
        images: ['/images/logo.png'],
    },
    alternates: {
        canonical: 'https://lmbeauty.de/wimpernverlaengerung-oldenburg',
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

export default function WimpernverlaengerungOldenburgPage() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Wimpernverlängerung",
        "provider": {
            "@type": "BeautySalon",
            "name": "LM Beauty Oldenburg",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Bloherfelderstraße 40",
                "addressLocality": "Oldenburg",
                "postalCode": "26129",
                "addressCountry": "DE"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "53.1435",
                "longitude": "8.2146"
            },
            "url": "https://lmbeauty.de",
            "telephone": "+4915259675346",
            "email": "lisa.pinske@lmbeauty.de"
        },
        "areaServed": {
            "@type": "City",
            "name": "Oldenburg"
        },
        "offers": [
            {
                "@type": "Offer",
                "name": "Einzeltechnik (1:1)",
                "price": "89",
                "priceCurrency": "EUR",
                "description": "Natürliche Wimpernverlängerung mit 1:1 Technik"
            },
            {
                "@type": "Offer",
                "name": "Hybridtechnik",
                "price": "99",
                "priceCurrency": "EUR",
                "description": "Mix aus Einzel- und Volumentechnik"
            },
            {
                "@type": "Offer",
                "name": "Volumentechnik",
                "price": "109",
                "priceCurrency": "EUR",
                "description": "Maximales Volumen mit Fächertechnik"
            }
        ],
        "description": "Professionelle Wimpernverlängerung in Oldenburg bei Lisa. Einzeltechnik, Hybrid oder Volumen - individuell auf dich abgestimmt. 4-6 Wochen Haltbarkeit mit hochwertigen Produkten.",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "reviewCount": "7"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <Column as="main" fillWidth>
                <Background
                    position="absolute"
                    fill
                    gradient={{
                        display: true,
                        opacity: 100,
                        x: 50,
                        y: 0,
                        colorStart: "brand-background-strong",
                        colorEnd: "brand-background-weak"
                    }}
                    mask={{
                        x: 50,
                        y: 0,
                        radius: 250
                    }}
                    zIndex={0}
                    style={{
                        willChange: 'auto',
                        contain: 'layout style paint'
                    }}
                    suppressHydrationWarning
                />
                <WimpernverlaengerungHero />
                <WimpernverlaengerungAbout />
                <WimpernverlaengerungTechniques />
                <WimpernverlaengerungProcess />
                <WimpernverlaengerungBenefits />
                <WimpernverlaengerungForWhom />
                <WimpernverlaengerungGallery />
                <WimpernverlaengerungAftercare />
                <WimpernverlaengerungComparison />
                <WimpernverlaengerungFAQCTA />
                <ContactSection />
                <Footer />
                <FloatingContactButton />
            </Column>
        </>
    );
}
