/**
 * Reality Page Content Data
 * "Wie es wirklich ist" — Reassurance page
 * 
 * All German copy for the reality subpage.
 * Written as Lisa, warm and honest. Building trust for nervous first-timers.
 */

// ============================================
// Page Purpose Content
// ============================================
export const pageContent = {
  purpose: {
    headline: 'Wie es wirklich ist',
    subline: 'Für alle, die sich fragen, wie das so läuft.',
    intro: 'Ich weiß, dass der erste Termin aufregend ist. Deshalb erzähle ich dir hier, wie es bei mir abläuft — ganz ehrlich, ohne Übertreibung.',
  },
  section1: {
    headline: 'Was viele vorher denken',
    subline: 'Und wie es dann wirklich ist.',
  },
  section2: {
    headline: 'So läuft ein Termin ab',
    subline: 'Damit du weißt, was dich erwartet.',
  },
  section3: {
    headline: 'Das sagen andere nach ihrem ersten Mal',
    subline: 'Echte Stimmen von echten Kundinnen.',
  },
  cta: {
    headline: 'Bereit?',
    subline: 'Oder noch Fragen? Beides ist okay.',
    lisaNote: 'Wenn du unsicher bist, ruf mich einfach an. Wir quatschen kurz, ganz unverbindlich. Manchmal hilft das.',
  },
};

// ============================================
// Section 1: Die 3 Ängste
// ============================================
export interface Anxiety {
  id: string;
  fear: string;
  reality: string;
  proofType: 'video' | 'quote' | 'image';
  proofContent: {
    src?: string;
    quote?: string;
    author?: string;
    alt?: string;
  };
}

export const anxieties: Anxiety[] = [
  {
    id: 'pain',
    fear: '"Tut das weh?"',
    reality: 'Ehrlich? Die meisten schlafen ein. Du liegst entspannt da, Augen zu, und ich mache den Rest. Viele sagen danach, es war wie eine kleine Auszeit.',
    proofType: 'video',
    proofContent: {
      src: '/videos/relaxed-treatment.mp4',
      alt: 'Kundin entspannt während der Behandlung',
    },
  },
  {
    id: 'unnatural',
    fear: '"Sieht das nicht fake aus?"',
    reality: 'Wir besprechen vorher genau, was du dir wünschst. Ich mache nur, was zu dir passt. Natürlich ist mein Standard — niemand soll denken, du hast was machen lassen.',
    proofType: 'quote',
    proofContent: {
      quote: 'Meine Freundinnen dachten, ich hätte einfach gute Gene.',
      author: 'Lena, 22',
    },
  },
  {
    id: 'relax',
    fear: '"Kann ich überhaupt so lange stillliegen?"',
    reality: 'Du musst gar nichts tun. Einfach daliegen, Musik hören oder dösen. Viele nutzen die Zeit zum Abschalten — kein Handy, keine To-Dos, einfach mal Pause.',
    proofType: 'image',
    proofContent: {
      src: '/images/sleeping-client.jpg',
      alt: 'Kundin entspannt während der Behandlung',
    },
  },
];

// ============================================
// Section 2: So fühlt es sich an (Timeline)
// ============================================
export interface TimelineStep {
  id: string;
  time: string;
  expectation: string;
  reality: string;
  detail?: string;
}

export const timeline: TimelineStep[] = [
  {
    id: 'arrival',
    time: 'Wenn du ankommst',
    expectation: '"Hoffentlich ist es nicht awkward."',
    reality: 'Ich mache dir einen Tee, wir quatschen kurz. Kein Verkaufsgespräch, kein Stress. Einfach ankommen.',
    detail: 'Die meisten sind überrascht, wie gemütlich es hier ist.',
  },
  {
    id: 'treatment',
    time: 'Während der Behandlung',
    expectation: '"Muss ich die ganze Zeit stillhalten?"',
    reality: 'Du liegst bequem, Augen zu. Viele hören Musik oder Podcast, manche schlafen einfach ein. Ich sage dir Bescheid, wenn du dich kurz bewegen kannst.',
    detail: 'Die Zeit vergeht schneller als du denkst.',
  },
  {
    id: 'after',
    time: 'Wenn du gehst',
    expectation: '"Muss ich viel beachten?"',
    reality: 'Ich erkläre dir alles in 2 Minuten. Keine komplizierte Liste, nur ein paar einfache Sachen. Du bekommst auch eine kurze Anleitung mit.',
    detail: 'Und dann gehst du raus — mit neuen Wimpern und einem guten Gefühl.',
  },
];

// Was viele überrascht
export const surprisingDetail = {
  title: 'Was viele überrascht',
  content: 'Die meisten sagen danach, dass die 2 Stunden die entspannteste Zeit ihrer Woche waren. Kein Handy, keine Ablenkung, einfach mal nichts tun müssen.',
};

// ============================================
// Section 3: Relief Testimonials
// ============================================
export interface ReliefTestimonial {
  id: string;
  quote: string;
  name: string;
  age: number;
  context: string;
  theme: 'wish-sooner' | 'better-than-expected' | 'relief';
}

export const reliefTestimonials: ReliefTestimonial[] = [
  {
    id: 'marie',
    quote: 'Ich war so nervös vorher. Aber dann lag ich da, hab Musik gehört, und plötzlich war es vorbei. Ich hab mich gefragt, warum ich so lange gewartet habe.',
    name: 'Marie',
    age: 21,
    context: 'Nach ihrem ersten Termin',
    theme: 'relief',
  },
  {
    id: 'sophie',
    quote: 'Ich dachte, es wird unangenehm. Stattdessen bin ich eingeschlafen und aufgewacht mit Traumwimpern. Beste Entscheidung.',
    name: 'Sophie',
    age: 23,
    context: 'Hatte vorher Angst vor Schmerzen',
    theme: 'better-than-expected',
  },
  {
    id: 'anna',
    quote: 'Lisa hat mir alles erklärt und mich nicht zu irgendwas überredet. Das hat mir echt geholfen, mich wohlzufühlen.',
    name: 'Anna',
    age: 20,
    context: 'War vorher unsicher',
    theme: 'relief',
  },
];
