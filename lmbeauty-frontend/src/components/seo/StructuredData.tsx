'use client';

import { schema } from '@/resources';

interface StructuredDataProps {
  type?: 'home' | 'service' | 'faq' | 'contact';
}

export function StructuredData({ type = 'home' }: StructuredDataProps) {
  const baseUrl = 'https://lmbeauty.de';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    '@id': `${baseUrl}/#organization`,
    name: schema.name,
    legalName: schema.legalName,
    url: baseUrl,
    logo: `${baseUrl}${schema.logo}`,
    image: `${baseUrl}${schema.logo}`,
    description: schema.description,
    email: schema.email,
    telephone: schema.phone,
    priceRange: schema.priceRange,
    founder: {
      '@type': 'Person',
      name: schema.founder,
    },
    foundingDate: schema.foundingDate,
    address: {
      '@type': 'PostalAddress',
      streetAddress: schema.address.streetAddress,
      addressLocality: schema.address.addressLocality,
      postalCode: schema.address.postalCode,
      addressRegion: schema.address.addressRegion,
      addressCountry: schema.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: schema.geo.latitude,
      longitude: schema.geo.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    sameAs: schema.sameAs,
    areaServed: {
      '@type': 'City',
      name: 'Oldenburg',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Beauty Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Wimpernverlängerung Einzeltechnik',
            description: 'Natürliche 1:1 Wimpernverlängerung für einen dezenten Look',
            provider: {
              '@id': `${baseUrl}/#organization`,
            },
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: '89',
            priceCurrency: 'EUR',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Wimpernverlängerung Hybrid',
            description: 'Perfekte Balance zwischen Natürlichkeit und Volumen',
            provider: {
              '@id': `${baseUrl}/#organization`,
            },
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: '109',
            priceCurrency: 'EUR',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Wimpernverlängerung Volumen',
            description: 'Maximales Volumen für einen dramatischen Look',
            provider: {
              '@id': `${baseUrl}/#organization`,
            },
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: '129',
            priceCurrency: 'EUR',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Wimpernlifting',
            description: 'Natürliche Wimpern, nur wacher und geschwungener',
            provider: {
              '@id': `${baseUrl}/#organization`,
            },
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: '49',
            priceCurrency: 'EUR',
          },
        },
      ],
    },
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#localbusiness`,
    name: schema.name,
    image: `${baseUrl}${schema.logo}`,
    telephone: schema.phone,
    email: schema.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: schema.address.streetAddress,
      addressLocality: schema.address.addressLocality,
      postalCode: schema.address.postalCode,
      addressCountry: schema.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: schema.geo.latitude,
      longitude: schema.geo.longitude,
    },
    url: baseUrl,
    priceRange: schema.priceRange,
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: schema.name,
    description: schema.description,
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    inLanguage: 'de-DE',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
    ],
  };

  const faqSchema = type === 'faq' ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Was kostet eine Wimpernverlängerung?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Einzeltechnik ab 89€, Hybrid ab 109€, Volumen ab 129€. Refills sind günstiger und beginnen bei 35€.',
        },
      },
      {
        '@type': 'Question',
        name: 'Wie lange halten Wimpernextensions?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Bei guter Pflege 2-4 Wochen, abhängig vom natürlichen Wimpernzyklus. Danach empfehlen wir ein Refill.',
        },
      },
      {
        '@type': 'Question',
        name: 'Tut eine Wimpernverlängerung weh?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nein, überhaupt nicht. Du liegst entspannt mit geschlossenen Augen. Viele Kundinnen schlafen dabei sogar ein.',
        },
      },
      {
        '@type': 'Question',
        name: 'Wie pflege ich meine Wimpernextensions?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Die ersten 24 Stunden kein Wasser. Danach täglich mit einem sauberen Bürstchen kämmen und ölfreie Produkte verwenden.',
        },
      },
    ],
  } : null;

  const schemas = [
    organizationSchema,
    localBusinessSchema,
    websiteSchema,
    breadcrumbSchema,
    ...(faqSchema ? [faqSchema] : []),
  ];

  return (
    <>
      {schemas.map((schemaData, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData),
          }}
        />
      ))}
    </>
  );
}
