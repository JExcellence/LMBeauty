"use client";

import React from 'react';
import { Column, Heading, Text } from "@once-ui-system/core";
import styles from './SeoContentSection.module.scss';

export const SeoContentSection: React.FC = () => {
    return (
        <Column
            fillWidth
            maxWidth="m"
            paddingY="xl"
            paddingX="l"
            gap="l"
            center
            as="section"
            aria-labelledby="seo-content-headline"
        >
            <Column>
                <Heading 
                    as="h2" 
                    id="seo-content-headline"
                    variant="heading-strong-l" 
                    align="center"
                    onBackground="brand-strong"
                >
                    Wimpernverlängerung & Wimpernlifting in Oldenburg
                </Heading>
            </Column>

            <Column>
                <Column gap="m">
                    <Text 
                        as="p" 
                        variant="body-default-m" 
                        onBackground="neutral-medium"
                        align="center"
                    >
                        Bei <strong>LM Beauty in Oldenburg</strong> bist du genau richtig, wenn du nach professioneller 
                        <strong> Wimpernverlängerung</strong> oder <strong>Wimpernlifting</strong> suchst. 
                        Ob natürlich mit der Einzeltechnik, voluminös mit der Volumen-Technik oder der perfekte 
                        Mix mit Hybrid – ich finde den Look, der zu dir passt.
                    </Text>

                    <Text 
                        as="p" 
                        variant="body-default-m" 
                        onBackground="neutral-medium"
                        align="center"
                    >
                        Mein <strong>Wimpernstudio in Oldenburg</strong> in der Bloherfelderstraße 40 ist dein 
                        Ort für entspannte Beauty-Treatments. Mit hochwertigen Produkten, hygienischen Standards 
                        und viel Liebe zum Detail sorge ich dafür, dass du dich rundum wohlfühlst.
                    </Text>

                    <Text 
                        as="p" 
                        variant="body-default-m" 
                        onBackground="neutral-medium"
                        align="center"
                    >
                        <strong>Wimpernlifting in Oldenburg</strong> ist die perfekte Alternative zur Verlängerung – 
                        deine eigenen Wimpern werden geschwungen, gefärbt und sehen sofort länger aus. 
                        Kein Kleben, kein Auffüllen, nur natürliche Schönheit.
                    </Text>
                </Column>
            </Column>
        </Column>
    );
};

export default SeoContentSection;
