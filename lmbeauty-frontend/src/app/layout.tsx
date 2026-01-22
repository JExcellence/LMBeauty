import '@once-ui-system/core/css/styles.css';
import '@once-ui-system/core/css/tokens.css';
import '@/resources/custom.scss';

import type { Metadata } from 'next';
import { Providers } from '@/components/providers/Providers';
import {baseURL, fonts, style} from '@/resources/once-ui.config';
import classNames from "classnames";
import {Background, Banner, Column, Flex, Icon, Meta} from "@once-ui-system/core";
import React from "react";
import {meta} from "@/resources";

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

export async function generateMetadata() {
    return Meta.generate({
        title: meta.home.title,
        description: meta.home.description,
        baseURL: baseURL,
        path: meta.home.path,
        image: meta.home.image,
    });
}

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
