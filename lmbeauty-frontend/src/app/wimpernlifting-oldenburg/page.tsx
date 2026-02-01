import { Background, Column } from "@once-ui-system/core";
import { Metadata } from 'next';
import { ContactSection } from "@/components/sections";
import { Footer } from "@/components/footer/Footer";
import { FloatingContactButton } from "@/components/ui/FloatingContactButton";
import {
    WimpernliftingHero,
    WimpernliftingAbout,
    WimpernliftingProcess,
    WimpernliftingBenefits,
    WimpernliftingForWhom,
    WimpernliftingAftercare,
    WimpernliftingComparison,
    WimpernliftingGallery,
    WimpernliftingFAQCTA
} from './sections/index';

export const metadata: Metadata = {
    title: 'Wimpernlifting Oldenburg ab 49€ | Natürlich wacher Blick | LM Beauty',
    description: 'Professionelles Wimpernlifting in Oldenburg ✓ Deine eigenen Wimpern, nur schöner ✓ 6-8 Wochen Haltbarkeit ✓ Keratin-Versiegelung ✓ Nur 49€ ✓ Jetzt Termin bei LM Beauty buchen!',
    keywords: 'Wimpernlifting Oldenburg, Lash Lift Oldenburg, Wimpern Lifting, Wimpernlifting Preise Oldenburg, Wimpernlifting in meiner Nähe, LM Beauty Oldenburg, Wimpernlifting 26129, Keratin Wimpern, Wimpernlifting Erfahrung, Wimpernlifting Vorher Nachher',
    openGraph: {
        title: 'Wimpernlifting Oldenburg ab 49€ | LM Beauty',
        description: 'Professionelles Wimpernlifting in Oldenburg ✓ Natürlich wacher Blick ✓ 6-8 Wochen Haltbarkeit ✓ Jetzt buchen!',
        url: 'https://lmbeauty.de/wimpernlifting-oldenburg',
        siteName: 'LM Beauty Oldenburg',
        locale: 'de_DE',
        type: 'website',
        images: [
            {
                url: '/images/logo.png',
                width: 1200,
                height: 630,
                alt: 'LM Beauty Oldenburg - Wimpernlifting',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Wimpernlifting Oldenburg ab 49€ | LM Beauty',
        description: 'Professionelles Wimpernlifting in Oldenburg ✓ Natürlich wacher Blick ✓ Jetzt buchen!',
        images: ['/images/logo.png'],
    },
    alternates: {
        canonical: 'https://lmbeauty.de/wimpernlifting-oldenburg',
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

export default function WimpernliftingOldenburgPage() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Wimpernlifting",
        "provider": {
            "@type": "BeautySalon",
            "name": "LM Beauty Oldenburg",
            "address": {
                "@type": "PostalAddress",
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
        "offers": {
            "@type": "Offer",
            "price": "49",
            "priceCurrency": "EUR",
            "description": "Wimpernlifting inkl. Färbung und Keratin-Versiegelung"
        },
        "description": "Professionelles Wimpernlifting in Oldenburg bei Lisa. Natürlich schöne, geschwungene Wimpern für 6-8 Wochen. Inkl. Färbung und Keratin-Pflege.",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "reviewCount": "100"
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
                <WimpernliftingHero />
                <WimpernliftingAbout />
                <WimpernliftingProcess />
                <WimpernliftingBenefits />
                <WimpernliftingForWhom />
                <WimpernliftingGallery />
                <WimpernliftingAftercare />
                <WimpernliftingComparison />
                <WimpernliftingFAQCTA />
                <ContactSection />
                <Footer />
                <FloatingContactButton />
            </Column>
        </>
    );
}
