import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Datenschutz | LM Beauty Oldenburg',
    description: 'Datenschutzerklärung von LM Beauty - Informationen zum Umgang mit Ihren Daten gemäß DSGVO.',
    robots: {
        index: false,
        follow: true,
    },
    alternates: {
        canonical: 'https://lmbeauty.de/datenschutz',
    },
};

export default function DatenschutzLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
