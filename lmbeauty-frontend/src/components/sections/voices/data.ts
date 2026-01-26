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

export const voices: Voice[] = [];

export const sectionContent = {
    headline: 'Echte Erfahrungen von echten Kundinnen',
    subline: 'Über 100 zufriedene Kundinnen vertrauen bereits auf LM Beauty',
    trustStats: {
        customers: '100+',
        rating: '4.9',
        recommendation: '98%'
    }
};
