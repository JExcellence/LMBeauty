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
    context: string;
    treatment?: string;
    location?: string;
    timeframe?: string;
}

export const voices: Voice[] = [
    {
        id: '1',
        quote: 'Ich bin absolut begeistert von meiner Erfahrung bei Lisa! 💖 Die Arbeit ist nicht nur extrem sauber und professionell, sondern auch mit ganz viel Liebe zum Detail. Sie nimmt sich wirklich Zeit, geht auf individuelle Wünsche ein und sorgt dafür, dass man sich rundum wohlfühlt. Das Ergebnis ist wunderschön – natürlich, gleichmäßig und perfekt auf mich abgestimmt. Ich bekomme so viele Komplimente für meine Wimpern!',
        name: 'Leonie',
        age: -1,
        context: '',
        treatment: 'Hybridtechnik',
        timeframe: 'vor 5 Monaten'
    },
    {
        id: '2',
        quote: 'Ich war heute zum ersten Mal bei LM Beauty zur 1:1 wimpernverlängerung und bin sehr zufrieden mit dem Ergebnis. Sie nimmt sich wirklich viel Zeit, macht alles ganz genau. Sie strahlt eine unglaubliche Ruhe aus, das ich fast eingeschlafen wäre :D das ist mir bei meiner vorherigen nicht passiert.. Auch preislich bin ich sehr zufrieden !!!',
        name: 'Laura',
        age: -1,
        context: '',
        treatment: 'Einzeltechnik',
        timeframe: 'vor 7 Monaten'
    },
    {
        id: '3',
        quote: 'Ich hatte kürzlich das Vergnügen, eine Wimpernverlängerung machen zu lassen und ich bin absolut begeistert! Lisa ist nicht nur unglaublich professionell, sondern auch sehr freundlich und aufmerksam. Sie hat sich die Zeit genommen, meine Wünsche und Bedenken zu verstehen, und das Ergebnis ist einfach fantastisch. Meine Wimpern sehen natürlich und gleichzeitig atemberaubend aus. Der gesamte Prozess war entspannt und angenehm, und ich fühlte mich die ganze Zeit über in guten Händen. Ich kann den Service nur wärmstens empfehlen und werde definitiv wiederkommen!',
        name: 'Justin',
        age: 25,
        context: 'Fachinformatiker',
        treatment: 'Wimpernlifting',
        timeframe: 'vor 8 Monaten'
    },
    {
        id: '4',
        quote: 'Ich habe mir von Lisa ein Wimpernlifting machen lassen und bin rundum zufrieden! Sie ist sehr freundlich und zuvorkommend und das Ergebnis ihrer Arbeit ist hervorragend! Ich habe mich sehr wohl und gut beraten gefühlt! Ich komme auf jeden Fall wieder! Vielen Dank 😊',
        name: 'Jana',
        age: -1,
        context: '',
        treatment: 'Wimpernlifting',
        timeframe: 'vor einem Jahr'
    },
    {
        id: '5',
        quote: 'Ich war heute das erste Mal bei L&M beauty zum Wimpernlifting und bin begeistert! Es wurde sich Zeit genommen und wer hätte gedacht, dass ein Wimpernlifting gar nicht brennen muss ^^ Super freundlich, super Ergebnis! Ich komme definitiv wieder! Danke 🖤',
        name: 'Sabrina',
        age: -1,
        context: '',
        treatment: 'Wimpernlifting',
        timeframe: 'vor einem Jahr'
    },
    {
        id: '6',
        quote: 'Super freundlich, professionell, hygienisch und tolles Ergebnis. Kann ich nur empfehlen!',
        name: 'Emelie',
        age: -1,
        context: '',
        treatment: 'Volumentechnik',
        timeframe: 'vor 9 Monaten'
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
