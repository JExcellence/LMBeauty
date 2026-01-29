/**
 * Extras Section Content Data
 * Secondary services as a stylist's quiet recommendation
 * Grouped by decision mindset, not service type
 */

import {ExtraService, ServiceGroup} from './types';

// Sanfte Veredelung — for those who want enhancement without drama
export const sanfteVeredelung: ExtraService[] = [
    {
        id: 'wimpernlifting',
        title: 'Wimpernlifting',
        description: 'Deine Naturwimpern, nur wacher.',
        bookingUrl: '/#contact?service=wimpernlifting',
    },
    {
        id: 'augenbrauenlifting',
        title: 'Augenbrauenlifting',
        description: 'Der Rahmen, der alles zusammenhält.',
        bookingUrl: '/#contact?service=augenbrauenlifting',
    },
];

// Feinschliff — finishing touches
export const feinschliff: ExtraService[] = [
    {
        id: 'zupfen-formen',
        title: 'Zupfen & Formen',
        description: 'Klare Linien, ohne viel Aufwand.',
        bookingUrl: '/#contact?service=zupfen-formen',
    },
    {
        id: 'naegel-shellac',
        title: 'Shellac Nägel',
        description: 'Gepflegt bis in die Fingerspitzen.',
        bookingUrl: '/#contact?service=naegel-shellac',
    },
];

export const serviceGroups: ServiceGroup[] = [
    {
        id: 'sanfte-veredelung',
        label: 'Sanfte Veredelung',
        services: sanfteVeredelung,
    },
    {
        id: 'feinschliff',
        label: 'Feinschliff',
        services: feinschliff,
    },
];

export const sectionContent = {
    // Headline with emphasis on "mehr" (colored word)
    headlinePre: 'Noch ein bisschen',
    headlineEmphasis: 'mehr',
    headlinePost: 'du',
    subline: 'Kleine Extras, die den Look abrunden — wenn du Lust hast.',
    stylistNote: 'Mein Tipp: Kombiniere deine Wimpern mit einem Lifting für den perfekten Rahmen.',
    ctaText: 'Alle Extras ansehen',
    ctaUrl: '/preise#extras',
};
