import { Metadata } from 'next';
import { meta } from '@/resources';

export const metadata: Metadata = {
    title: meta.home.title,
    description: meta.home.description,
    keywords: meta.home.keywords,
    openGraph: {
        title: meta.home.title,
        description: meta.home.description,
        url: 'https://lmbeauty.de',
        type: 'website',
        images: [
            {
                url: meta.home.image,
                width: 1200,
                height: 630,
                alt: 'LM Beauty Oldenburg - Wimpernverlängerung & Wimpernlifting Studio',
            },
        ],
    },
    alternates: {
        canonical: 'https://lmbeauty.de',
    },
};

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
