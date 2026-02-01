import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Impressum | LM Beauty Oldenburg',
    description: 'Impressum und rechtliche Angaben von LM Beauty - Wimpernstudio in Oldenburg. Kontakt, Anschrift und Verantwortlicher.',
    robots: {
        index: false,
        follow: true,
    },
    alternates: {
        canonical: 'https://lmbeauty.de/impressum',
    },
};

export default function ImpressumLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
