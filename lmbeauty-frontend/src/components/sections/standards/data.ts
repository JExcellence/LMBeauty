// Standards Section Data
// German copy for "Vertrauen durch Transparenz" section

export interface StandardCardData {
  icon: 'certificate' | 'sparkle' | 'book';
  title: string;
  description: string;
}

export interface StandardsData {
  headline: string;
  subheadline: string;
  cards: StandardCardData[];
  bannerText: string;
}

export const standardsData: StandardsData = {
  headline: 'Qualität & Hygiene',
  subheadline: 'Was du von mir erwarten kannst.',
  cards: [
    {
      icon: 'certificate',
      title: 'Zertifizierte Produkte',
      description: 'Ausschließlich hochwertige, dermatologisch getestete Materialien von führenden Herstellern.',
    },
    {
      icon: 'sparkle',
      title: 'Sterile Arbeitsweise',
      description: 'Jedes Werkzeug wird vor jeder Behandlung sterilisiert. Einwegmaterialien wo nötig.',
    },
    {
      icon: 'book',
      title: 'Regelmäßige Fortbildung',
      description: 'Kontinuierliche Weiterbildung für die neuesten Techniken und höchste Qualität.',
    },
  ],
  bannerText: 'Deine Sicherheit ist mir wichtig. Bei Fragen bin ich immer für dich da.',
};

export default standardsData;
