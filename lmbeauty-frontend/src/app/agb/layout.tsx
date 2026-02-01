import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AGB | LM Beauty Oldenburg',
    description: 'Allgemeine Geschäftsbedingungen von LM Beauty - Wimpernstudio in Oldenburg. Buchung, Stornierung und Zahlungsbedingungen.',
    robots: {
        index: false,
        follow: true,
    },
    alternates: {
        canonical: 'https://lmbeauty.de/agb',
    },
};

export default function AGBLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
