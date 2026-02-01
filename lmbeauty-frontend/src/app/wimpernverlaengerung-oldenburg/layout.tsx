import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Wimpernverlängerung Oldenburg | Professionell & Natürlich | LM Beauty',
    description: 'Professionelle Wimpernverlängerung in Oldenburg ✓ Einzeltechnik, Hybrid & Volumen ✓ 5.0 Sterne ✓ Bloherfelder Str. 40 ✓ Zertifiziert ✓ Jetzt Termin buchen!',
    keywords: 'Wimpernverlängerung Oldenburg, Lash Extensions Oldenburg, Wimpernstudio Oldenburg, Wimpern Oldenburg, Einzeltechnik Oldenburg, Hybrid Wimpern Oldenburg, Volumen Wimpern Oldenburg',
    openGraph: {
        title: 'Wimpernverlängerung Oldenburg | LM Beauty',
        description: 'Professionelle Wimpernverlängerung in Oldenburg. Einzeltechnik, Hybrid & Volumen. 5.0 Sterne Bewertung.',
        url: 'https://lmbeauty.de/wimpernverlaengerung-oldenburg',
        type: 'website',
    },
    alternates: {
        canonical: 'https://lmbeauty.de/wimpernverlaengerung-oldenburg',
    },
};

export default function WimpernverlaengerungOldenburgLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
