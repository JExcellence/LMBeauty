const schema = {
    logo: "/images/logo.png",
    type: "BeautySalon",
    name: "LM Beauty",
    legalName: "LM Beauty - Lisa Marie Pinske",
    title: "Wimpernverlängerung Oldenburg | LM Beauty - Lash Extensions & Wimpernlifting",
    description:
        "Professionelle Wimpernverlängerung & Wimpernlifting in Oldenburg ✓ Einzeltechnik ✓ Hybrid ✓ Volumen ✓ Natürlich schön oder glamourös ✓ Jetzt Termin bei LM Beauty buchen!",
    email: "lisa.pinske@lmbeauty.de",
    phone: "+4915259675346",
    locale: "de_DE",
    address: {
        streetAddress: "Bloherfelderstraße 40",
        addressLocality: "Oldenburg",
        postalCode: "26129",
        addressCountry: "DE",
        addressRegion: "Niedersachsen"
    },
    geo: {
        latitude: "53.1489",
        longitude: "8.2167"
    },
    openingHours: [
        "Mo-Fr 09:00-18:00",
        "Sa 10:00-16:00"
    ],
    priceRange: "€€",
    founder: "Lisa Marie Pinske",
    foundingDate: "2023",
    sameAs: [
        "https://instagram.com/_l.m_beauty_",
        "https://www.facebook.com/lmbeauty"
    ]
};

const meta = {
    home: {
        title: schema.title,
        description: schema.description,
        path: "/",
        image: "/images/og/home.jpg",
        keywords: "Wimpernverlängerung Oldenburg, Wimpernlifting Oldenburg, Lash Extensions Oldenburg, LM Beauty Oldenburg, Wimpernstudio Oldenburg, Einzeltechnik Wimpern, Hybrid Wimpern, Volumen Wimpern, Beauty Studio Oldenburg, Wimpern Oldenburg"
    },
    services: {
        title: "Wimpernverlängerung & Wimpernlifting Preise | LM Beauty Oldenburg",
        description: "Wimpernverlängerung ab 89€ ✓ Wimpernlifting ab 59€ ✓ Einzeltechnik, Hybrid & Volumen ✓ Professionell & hochwertig ✓ Jetzt Preise ansehen & Termin buchen!",
        path: "/#services",
        image: "/images/og/services.jpg",
        keywords: "Wimpernverlängerung Preise Oldenburg, Wimpernlifting Kosten, Lash Extensions Preise, Einzeltechnik Preis, Hybrid Wimpern Kosten, Volumen Wimpern Preis"
    },
    contact: {
        title: "Termin buchen | Wimpernstudio LM Beauty Oldenburg",
        description: "Jetzt Termin für Wimpernverlängerung oder Wimpernlifting buchen ✓ WhatsApp, Telefon oder E-Mail ✓ Bloherfelderstraße 40, 26129 Oldenburg",
        path: "/#contact",
        image: "/images/og/contact.jpg",
        keywords: "Termin buchen Wimpern Oldenburg, Wimpernstudio Oldenburg Termin, Beauty Termin Oldenburg, Wimpernverlängerung Termin"
    },
    faq: {
        title: "Häufige Fragen zu Wimpernverlängerung & Wimpernlifting | LM Beauty",
        description: "Alle Antworten zu Wimpernverlängerung, Wimpernlifting, Pflege, Haltbarkeit und Preisen. Ehrlich und verständlich erklärt.",
        path: "/faq",
        image: "/images/og/faq.jpg",
        keywords: "Wimpernverlängerung FAQ, Wimpernlifting Fragen, Lash Extensions Pflege, Wimpern Haltbarkeit"
    },
    impressum: {
        title: "Impressum | LM Beauty Oldenburg",
        description: "Impressum und rechtliche Angaben von LM Beauty - Wimpernstudio in Oldenburg",
        path: "/impressum",
        image: "/images/og/home.jpg"
    },
    agb: {
        title: "AGB | LM Beauty Oldenburg",
        description: "Allgemeine Geschäftsbedingungen von LM Beauty - Wimpernstudio in Oldenburg",
        path: "/agb",
        image: "/images/og/home.jpg"
    },
    datenschutz: {
        title: "Datenschutz | LM Beauty Oldenburg",
        description: "Datenschutzerklärung von LM Beauty - Informationen zum Umgang mit Ihren Daten",
        path: "/datenschutz",
        image: "/images/og/home.jpg"
    }
};

export {meta, schema};
