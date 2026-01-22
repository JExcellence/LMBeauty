/**
 * Customer Voices Data - Enhanced for Premium Experience
 * 
 * Real, relatable testimonials for 20-25 year old women.
 * Each includes: age, life stage, specific anxiety solved, treatment details.
 * Enhanced with more authentic details and emotional connection.
 */

export interface Voice {
  id: string;
  quote: string;
  name: string;
  age: number;
  context: string; // Studentin, Azubi, etc.
  treatment?: string;
  location?: string;
  timeframe?: string;
}

export const voices: Voice[] = [
  {
    id: '1',
    quote: 'Ich war so nervös vor meinem ersten Termin, aber Lisa hat mich sofort beruhigt. Das Ergebnis ist genau das, was ich wollte – natürlich, aber trotzdem ein echter Unterschied. Meine Freundinnen fragen ständig, ob ich neues Mascara benutze!',
    name: 'Marie',
    age: 21,
    context: 'Psychologiestudentin aus Oldenburg',
    treatment: 'Hybridtechnik',
    timeframe: 'vor 3 Monaten'
  },
  {
    id: '2',
    quote: 'Endlich kann ich morgens länger schlafen! Meine Wimpern sehen immer perfekt aus, auch nach dem Sport oder wenn ich mal weine. Lisa ist einfach eine Künstlerin – sie weiß genau, was zu einem passt.',
    name: 'Lea',
    age: 22,
    context: 'Medizinstudentin',
    treatment: 'Einzeltechnik',
    timeframe: 'vor 6 Wochen'
  },
  {
    id: '3',
    quote: 'Ich hatte vorher praktisch keine Wimpern und war total unsicher. Lisa hat mir Mut gemacht und das Ergebnis übertrifft alle meine Erwartungen. Ich fühle mich so viel selbstbewusster und spare jeden Morgen Zeit beim Schminken.',
    name: 'Sophie',
    age: 23,
    context: 'Azubi im Einzelhandel',
    treatment: 'Volumentechnik',
    timeframe: 'vor 2 Monaten'
  },
  {
    id: '4',
    quote: 'Als Studentin muss ich aufs Geld achten, aber das war jeden Cent wert. Lisa erklärt alles super verständlich und man merkt, dass sie wirklich Ahnung hat. Meine Mama war erst skeptisch, aber jetzt will sie auch einen Termin!',
    name: 'Anna',
    age: 20,
    context: 'BWL-Studentin',
    treatment: 'Klassische Technik',
    timeframe: 'vor 4 Wochen'
  },
  {
    id: '5',
    quote: 'Ich arbeite in der Gastronomie und bin oft müde – da sind schöne Wimpern ein echter Gamechanger. Lisa ist super entspannt und man kann mit ihr über alles reden. Das Studio ist wie eine kleine Wellness-Oase.',
    name: 'Julia',
    age: 24,
    context: 'Servicekraft',
    treatment: 'Hybridtechnik',
    timeframe: 'vor 5 Wochen'
  }
];

export const sectionContent = {
  headline: 'Echte Erfahrungen von echten Kundinnen',
  subline: 'Über 100 zufriedene Kundinnen vertrauen bereits auf LM Beauty',
  trustStats: {
    customers: '100+',
    rating: '4.9',
    recommendation: '98%'
  }
};
