export const openingContent = {
    headline: 'Lisa Marie',
    subheadline: 'Deine Beauty-Expertin aus Oldenburg',
    intro: 'Seit 2019 arbeite ich mit Wimpern und Nägeln. Mein Studio ist ein ruhiger Ort, an dem du dich wohlfühlen kannst — ohne Hektik, nur für dich.',
    image: {
        src: '/images/lisa-portrait.jpg',
        alt: 'Lisa Marie - Beauty Expertin',
    },
};

export const journeyContent = {
    headline: 'Meine Reise',
    moments: [
        {
            year: '2019',
            title: 'Die Anfänge',
            text: 'Erste Schritte in der Beauty-Welt. Ich habe meine Leidenschaft für Wimpern entdeckt.',
            state: 'success' as const,
        },
        {
            year: '2023',
            title: 'Eigenes Studio',
            text: 'Mein erstes Homestudio. Ein Raum, der sich wie Zuhause anfühlt.',
            state: 'success' as const,
        },
        {
            year: 'Oktober 2024',
            title: 'Oldenburg',
            text: 'Umzug in mein neues Studio. Mehr Licht, mehr Ruhe, mehr Raum für dich.',
            state: 'active' as const,
        },
    ],
};

export const credentialsContent = {
    headline: 'Ausbildung & Zertifikate',
    note: 'In Arbeit — Zertifikate und Qualifikationen werden hier bald ergänzt.',
    items: [
        {
            title: 'Wimpernverlängerung',
            description: 'Zertifikat folgt',
            inProgress: true,
        },
        {
            title: 'Nageldesign',
            description: 'Zertifikat folgt',
            inProgress: true,
        },
    ],
};

export const valuesContent = {
    headline: 'Was mir wichtig ist',
    values: [
        {
            title: 'Zeit nehmen',
            text: 'Jede Behandlung bekommt den Raum, den sie braucht. Ich arbeite nie unter Zeitdruck.',
        },
        {
            title: 'Qualität',
            text: 'Ich verwende nur Materialien, denen ich vertraue. Premium-Produkte für ein sicheres Gefühl.',
        },
        {
            title: 'Zuhören',
            text: 'Deine Wünsche sind der Ausgangspunkt. Ich berate dich ehrlich und empfehle, was zu dir passt.',
        },
    ],
};

export const studioContent = {
    headline: 'Das Studio',
    location: 'Bloherfelder Straße 40, 26129 Oldenburg',
    description: 'Ein kleines, privates Studio. Ruhig, warm und nur für dich. Hier kannst du entspannen und dich wohlfühlen — ganz ohne Hektik.',
    image: {
        src: '/images/studio-interior.jpg',
        alt: 'LM Beauty Studio Innenansicht',
    },
    atmosphere: [
        'Private 1:1 Termine',
        'Ruhige Atmosphäre',
        'Flexible Terminzeiten',
        'Hochwertige Produkte',
    ],
};

export const closingContent = {
    headline: 'Ich freue mich auf dich',
    text: 'Wenn du Fragen hast oder einen Termin möchtest, melde dich gerne.',
    primaryCta: 'Termin buchen',
    primaryCtaUrl: '/#contact',
    secondaryCta: 'Nachricht schreiben',
    secondaryCtaUrl: 'tel:+4915259675346',
};
