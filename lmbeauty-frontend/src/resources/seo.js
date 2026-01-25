const schema = {
    logo: "/images/logo.png",
    type: "BeautySalon",
    name: "LM Beauty",
    legalName: "LM Beauty - Lisa Marie Pinske",
    title: "LM Beauty Oldenburg | Wimpernverlängerung & Lash Lifting Studio",
    description:
        "Professionelle Wimpernverlängerung in Oldenburg. Einzeltechnik, Hybrid & Volumen. Wimpernlifting, Augenbrauen & Nägel. Jetzt Termin buchen bei LM Beauty.",
    email: "info@lmbeauty.de",
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
    foundingDate: "2024",
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
        keywords: "Wimpernverlängerung Oldenburg, Lash Extensions, Wimpernlifting, Augenbrauen, Beauty Studio Oldenburg, Einzeltechnik, Hybrid Technik, Volumen Technik"
    },
    services: {
        title: "Wimpernverlängerung & Services | LM Beauty Oldenburg",
        description: "Einzeltechnik ab 89€, Hybrid ab 109€, Volumen ab 129€. Wimpernlifting, Augenbrauen & mehr. Professionell, hochwertig, mit Liebe zum Detail.",
        path: "/#services",
        image: "/images/og/services.jpg",
        keywords: "Wimpernverlängerung Preise, Lash Extensions Oldenburg, Wimpernlifting Kosten, Augenbrauen färben"
    },
    contact: {
        title: "Kontakt & Termin buchen | LM Beauty Oldenburg",
        description: "Buche deinen Termin bei LM Beauty in Oldenburg. WhatsApp, Telefon oder E-Mail. Bloherfelderstraße 40, 26129 Oldenburg.",
        path: "/#contact",
        image: "/images/og/contact.jpg",
        keywords: "Termin buchen Oldenburg, Wimpernstudio Oldenburg, Beauty Termin"
    },
    faq: {
        title: "Häufige Fragen | LM Beauty Oldenburg",
        description: "Alle Antworten zu Wimpernverlängerung, Pflege, Haltbarkeit und Preisen. Ehrlich und verständlich erklärt.",
        path: "/faq",
        image: "/images/og/faq.jpg",
        keywords: "Wimpernverlängerung FAQ, Lash Extensions Fragen, Wimpern Pflege"
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

export { meta, schema };
