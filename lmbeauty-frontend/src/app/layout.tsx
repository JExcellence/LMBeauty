import '@once-ui-system/core/css/styles.css';
import '@once-ui-system/core/css/tokens.css';
import '@/resources/custom.scss';

import type { Metadata } from 'next';
import { Providers } from '@/components/providers/Providers';
import {baseURL, fonts, style} from '@/resources/once-ui.config';
import classNames from "classnames";
import {Background, Banner, Column, Flex, Icon} from "@once-ui-system/core";
import React from "react";
import {meta} from "@/resources";
import { StructuredData } from '@/components/seo/StructuredData';

const themeScript = `
  (function() {
    try {
      const root = document.documentElement;
      const defaultTheme = 'system';
      
      // Set defaults from config
      const config = ${JSON.stringify(style)};
      
      // Apply default values
      Object.entries(config).forEach(([key, value]) => {
        root.setAttribute('data-' + key, value);
      });
      
      // Resolve theme
      const resolveTheme = (themeValue) => {
        if (!themeValue || themeValue === 'system') {
          return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        }
        return themeValue;
      };
      
      // Apply saved theme
      const savedTheme = localStorage.getItem('data-theme');
      const resolvedTheme = resolveTheme(savedTheme);
      root.setAttribute('data-theme', resolvedTheme);
      
      // Apply any saved style overrides
      const styleKeys = Object.keys(config);
      styleKeys.forEach(key => {
        const value = localStorage.getItem('data-' + key);
        if (value) {
          root.setAttribute('data-' + key, value);
        }
      });
    } catch (e) {
      console.error('Failed to initialize theme:', e);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  })();
`;

export const metadata: Metadata = {
    metadataBase: new URL('https://lmbeauty.de'),
    title: {
        default: meta.home.title,
        template: '%s | LM Beauty Oldenburg'
    },
    description: meta.home.description,
    keywords: meta.home.keywords,
    authors: [{ name: 'LM Beauty Oldenburg', url: 'https://lmbeauty.de' }],
    creator: 'LM Beauty Oldenburg',
    publisher: 'LM Beauty Oldenburg',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
            { url: '/favicon.svg', type: 'image/svg+xml' },
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
    },
    manifest: '/site.webmanifest',
    openGraph: {
        type: 'website',
        locale: 'de_DE',
        url: 'https://lmbeauty.de',
        siteName: 'LM Beauty Oldenburg - Wimpernverlängerung & Wimpernlifting',
        title: meta.home.title,
        description: meta.home.description,
        images: [
            {
                url: '/images/og/home.jpg',
                width: 1200,
                height: 630,
                alt: 'LM Beauty Oldenburg - Wimpernverlängerung & Wimpernlifting Studio',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: meta.home.title,
        description: meta.home.description,
        images: ['/images/og/home.jpg'],
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
    alternates: {
        canonical: 'https://lmbeauty.de',
    },
    verification: {
        google: 'your-google-verification-code',
    },
};

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Flex
            suppressHydrationWarning
            data-scroll-behavior="smooth"
            as="html"
            lang="de"
            fillWidth
            className={classNames(
                fonts.heading.variable,
                fonts.body.variable,
                fonts.label.variable,
                fonts.code.variable,
            )}
        >
            <head title="">
                <script dangerouslySetInnerHTML={{ __html: themeScript}}/>
                <link rel="preconnect" href="https://lmbeauty.de" />
                <link rel="dns-prefetch" href="https://lmbeauty.de" />
                <StructuredData type="home" />
            </head>
            <Providers>
                <Column
                    as="body"
                    fillWidth
                    margin="0"
                    paddingBottom="0"
                    paddingX="0"
                    background="page"
                    style={{ minHeight: "100vh" }}
                >
                    <Banner position="fixed" top="0" right="0" left="0" zIndex={9} background="brand-alpha-strong" onSolid="brand-alpha-strong">
                        <Icon name="warning" size="s" />
                        Wir bauen gerade für dich – täglich kommen neue Features hinzu.
                    </Banner>
                    <Column>
                        {children}
                    </Column>
                </Column>
            </Providers>
        </Flex>
    );
}
