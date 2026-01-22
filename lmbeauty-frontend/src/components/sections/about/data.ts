/**
 * About Section Content Data
 * 
 * German copy for the "Die Künstlerin" section.
 * Trust Transfer: Personal credibility without telling a life story.
 */

export interface AboutData {
  headline: string;
  bodyParagraphs: string[];
  credentials: string[];
  signature: string;
  experienceBadge: string;
  image: {
    src: string;
    alt: string;
  };
}

export const aboutData: AboutData = {
  headline: 'Über mich',
  
  bodyParagraphs: [
    'Ich bin Lisa — zertifizierte Lash Stylistin mit Leidenschaft für natürliche Eleganz. Mein Studio ist ein Ort der Ruhe, an dem Präzision und persönliche Beratung zusammenkommen.',
    'Jeder Look wird individuell auf dich abgestimmt.',
  ],
  
  credentials: [
    'Zertifizierte Stylistin',
    '500+ zufriedene Kundinnen',
    'Regelmäßige Fortbildung',
  ],
  
  signature: '— Lisa',
  
  experienceBadge: '5+ Jahre Erfahrung',
  
  image: {
    src: '/images/person/lisa_1.png',
    alt: 'Lisa - Lash Stylistin im Studio',
  },
};

export default aboutData;
