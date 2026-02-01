import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Wimpernlifting Oldenburg | Natürlich Wach | LM Beauty',
    description: 'Professionelles Wimpernlifting in Oldenburg ✓ Natürlicher Look ✓ 6-8 Wochen Haltbarkeit ✓ Nur 49€ ✓ Bloherfelder Str. 40 ✓ Jetzt Termin buchen!',
    keywords: 'Wimpernlifting Oldenburg, Lash Lift Oldenburg, Wimpern Lifting Oldenburg, Wimpernlifting Kosten Oldenburg, Wimpernlifting Studio Oldenburg',
    openGraph: {
        title: 'Wimpernlifting Oldenburg | LM Beauty',
        description: 'Professionelles Wimpernlifting in Oldenburg. Natürlicher Look für 6-8 Wochen. Nur 49€.',
        url: 'https://lmbeauty.de/wimpernlifting-oldenburg',
        type: 'website',
    },
    alternates: {
        canonical: 'https://lmbeauty.de/wimpernlifting-oldenburg',
    },
};

export default function WimpernliftingOldenburgLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
